import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Home, ListX, LogOut, Repeat2, Settings, Share2, Upload, X } from 'lucide-react'
import jsPDF from 'jspdf'
import { supabase } from './supabaseClient'
import './styles.css'
import { STICKER_ASSETS } from './stickerAssets'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'album', label: 'Álbum', icon: BookOpen },
  { id: 'quick', label: 'Carga', icon: Upload },
  { id: 'missing', label: 'Faltantes', icon: ListX },
  { id: 'dupes', label: 'Repetidas', icon: Repeat2 },
  { id: 'settings', label: 'Ajustes', icon: Settings }
]

const FLAGS = {
  ARG:'🇦🇷', POR:'🇵🇹', FRA:'🇫🇷', BRA:'🇧🇷', ESP:'🇪🇸', MEX:'🇲🇽', COL:'🇨🇴', ENG:'🏴', ECU:'🇪🇨',
  RSA:'🇿🇦', KOR:'🇰🇷', CZE:'🇨🇿', CAN:'🇨🇦', BIH:'🇧🇦', QAT:'🇶🇦', SUI:'🇨🇭', MAR:'🇲🇦', USA:'🇺🇸',
  PAR:'🇵🇾', AUS:'🇦🇺', TUR:'🇹🇷', GER:'🇩🇪', CUW:'🇨🇼', CIV:'🇨🇮', NED:'🇳🇱', JPN:'🇯🇵', SWE:'🇸🇪',
  TUN:'🇹🇳', BEL:'🇧🇪', EGY:'🇪🇬', IRI:'🇮🇷', NZL:'🇳🇿', CPV:'🇨🇻', KSA:'🇸🇦', URU:'🇺🇾', SEN:'🇸🇳',
  IRQ:'🇮🇶', NOR:'🇳🇴', DZA:'🇩🇿', AUT:'🇦🇹', JOR:'🇯🇴', COD:'🇨🇩', UZB:'🇺🇿', CRO:'🇭🇷', GHA:'🇬🇭', PAN:'🇵🇦'
}

function codeParts(code) {
  const match = String(code || '').match(/^([A-Z]+)(\d+)$/)
  return match ? { prefix: match[1], number: Number(match[2]) } : { prefix: '', number: 0 }
}

function toRangeText(items) {
  const groups = new Map()
  for (const item of items) {
    const prefix = item.prefix || codeParts(item.code).prefix
    const number = item.sticker_number || codeParts(item.code).number
    if (!groups.has(prefix)) groups.set(prefix, [])
    groups.get(prefix).push(number)
  }
  const result = []
  for (const [prefix, nums] of groups.entries()) {
    const sorted = [...new Set(nums)].sort((a, b) => a - b)
    if (!sorted.length) continue
    let start = sorted[0], prev = sorted[0]
    const parts = []
    for (let i = 1; i <= sorted.length; i++) {
      const n = sorted[i]
      if (n === prev + 1) prev = n
      else {
        parts.push(start === prev ? `${start}` : `${start}-${prev}`)
        start = n
        prev = n
      }
    }
    result.push(`${prefix} ${parts.join(', ')}`)
  }
  return result.join('\n')
}

function parseQuickInput(text) {
  const lines = text.split(/\n+/).map(v => v.trim()).filter(Boolean)
  const actions = []
  for (const line of lines) {
    const prefixMatch = line.match(/^([A-Za-z]+)\s+(.+)$/)
    if (!prefixMatch) continue
    const prefix = prefixMatch[1].toUpperCase()
    const chunks = prefixMatch[2].split(/[,;]+/).map(v => v.trim()).filter(Boolean)
    for (const chunk of chunks) {
      const dup = chunk.match(/^(\d+)\s*x\s*(\d+)$/i)
      if (dup) {
        actions.push({ prefix, from: Number(dup[1]), to: Number(dup[1]), count: Number(dup[2]) })
        continue
      }
      const range = chunk.match(/^(\d+)(?:\s*-\s*(\d+))?$/)
      if (range) {
        const a = Number(range[1]), b = Number(range[2] || range[1])
        actions.push({ prefix, from: Math.min(a, b), to: Math.max(a, b), count: 1 })
      }
    }
  }
  return actions
}

