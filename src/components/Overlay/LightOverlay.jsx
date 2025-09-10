export default function LightOverlay({ enabled }) {
  if (!enabled) return null
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        backgroundColor: 'rgba(43, 43, 43, 0.2)',
        top: 0,
        left: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  )
}
