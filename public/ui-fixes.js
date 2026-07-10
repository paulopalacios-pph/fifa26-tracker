document.addEventListener('DOMContentLoaded', () => {
  const fix = () => {
    document.querySelectorAll('.albumPage > h3').forEach((el) => {
      if (el.textContent === 'Página izquierda (1–8)') el.textContent = 'Página izquierda (2–8)'
    })
  }
  fix()
  setInterval(fix, 1000)
})
