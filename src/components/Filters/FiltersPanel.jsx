import { useEffect, useMemo, useRef } from 'react'
import cl from './FiltersPanel.module.css'
import { FILTERS } from '../../constants/filters'

export default function FiltersPanel({
  open,
  selected,        // Set<string>
  topicTagId,      // string
  onToggleTag,     // (id) => void
  onClearAll,      // () => void
  onClose          // () => void
}) {
  const panelRef = useRef(null)
  const itemRefs = useRef([])

  // Закрытие по ESC/клик вне
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose?.()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open, onClose])

  // Отрисовываемый список (включая "all" в конце или где ты хочешь)
  const items = useMemo(() => FILTERS, [])

  if (!open) return null

  const onKeyDownItem = (e, idx, id, isAll) => {
    const k = e.key
    if (k === 'Enter' || k === ' ') {
      e.preventDefault()
      isAll ? onClearAll() : onToggleTag(id)
      return
    }
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'ArrowLeft' || k === 'ArrowUp') {
      e.preventDefault()
      const cols = 2 // синхронизируй с grid-template-columns
      let next = idx
      if (k === 'ArrowRight') next = idx + 1
      if (k === 'ArrowLeft')  next = idx - 1
      if (k === 'ArrowDown')  next = idx + cols
      if (k === 'ArrowUp')    next = idx - cols
      next = Math.min(Math.max(0, next), items.length - 1)
      itemRefs.current[next]?.focus()
    }
  }

  return (
    <div
      ref={panelRef}
      className={cl.panel}
      role="dialog"
      aria-modal="true"
      aria-label="Фильтры"
    >
      <div
        className={cl.grid}
        role="listbox"
        aria-multiselectable="true"
      >
        {items.map(({ id, label, thumbs = [] }, i) => {
          const isAll = id === 'all'
          const isActive = isAll ? selected.size === 0 : selected.has(id)
          const isTopic = id === topicTagId

          return (
            <button
              key={id}
              ref={(el) => (itemRefs.current[i] = el)}
              onClick={() => (isAll ? onClearAll() : onToggleTag(id))}
              onKeyDown={(e) => onKeyDownItem(e, i, id, isAll)}
              className={`${cl.tile} ${isActive ? cl.active : ''}`}
              role="option"
              aria-selected={isActive}
            >
              <div className={cl.tileInner}>
                {thumbs?.length > 0 && (
                  <div className={cl.previewStack} aria-hidden="true">
                    {thumbs.slice(0, 3).map((src, idx) => (
                      <img key={idx} src={src} alt="" className={cl.thumb} />
                    ))}
                  </div>
                )}
                <div className={cl.previewBadge}>
                {isTopic && <div className={cl.badge}>тема дня</div>}
                <div className={cl.label}>{label}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
