import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, Home, BookOpen, ListX, Repeat2, Settings, Share2, Minus, Plus, UserRound, Check, X, Upload, LogOut } from 'lucide-react'
import jsPDF from 'jspdf'
import { supabase } from './supabaseClient'
import './styles.css'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'album', label: 'Álbum', icon: BookOpen },
  { id: 'quick', label: 'Carga', icon: Upload },
  { id: 'missing', label: 'Faltantes', icon: ListX },
  { id: 'dupes', label: 'Repetidas', icon: Repeat2 },
  { id: 'settings', label: 'Ajustes', icon: Settings }
]

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
    let start = sorted[0], prev = sorted[0]
    const parts = []
    for (let i = 1; i <= sorted.length; i++) {
      const n = sorted[i]
      if (n === prev + 1) {
        prev = n
      } else {
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
  const chunks = text.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean)
  const actions = []
  for (const chunk of chunks) {
    const duplicateMatch = chunk.match(/^([A-Za-z]+)\s*(\d+)\s*x\s*(\d+)$/i)
    if (duplicateMatch) {
      actions.push({ type: 'duplicate', prefix: duplicateMatch[1].toUpperCase(), from: Number(duplicateMatch[2]), to: Number(duplicateMatch[2]), count: Number(duplicateMatch[3]) })
      continue
    }
    const rangeMatch = chunk.match(/^([A-Za-z]+)\s*(\d+)(?:\s*-\s*(\d+))?$/i)
    if (rangeMatch) {
      const from = Number(rangeMatch[2])
      const to = Number(rangeMatch[3] || rangeMatch[2])
      actions.push({ type: 'range', prefix: rangeMatch[1].toUpperCase(), from: Math.min(from, to), to: Math.max(from, to), count: 0 })
    }
  }
  return actions
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
  const [query, setQuery] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user) return
    loadData(session.user.id)
  }, [session])

  async function signInWithGitHub() {
    setAuthLoading(true)
    setAuthMsg('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin }
    })
    if (error) {
      setAuthMsg(error.message)
      setAuthLoading(false)
    }
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

  const selectedTeam = teams.find(t => t.code === selectedTeamCode) || teams[0]
  const teamStickers = stickers.filter(s => s.team_id === selectedTeam?.id).sort((a, b) => a.sticker_number - b.sticker_number)
  const missing = stickers.filter(s => status[s.id]?.is_missing)
  const duplicates = stickers.filter(s => (status[s.id]?.duplicate_count || 0) > 0)
  const haveCount = stickers.length - missing.length
  const percent = stickers.length ? Math.round((haveCount / stickers.length) * 100) : 0

  const filteredTeams = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return teams
    return teams.filter(t => `${t.code} ${t.name} ${t.country}`.toLowerCase().includes(q))
  }, [teams, query])

  async function applyQuick(mode) {
    const actions = parseQuickInput(quickText)
    for (const action of actions) {
      const matched = stickers.filter(s => s.prefix === action.prefix && s.sticker_number >= action.from && s.sticker_number <= action.to)
      for (const sticker of matched) {
        if (mode === 'missing') await upsertStatus(sticker, { is_missing: true, duplicate_count: 0 })
        if (mode === 'duplicate') await upsertStatus(sticker, { is_missing: false, duplicate_count: action.count || 1 })
      }
    }
    setQuickText('')
  }

  function exportMissingPdf() {
    const doc = new jsPDF()
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text('FIFA26 Tracker - Faltantes', 14, 18)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
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
      doc.setFont('helvetica', 'bold')
      doc.text(team, 14, y)
      y += 6
      doc.setFont('helvetica', 'normal')
      const line = toRangeText(rows)
      const split = doc.splitTextToSize(line, 180)
      doc.text(split, 14, y)
      y += split.length * 5 + 5
    }
    const pdfBlob = doc.output('blob')
    const file = new File([pdfBlob], 'FIFA26-faltantes.pdf', { type: 'application/pdf' })
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      navigator.share({ files: [file], title: 'FIFA26 faltantes' })
    } else {
      doc.save('FIFA26-faltantes.pdf')
    }
  }

  if (!session) {
    return (
      <div className="loginShell">
        <div className="loginCard">
          <div className="brand">FIFA<span>26</span></div>
          <h1>Tracker de álbum</h1>
          <p>Entra con GitHub para sincronizar tu álbum en todos tus dispositivos.</p>
          <button onClick={signInWithGitHub} disabled={authLoading} style={{ marginTop: 8 }}>
            {authLoading ? 'Redirigiendo...' : '🐙 Continuar con GitHub'}
          </button>
          {authMsg && <small style={{ color: '#e53935', marginTop: 8, display: 'block' }}>{authMsg}</small>}
        </div>
      </div>
    )
  }

  return <div className="appShell">
    <header className="topbar">
      <button className="iconBtn"><BookOpen size={22}/></button>
      <strong>FIFA<span>26</span> Tracker</strong>
      <button className="iconBtn" onClick={() => supabase.auth.signOut()}><LogOut size={18}/></button>
    </header>

    <main className="content">
      {loading && <div className="panel">Cargando álbum...</div>}

      {!loading && tab === 'dashboard' && <section className="dashboard">
        <div className="heroCard">
          <div>
            <p>Mi álbum</p>
            <h1>{percent}%</h1>
            <span>Completado</span>
          </div>
          <div className="ring" style={{ background: `conic-gradient(#2f9e44 ${percent}%, #e8ece9 0)` }}><b>{percent}%</b></div>
        </div>
        <div className="statsGrid">
          <Stat label="Tengo" value={haveCount}/>
          <Stat label="Faltantes" value={missing.length}/>
          <Stat label="Repetidas" value={duplicates.reduce((sum, s) => sum + (status[s.id]?.duplicate_count || 0), 0)}/>
        </div>
        <h2>Equipos</h2>
        <div className="teamScroller">
          {teams.slice(0, 18).map(t => <button key={t.id} onClick={() => { setSelectedTeamCode(t.code); setTab('album') }} className="teamChip"><b>{t.code}</b><span>{t.name}</span></button>)}
        </div>
      </section>}

      {!loading && tab === 'album' && <section>
        <div className="albumHeader">
          <div><h1>{selectedTeam?.code} - {selectedTeam?.name}</h1><p>Vista doble página · 10 + 10</p></div>
          <Search size={20}/>
        </div>
        <input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar equipo" />
        <div className="teamList">
          {filteredTeams.map(t => <button key={t.id} onClick={() => setSelectedTeamCode(t.code)} className={t.code === selectedTeamCode ? 'activeTeam' : ''}>{t.code}</button>)}
        </div>
        <div className="spread">
          <AlbumPage title="Página izquierda" stickers={teamStickers.slice(0,10)} status={status} onUpdate={upsertStatus}/>
          <AlbumPage title="Página derecha" stickers={teamStickers.slice(10,20)} status={status} onUpdate={upsertStatus}/>
        </div>
      </section>}

      {!loading && tab === 'quick' && <section className="panel">
        <h1>Carga rápida</h1>
        <textarea value={quickText} onChange={e => setQuickText(e.target.value)} placeholder={'CUW 5-9\nMEX 15-20\nARG 10 x2'} />
        <button className="danger" onClick={() => applyQuick('missing')}>Marcar como faltantes</button>
        <button className="primary" onClick={() => applyQuick('duplicate')}>Registrar repetidas</button>
      </section>}

      {!loading && tab === 'missing' && <ListPage title="Faltantes" rows={missing} status={status} teams={teams} empty="No tienes faltantes registrados." action={<button className="primary" onClick={exportMissingPdf}><Share2 size={16}/> Exportar PDF</button>} />}

      {!loading && tab === 'dupes' && <ListPage title="Repetidas" rows={duplicates} status={status} teams={teams} empty="No tienes repetidas registradas." />}

      {!loading && tab === 'settings' && <section className="panel">
        <h1>Ajustes</h1>
        <p>Usuario: {session.user.user_metadata?.user_name || session.user.email}</p>
        <button className="primary" onClick={exportMissingPdf}><Share2 size={16}/> Exportar faltantes a PDF</button>
        <button onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
      </section>}
    </main>

    <nav className="bottomNav">
      {TABS.map(t => {
        const Icon = t.icon
        return <button key={t.id} onClick={() => setTab(t.id)} className={tab === t.id ? 'active' : ''}><Icon size={20}/><span>{t.label}</span></button>
      })}
    </nav>
  </div>
}

