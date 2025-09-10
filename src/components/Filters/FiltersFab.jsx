export default function FiltersFab({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Открыть фильтры"
      style={{
        zIndex: 10,
        height: '100%',
        aspectRatio: 1,
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.2)',
        background: '#fff',
        display: 'grid',
        placeItems: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        cursor: 'pointer'
      }}
    >
      {/* простая иконка «фильтры» */}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M10 5H3" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 19H3" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 3V7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 17V21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 12H12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 19H16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 5H14" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 10V14" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 12H3" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  )
}
