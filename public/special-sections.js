(() => {
  const REF = 'tmlhnjhapjvazqonjgzs'
  const API = `https://${REF}.supabase.co/rest/v1`
  const ANON = 'sb_publishable_iWsWxO6yItTW2C4oCMgsLg_6fiiPJk_'
  const state = { mounted: false, sections: [], stickers: [], rows: new Map(), session: null }

  function authSession() {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (!key?.startsWith(`sb-${REF}-auth-token`)) continue
      try {
        const value = JSON.parse(localStorage.getItem(key))
        if (value?.access_token && value?.user?.id) return value
      } catch {}
    }
    return null
  }

  function headers(prefer) {
    const token = state.session?.access_token || ANON
    return {
      apikey: ANON,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {})
    }
  }

  async function get(path) {
    const res = await fetch(`${API}/${path}`, { headers: headers() })
    if (!res.ok) throw new Error(`Supabase ${res.status}`)
    return res.json()
  }

  async function load() {
    state.session = authSession()
    if (!state.session) return
    const userId = encodeURIComponent(state.session.user.id)
    const [sections, stickers, rows] = await Promise.all([
      get('sections?select=id,code,name,sort_order&order=sort_order.asc'),
      get('stickers?select=id,code,sticker_number,display_name,player_name,section_id,sort_order&section_id=not.is.null&order=sort_order.asc'),
      get(`user_stickers?select=*&user_id=eq.${userId}`)
    ])
    state.sections = sections
    state.stickers = stickers
    state.rows = new Map(rows.map(row => [row.sticker_id, row]))
    mount()
  }

  function style() {
    if (document.getElementById('specialSectionsStyle')) return
    const el = document.createElement('style')
    el.id = 'specialSectionsStyle'
    el.textContent = `
      .specialSections{margin-top:28px}.specialSections h2{margin:0}.specialSections p{margin:4px 0 14px;color:#8faabd}
      .specialGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
      .specialOpen{border:1px solid #23455d;background:#102c40;color:#fff;border-radius:14px;padding:14px;text-align:left;cursor:pointer}
      .specialOpen b{display:block;font-size:15px}.specialOpen span{color:#8fcfff;font-size:12px}
      .specialModal{position:fixed;inset:0;background:#06131fd9;z-index:9999;display:grid;place-items:center;padding:18px}
      .specialPanel{width:min(920px,100%);max-height:88vh;overflow:auto;background:#0b2233;border:1px solid #315a73;border-radius:18px;padding:18px;color:#fff}
      .specialHead{display:flex;justify-content:space-between;align-items:center;gap:12px}.specialHead button{border:0;background:#173e57;color:#fff;border-radius:10px;padding:9px 12px}
      .specialCards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:16px}
      .specialSticker{border:1px solid #2c536a;background:#123247;color:#fff;border-radius:13px;padding:12px;text-align:left;cursor:pointer}
      .specialSticker.missing{border-color:#ef6a6a;background:#3e2026}.specialSticker b{display:block;color:#78c7ff}.specialSticker span{display:block;margin:6px 0;min-height:34px}.specialSticker em{font-style:normal;font-size:12px}
    `
    document.head.appendChild(el)
  }

  function mount() {
    const dashboard = document.querySelector('.dashboard')
    if (!dashboard || document.querySelector('.specialSections')) return
    style()
    const box = document.createElement('section')
    box.className = 'specialSections'
    const total = state.stickers.length
    box.innerHTML = `<h2>Secciones especiales</h2><p>${total} figuritas adicionales del álbum</p><div class="specialGrid"></div>`
    const grid = box.querySelector('.specialGrid')
    for (const section of state.sections) {
      const items = state.stickers.filter(s => s.section_id === section.id)
      const missing = items.filter(s => state.rows.get(s.id)?.is_missing).length
      const button = document.createElement('button')
      button.className = 'specialOpen'
      button.innerHTML = `<b>${section.name}</b><span>${items.length} figuritas · ${missing} faltantes</span>`
      button.addEventListener('click', () => openSection(section, items))
      grid.appendChild(button)
    }
    dashboard.appendChild(box)
  }

  function openSection(section, items) {
    const modal = document.createElement('div')
    modal.className = 'specialModal'
    const panel = document.createElement('div')
    panel.className = 'specialPanel'
    panel.innerHTML = `<div class="specialHead"><div><h2>${section.name}</h2><small>${items.length} figuritas</small></div><button type="button">Cerrar</button></div><div class="specialCards"></div>`
    panel.querySelector('button').addEventListener('click', () => modal.remove())
    const cards = panel.querySelector('.specialCards')
    for (const sticker of items) cards.appendChild(stickerButton(sticker))
    modal.appendChild(panel)
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
    document.body.appendChild(modal)
  }

  function stickerButton(sticker) {
    const row = state.rows.get(sticker.id)
    const button = document.createElement('button')
    button.className = `specialSticker ${row?.is_missing ? 'missing' : ''}`
    button.innerHTML = `<b>${sticker.code}</b><span>${sticker.display_name || sticker.player_name || 'Figurita'}</span><em>${row?.is_missing ? 'Falta' : 'Tengo'}</em>`
    button.addEventListener('click', async () => {
      const current = state.rows.get(sticker.id) || {}
      const next = {
        user_id: state.session.user.id,
        sticker_id: sticker.id,
        is_missing: !Boolean(current.is_missing),
        duplicate_count: 0,
        updated_at: new Date().toISOString()
      }
      const res = await fetch(`${API}/user_stickers?on_conflict=user_id,sticker_id`, {
        method: 'POST', headers: headers('resolution=merge-duplicates,return=representation'), body: JSON.stringify(next)
      })
      if (!res.ok) return
      const saved = (await res.json())[0] || next
      state.rows.set(sticker.id, saved)
      button.classList.toggle('missing', saved.is_missing)
      button.querySelector('em').textContent = saved.is_missing ? 'Falta' : 'Tengo'
    })
    return button
  }

  const observer = new MutationObserver(() => {
    if (document.querySelector('.dashboard') && !document.querySelector('.specialSections')) load().catch(console.error)
  })
  observer.observe(document.documentElement, { childList: true, subtree: true })
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => load().catch(console.error), { once: true })
  else load().catch(console.error)
})()