function Stat({ label, value }) {
  return <div className="stat"><span>{label}</span><b>{value}</b></div>
}

function AlbumPage({ title, stickers, status, onUpdate }) {
  return <div className="albumPage"><h3>{title}</h3><div className="grid10">
    {stickers.map(sticker => <StickerCard key={sticker.id} sticker={sticker} row={status[sticker.id]} onUpdate={onUpdate}/>) }
  </div></div>
}

function StickerCard({ sticker, row, onUpdate }) {
  const missing = Boolean(row?.is_missing)
  const dupes = row?.duplicate_count || 0
  return <div className={`sticker ${missing ? 'missing' : ''}`}>
    <div className="silhouette"><UserRound size={34}/></div>
    <b>{sticker.code}</b>
    <span>{sticker.display_name || sticker.player_name || 'Jugador'}</span>
    <button className={missing ? 'missingBtn' : 'haveBtn'} onClick={() => onUpdate(sticker, { is_missing: !missing, duplicate_count: 0 })}>{missing ? <X size={13}/> : <Check size={13}/>} {missing ? 'Falta' : 'Tengo'}</button>
    <div className="dupeCounter"><button onClick={() => onUpdate(sticker, { duplicate_count: Math.max(0, dupes - 1), is_missing: false })}><Minus size={12}/></button><strong>{dupes}</strong><button onClick={() => onUpdate(sticker, { duplicate_count: dupes + 1, is_missing: false })}><Plus size={12}/></button></div>
  </div>
}

function ListPage({ title, rows, status, teams, empty, action }) {
  const grouped = rows.reduce((acc, s) => {
    const team = teams.find(t => t.id === s.team_id)
    const key = team ? `${team.code} - ${team.name}` : s.prefix
    ;(acc[key] ||= []).push(s)
    return acc
  }, {})
  return <section className="panel"><div className="listHeader"><h1>{title}</h1>{action}</div>{rows.length === 0 && <p>{empty}</p>}{Object.entries(grouped).map(([team, items]) => <div key={team} className="group"><h3>{team}</h3>{items.map(s => <div className="listRow" key={s.id}><span>{s.code}</span><b>{s.display_name || s.player_name || 'Jugador'}</b><em>{status[s.id]?.duplicate_count ? `x${status[s.id].duplicate_count}` : ''}</em></div>)}</div>)}</section>
}

createRoot(document.getElementById('root')).render(<App />)