function stickerImage(sticker) {
  const code = String(sticker?.code || '').trim().toUpperCase()

  return (
    STICKER_ASSETS[code] ||
    sticker?.image_url ||
    sticker?.photo_url ||
    sticker?.image ||
    sticker?.asset_url ||
    ''
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authMsg, setAuthMsg] = useState('')
  const [tab, setTab] = useState('dashboard')
  const [teams, setTeams] = useState([])
  const [stickers, setStickers] = useState([])
  const [status, setStatus] = useState({})
  const [selectedTeamCode, setSelectedTeamCode] = useState('MEX')
  const [quickText, setQuickText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.user) loadData(session.user.id)
  }, [session])

  async function signInWithGitHub() {
    setAuthLoading(true)
    setAuthMsg('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: window.location.origin } })
    if (error) { setAuthMsg(error.message); setAuthLoading(false) }
  }

  async function loadData(userId) {
    setLoading(true)
    const [teamsRes, stickersRes, statusRes] = await Promise.all([
      supabase.from('teams').select('*').order('sort_order', { ascending: true }),
      supabase.from('stickers').select('*').order('sort_order', { ascending: true }),
      supabase.from('user_stickers').select('*').eq('user_id', userId)
    ])
    if (teamsRes.data) setTeams(teamsRes.data)
    if (stickersRes.data) setStickers(stickersRes.data)
    const bySticker = {}
    for (const row of statusRes.data || []) bySticker[row.sticker_id] = row
    setStatus(bySticker)
    setLoading(false)
  }

  async function upsertStatus(sticker, patch) {
    if (!session?.user) return
    const current = status[sticker.id] || {}
    const next = {
      user_id: session.user.id,
      sticker_id: sticker.id,
      is_missing: Boolean(patch.is_missing ?? current.is_missing ?? false),
      duplicate_count: Number(patch.duplicate_count ?? current.duplicate_count ?? 0),
      updated_at: new Date().toISOString()
    }
    if (next.is_missing) next.duplicate_count = 0
    if (next.duplicate_count > 0) next.is_missing = false
    const { data, error } = await supabase.from('user_stickers').upsert(next, { onConflict: 'user_id,sticker_id' }).select().single()
    if (!error && data) setStatus(prev => ({ ...prev, [sticker.id]: data }))
  }

  const orderedTeams = useMemo(() => [...teams].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)), [teams])
  const selectedIndex = Math.max(0, orderedTeams.findIndex(t => t.code === selectedTeamCode))
  const selectedTeam = orderedTeams[selectedIndex] || orderedTeams[0]
  const teamStickers = stickers.filter(s => s.team_id === selectedTeam?.id).sort((a, b) => a.sticker_number - b.sticker_number)
  const missing = stickers.filter(s => status[s.id]?.is_missing)
  const duplicates = stickers.filter(s => (status[s.id]?.duplicate_count || 0) > 0)
  const haveCount = stickers.length - missing.length
  const percent = stickers.length ? Math.round((haveCount / stickers.length) * 100) : 0
  const totalDupes = duplicates.reduce((sum, s) => sum + (status[s.id]?.duplicate_count || 0), 0)
  const teamMissing = teamStickers.filter(s => status[s.id]?.is_missing).length
  const teamHave = teamStickers.length - teamMissing
  const crestSticker =
    teamStickers.find(s => Number(s.sticker_number) === 1) ||
    teamStickers.find(s => String(s.code || '').trim().toUpperCase() === `${String(selectedTeam?.code || '').trim().toUpperCase()}1`) ||
    teamStickers[0]

  const crestCode = `${String(selectedTeam?.code || '').trim().toUpperCase()}1`
  const crestImage = STICKER_ASSETS[crestCode] || stickerImage(crestSticker)

  const teamStats = useMemo(() => teams.map(team => {
    const rows = stickers.filter(s => s.team_id === team.id)
    const miss = rows.filter(s => status[s.id]?.is_missing).length
    return { ...team, total: rows.length, missing: miss, have: rows.length - miss }
  }), [teams, stickers, status])

  function navigateTeam(delta) {
    if (!orderedTeams.length) return
    const next = (selectedIndex + delta + orderedTeams.length) % orderedTeams.length
    setSelectedTeamCode(orderedTeams[next].code)
  }

  async function applyQuick(mode) {
    const actions = parseQuickInput(quickText)
    for (const action of actions) {
      const matched = stickers.filter(s => s.prefix === action.prefix && s.sticker_number >= action.from && s.sticker_number <= action.to)
      for (const sticker of matched) {
        if (mode === 'missing') await upsertStatus(sticker, { is_missing: true, duplicate_count: 0 })
        if (mode === 'duplicate') {
          const current = status[sticker.id]?.duplicate_count || 0
          await upsertStatus(sticker, { is_missing: false, duplicate_count: current + action.count })
        }
      }
    }
    setQuickText('')
  }

  function exportMissingPdf() {
    const doc = new jsPDF()
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18)
    doc.text('Paulo FIFA26 Tracker App - Faltantes', 14, 18)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
    doc.text(`Actualizado: ${new Date().toLocaleString('es-CL')}`, 14, 26)
    let y = 38
    const byTeam = new Map()
    for (const sticker of missing) {
      const team = teams.find(t => t.id === sticker.team_id)
      const key = team ? `${team.code} - ${team.name}` : sticker.prefix
      if (!byTeam.has(key)) byTeam.set(key, [])
      byTeam.get(key).push(sticker)
    }
    for (const [team, rows] of byTeam.entries()) {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setFont('helvetica', 'bold'); doc.text(team, 14, y); y += 6
      doc.setFont('helvetica', 'normal')
      const split = doc.splitTextToSize(toRangeText(rows), 180)
      doc.text(split, 14, y); y += split.length * 5 + 5
    }
    doc.save('FIFA26-faltantes.pdf')
  }

  if (!session) return <div className="loginShell"><div className="loginCard">
    <div className="brand">Paulo FIFA<span>26</span></div>
    <h1>Tracker de álbum</h1>
    <p>Entra con GitHub para sincronizar tu álbum en todos tus dispositivos.</p>
    <button onClick={signInWithGitHub} disabled={authLoading}>{authLoading ? 'Redirigiendo...' : 'Continuar con GitHub'}</button>
    {authMsg && <small>{authMsg}</small>}
  </div></div>

  return <div className="appShell">
    <header className="topbar">
      <button className="iconBtn"><BookOpen size={22}/></button>
      <strong>Paulo FIFA<span>26</span> Tracker App</strong>
      <button className="iconBtn" onClick={() => supabase.auth.signOut()}><LogOut size={18}/></button>
    </header>

    <main className="content">
      {loading && <div className="panel">Cargando álbum...</div>}

      {!loading && tab === 'dashboard' && <Dashboard percent={percent} haveCount={haveCount} missingCount={missing.length} totalDupes={totalDupes} teams={[...teamStats].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0))} openTeam={(code) => { setSelectedTeamCode(code); setTab('album') }} />}

      {!loading && tab === 'album' && <section className="countryView">
        <div className="countryHero">
          <button className="countryArrow" onClick={() => navigateTeam(-1)} aria-label="País anterior"><ArrowLeft size={22}/><span>Anterior</span></button>
          <div className="countryIdentity">
            {crestSticker ? (
              <button
                type="button"
                className={`crestSticker ${status[crestSticker.id]?.is_missing ? 'missing' : 'owned'}`}
                onClick={() => upsertStatus(crestSticker, { is_missing: !Boolean(status[crestSticker.id]?.is_missing), duplicate_count: 0 })}
                aria-label={`${crestSticker.code}: ${status[crestSticker.id]?.is_missing ? 'Marcar como tengo' : 'Marcar como falta'}`}
              >
                {crestImage ? (
                  <img src={crestImage} alt={`Figurita ${crestCode} - escudo de ${selectedTeam?.name}`} />
                ) : (
                  <div className="crestFallback">{FLAGS[selectedTeam?.code] || '🏳️'}</div>
                )}
                <span className="crestCode">{crestCode}</span>
                <span className="crestState">{status[crestSticker.id]?.is_missing ? 'Falta' : 'Tengo'}</span>
              </button>
            ) : (
              <div className="crestFallback">
                {crestImage ? <img src={crestImage} alt={`Escudo de ${selectedTeam?.name}`} /> : (FLAGS[selectedTeam?.code] || '🏳️')}
              </div>
            )}
            <div><h1>{selectedTeam?.name} <b>{selectedTeam?.code}</b></h1><p>{FLAGS[selectedTeam?.code] || '🏳️'} {teamStickers.length} figuritas</p></div>
          </div>
          <div className="countryMetrics">
            <div><span>Álbum global</span><strong>{percent}%</strong><small>{missing.length} faltantes</small></div>
            <div><span>{selectedTeam?.name}</span><strong>{teamHave}/{teamStickers.length}</strong><small>{teamMissing} faltantes</small></div>
          </div>
          <button className="countryArrow" onClick={() => navigateTeam(1)} aria-label="País siguiente"><ArrowRight size={22}/><span>Siguiente</span></button>
        </div>

        <AlbumPage title="Página izquierda (1–10)" stickers={teamStickers.slice(0,10).filter(s => Number(s.sticker_number) !== 1)} status={status} onUpdate={upsertStatus}/>
        <AlbumPage title="Página derecha (11–20)" stickers={teamStickers.slice(10,20)} status={status} onUpdate={upsertStatus}/>
      </section>}

      {!loading && tab === 'quick' && <section className="panel"><h1>Carga rápida</h1><p>Ejemplos: <b>MEX 2,5,7-9</b> o <b>ARG 3x2,10x3</b></p><textarea value={quickText} onChange={e => setQuickText(e.target.value)} placeholder={'MEX 2,5,7-9\nARG 3x2,10x3'} /><button className="danger" onClick={() => applyQuick('missing')}>Marcar faltantes</button><button className="primary" onClick={() => applyQuick('duplicate')}>Registrar repetidas</button></section>}

      {!loading && tab === 'missing' && <ListPage title="Faltantes" rows={missing} status={status} teams={teams} empty="No tienes faltantes registrados." action={<button className="primary" onClick={exportMissingPdf}><Share2 size={16}/> Exportar PDF</button>} />}
      {!loading && tab === 'dupes' && <ListPage title="Mis repetidas" rows={duplicates} status={status} teams={teams} empty="No tienes repetidas registradas." />}
      {!loading && tab === 'settings' && <section className="panel"><h1>Ajustes</h1><p>Usuario: {session.user.user_metadata?.user_name || session.user.email}</p><button className="primary" onClick={exportMissingPdf}><Share2 size={16}/> Exportar faltantes</button></section>}
    </main>

    <nav className="bottomNav">{TABS.map(t => { const Icon = t.icon; return <button key={t.id} onClick={() => setTab(t.id)} className={tab === t.id ? 'active' : ''}><Icon size={20}/><span>{t.label}</span></button> })}</nav>
  </div>
}

