import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Редактируй здесь:
 * координаты задаются в %, позиционирование по ЦЕНТРУ элемента
 * (используем translate(-50%, -50%)), rotate в градусах, z задаёт перекрытие.
 *
 * Для light — дуга сверху (top).
 * Для dark  — дуга снизу (bottom).
 * Можно свободно менять top/left/rotate/z (или bottom/left/rotate/z для dark).
 */
const PRESETS = {
  light: {
    2: [
      { top: 22, left: 41, rotate: -8, z: 10 },
      { top: 22, left: 59, rotate:  8, z: 11 },
    ],
    3: [
      { top: 18, left: 32, rotate: -12, z: 9 },
      { top: 16, left: 50, rotate:   0, z: 12 }, // центральная сверху
      { top: 18, left: 68, rotate:  12, z: 9 },
    ],
    4: [
      { top: 15, left: 25, rotate: -14, z: 8 },
      { top: 14, left: 41, rotate:  -6, z: 10 },
      { top: 14, left: 59, rotate:   6, z: 10 },
      { top: 15, left: 75, rotate:  14, z: 8 },
    ],
  },
  dark: {
    2: [
      { bottom: 22, left: 41, rotate:  8, z: 10 },
      { bottom: 22, left: 59, rotate: -8, z: 11 },
    ],
    3: [
      { bottom: 18, left: 32, rotate: 12, z: 9 },
      { bottom: 16, left: 50, rotate:  0, z: 12 }, // центральная снизу
      { bottom: 18, left: 68, rotate:-12, z: 9 },
    ],
    4: [
      { bottom: 15, left: 25, rotate: 14, z: 8 },
      { bottom: 14, left: 41, rotate:  6, z: 10 },
      { bottom: 14, left: 59, rotate: -6, z: 10 },
      { bottom: 15, left: 75, rotate:-14, z: 8 },
    ],
  },
}

export default function ExtrasLayer({ extras = [], containerRef, theme = 'light' }) {
  const [positions, setPositions] = useState({})
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 800 : true
  )
  const dragItem = useRef(null)
  const offset = useRef({ dx: 0, dy: 0 }) // смещение курсора относительно ЦЕНТРА элемента
  const animationFrame = useRef(null)

  // --- Random для десктопа
  const setRandomPositions = useCallback(() => {
    const initial = {}
    extras?.forEach((_, i) => {
      initial[i] = {
        top: Math.floor(Math.random() * 80) + 10,
        left: Math.floor(Math.random() * 80) + 10,
        rotate: 0,
        z: 4,
      }
    })
    setPositions(initial)
  }, [extras])

  // --- Применяем пресет на мобиле
  const applyPreset = useCallback(() => {
    const n = Math.min(4, Math.max(2, extras.length)) // только 2..4
    const preset = PRESETS[theme]?.[n]
    if (!preset) return
    const next = {}
    for (let i = 0; i < extras.length; i++) {
      const p = preset[Math.min(i, preset.length - 1)]
      next[i] = { ...p }
    }
    setPositions(next)
  }, [extras.length, theme])

  // resize
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 800)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // init/relayout
  useEffect(() => {
    if (!extras?.length) return
    if (isMobile) applyPreset()
    else setRandomPositions()
  }, [extras, theme, isMobile, applyPreset, setRandomPositions])

  // --- drag (учитываем top ИЛИ bottom в pos)
  const handleMouseMove = useCallback((e) => {
    if (dragItem.current == null || !containerRef?.current) return
    if (animationFrame.current) return

    animationFrame.current = requestAnimationFrame(() => {
      const idx = dragItem.current
      const rect = containerRef.current.getBoundingClientRect()

      const centerX = (e.clientX - rect.left) - offset.current.dx
      const centerY = (e.clientY - rect.top) - offset.current.dy

      setPositions((prev) => {
        const prevPos = prev[idx] || {}
        const nextPos = {
          ...prevPos,
          left: (centerX / rect.width) * 100,
        }

        // если позиционировались через top — обновляем top
        if (prevPos.top !== undefined || prevPos.bottom === undefined) {
          nextPos.top = (centerY / rect.height) * 100
          delete nextPos.bottom
        } else {
          // иначе позиционировались через bottom — обновляем bottom
          nextPos.bottom = (1 - centerY / rect.height) * 100
          delete nextPos.top
        }

        return { ...prev, [idx]: nextPos }
      })

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

    const containerRect = containerRef.current.getBoundingClientRect()
    const current = positions[idx] || { top: 20, left: 20 }

    // переводим pos в координаты центра в px
    const currentLeftPx = (current.left / 100) * containerRect.width

    // если bottom задан — считаем top как (100 - bottom) для вычисления центра
    const effectiveTopPercent =
      current.top !== undefined
        ? current.top
        : (current.bottom !== undefined ? (100 - current.bottom) : 20)

    const currentTopPx = (effectiveTopPercent / 100) * containerRect.height

    offset.current = {
      dx: (e.clientX - containerRect.left) - currentLeftPx,
      dy: (e.clientY - containerRect.top) - currentTopPx,
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [containerRef, positions, handleMouseMove, handleMouseUp])

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
    const pos = positions[idx] || { top: 20, left: 20, rotate: 0, z: 4 }
    const key = `extra-${idx}`

    const commonStyle = {
      position: 'absolute',
      ...(pos.top !== undefined ? { top: `${pos.top}%` } : {}),
      ...(pos.bottom !== undefined ? { bottom: `${pos.bottom}%` } : {}),
      left: `${pos.left}%`,
      transform: `translate(-50%, -50%) rotate(${pos.rotate || 0}deg)`,
      zIndex: pos.z ?? 4,
      cursor: dragItem.current === idx ? 'grabbing' : 'grab',
      pointerEvents: 'auto',
      userSelect: 'none',
      transition: 'none',
      maxWidth: '220px',
      maxHeight: '220px',
    }

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
        className="extraMedia"
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
        className="extraMedia"
      />
    )
  })
}
