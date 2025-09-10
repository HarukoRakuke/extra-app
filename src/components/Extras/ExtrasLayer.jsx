import { useEffect, useRef, useState, useCallback } from 'react'

export default function ExtrasLayer({ extras = [], containerRef }) {
  const [positions, setPositions] = useState({})
  const dragItem = useRef(null)
  const offset = useRef({ x: 0, y: 0 })
  const animationFrame = useRef(null)

  // Инициализация случайных позиций при смене extras
  useEffect(() => {
    const initial = {}
    extras?.forEach((_, i) => {
      initial[i] = {
        top: Math.floor(Math.random() * 80) + 10,
        left: Math.floor(Math.random() * 80) + 10
      }
    })
    setPositions(initial)
  }, [extras])

  const handleMouseMove = useCallback((e) => {
    if (dragItem.current == null || !containerRef?.current) return
    if (animationFrame.current) return

    animationFrame.current = requestAnimationFrame(() => {
      const idx = dragItem.current
      const rect = containerRef.current.getBoundingClientRect()

      const x = e.clientX - rect.left - offset.current.x
      const y = e.clientY - rect.top - offset.current.y

      const newLeft = (x / rect.width) * 100
      const newTop = (y / rect.height) * 100

      setPositions((prev) => ({
        ...prev,
        [idx]: { top: newTop, left: newLeft }
      }))

      animationFrame.current = null
    })
  }, [containerRef])

  const handleMouseUp = useCallback(() => {
    dragItem.current = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }
  }, [handleMouseMove])

  const handleMouseDown = useCallback((e, idx) => {
    e.preventDefault()
    e.stopPropagation()
    dragItem.current = idx

    const r = e.currentTarget.getBoundingClientRect()
    offset.current = { x: e.clientX - r.left, y: e.clientY - r.top }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove, handleMouseUp])

  // Чистим listeners при размонтировании
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    }
  }, [handleMouseMove, handleMouseUp])

  if (!extras?.length) return null

  return extras.map((item, idx) => {
    const media = typeof item === 'string' ? { type: 'image', url: item } : item
    const pos = positions[idx] || { top: 20, left: 20 }

    const commonStyle = {
      position: 'absolute',
      top: `${pos.top}%`,
      left: `${pos.left}%`,
      zIndex: 4,
      cursor: 'grab',
      pointerEvents: 'auto',
      userSelect: 'none',
      transition: 'none',
      maxWidth: '220px',
      maxHeight: '220px'
    }

    const key = `extra-${idx}`

    return media.type === 'video' ? (
      <video
        key={key}
        src={media.url}
        autoPlay
        loop
        muted
        playsInline
        onMouseDown={(e) => handleMouseDown(e, idx)}
        style={commonStyle}
        className={'extraMedia'}

      />
    ) : (
      <img
        key={key}
        src={media.url}
        alt={key}
        loading="lazy"
        decoding="async"
        draggable={false}
        onMouseDown={(e) => handleMouseDown(e, idx)}
        style={commonStyle}
        className={'extraMedia'}
      />
    )
  })
}