function Dashboard({ percent, haveCount, missingCount, totalDupes, teams, openTeam }) {
  return <section className="dashboard">
    <div className="dashboardTop">
      <div className="progressCard"><div className="ring" style={{ background: `conic-gradient(#2e8cff ${percent}%, #18334b 0)` }}><b>{percent}%</b></div><div><span>Completado</span><strong>{haveCount}</strong><small>figuritas registradas</small></div></div>
      <div className="metricBox"><span>Faltantes</span><b>{missingCount}</b></div>
      <div className="metricBox"><span>Repetidas</span><b>{totalDupes}</b></div>
    </div>
    <div className="sectionTitle"><div><h2>Países</h2><p>Orden del álbum</p></div></div>
    <div className="countryList">{teams.map((t, index) => {
      const pct = t.total ? Math.round((t.have / t.total) * 100) : 0
      return <button key={t.id} className="countryRow" onClick={() => openTeam(t.code)}>
        <span className="order">{index + 1}</span><span className="flag">{FLAGS[t.code] || '🏳️'}</span>
        <span className="countryName"><b>{t.name}</b><small>{t.code}</small></span>
        <span className="miniProgress"><i style={{ width: `${pct}%` }} /></span>
        <span className="countryCount"><b>{t.have}/{t.total}</b><small>{t.missing ? `Faltan ${t.missing}` : '¡Completo!'}</small></span><ChevronRight size={18}/>
      </button>
    })}</div>
  </section>
}

