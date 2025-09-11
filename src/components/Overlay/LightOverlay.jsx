export default function LightOverlay({ enabled }) {
  if (!enabled) return null
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        background: 'linear-gradient(to bottom, rgba(43, 43, 43, 0) 0%, rgba(43, 43, 43, 0.7) 100%)',
        top: 0,
        left: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  )
}