function AlbumPage({ title, stickers, status, onUpdate }) {
  return <div className="albumPage"><h3>{title}</h3><div className="grid10">{stickers.map(sticker => <StickerCard key={sticker.id} sticker={sticker} row={status[sticker.id]} onUpdate={onUpdate}/>)}</div></div>
}

function StickerCard({ sticker, row, onUpdate }) {
  const missing = Boolean(row?.is_missing)
  const img = stickerImage(sticker)
  return <button className={`sticker ${missing ? 'missing' : 'owned'}`} onClick={() => onUpdate(sticker, { is_missing: !missing, duplicate_count: 0 })}>
    <div className="stickerImage">{img ? <img src={img} alt={sticker.display_name || sticker.player_name || sticker.code} /> : <div className="placeholder">{sticker.sticker_number}</div>}</div>
    <b>{sticker.code}</b><span>{sticker.display_name || sticker.player_name || 'Figurita'}</span>
    <em>{missing ? <><X size={12}/> Falta</> : <><Check size={12}/> Tengo</>}</em>
  </button>
}

function ListPage({ title, rows, status, teams, empty, action }) {
  const grouped = rows.reduce((acc, s) => {
    const team = teams.find(t => t.id === s.team_id)
    const key = team ? `${team.name} (${team.code})` : s.prefix
    ;(acc[key] ||= []).push(s)
    return acc
  }, {})
  return <section className="panel"><div className="listHeader"><h1>{title}</h1>{action}</div>{rows.length === 0 && <p>{empty}</p>}{Object.entries(grouped).map(([team, items]) => <div key={team} className="group"><h3>{team}</h3>{items.map(s => <div className="listRow" key={s.id}><span>{s.code}</span><b>{s.display_name || s.player_name || 'Figurita'}</b><em>{status[s.id]?.duplicate_count ? `x${status[s.id].duplicate_count}` : ''}</em></div>)}</div>)}</section>
}

createRoot(document.getElementById('root')).render(<App />)
