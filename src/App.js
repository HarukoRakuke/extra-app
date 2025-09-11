import './App.css'
import { useMemo, useRef, useState, useEffect } from 'react'
import { useCases } from './hooks/useCases'

import AppContainer from './components/Layout/AppContainer'
import LightOverlay from './components/Overlay/LightOverlay'
import ExtrasLayer from './components/Extras/ExtrasLayer'
import FiltersFab from './components/Filters/FiltersFab'
import FiltersPanel from './components/Filters/FiltersPanel'

import Button from './components/UI/Button/Button.jsx'
import CaseInfo from './components/CaseInfo/CaseInfo.jsx'
import Title from './components/Title/Title.jsx'

import { getTopicOfDayId } from './utils/topicOfDay'

export default function App() {
  const { cases, loading, error } = useCases()
  const [theme, setTheme] = useState('light')

  // MULTI-SELECT: Set<string>
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  // если ничего не выбрано — показываем все; иначе — кейсы, у которых case.tag входит в Set
  const filteredCases = useMemo(() => {
    if (!selectedTags.size) return cases
    return cases.filter((c) => c?.tag && selectedTags.has(c.tag))
  }, [cases, selectedTags])

  useEffect(() => {
    if (currentIndex > filteredCases.length - 1) setCurrentIndex(0)
  }, [filteredCases.length, currentIndex])

  const current = filteredCases[currentIndex]

  const getRandom = () => {
    if (filteredCases.length <= 1) return
    let next
    do {
      next = Math.floor(Math.random() * filteredCases.length)
    } while (next === currentIndex)
    setCurrentIndex(next)
  }

  const changeTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  // «все» — просто очистить Set
  const onSelectAll = () => {
    setSelectedTags(new Set())
    setCurrentIndex(0)
  }

 const topicTagId = getTopicOfDayId()

  // переключение тега в Set
  const onToggleTag = (id) => {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setCurrentIndex(0)
  }

  if (loading) return <p>Загрузка...</p>
  if (error) return <p>Не удалось загрузить кейсы</p>

  return (
    <>
      <AppContainer
        ref={containerRef}
        theme={theme}
        background={current?.background}
      >
        {current && (
          <>
            <ExtrasLayer extras={current.extras} containerRef={containerRef}  theme={theme}  />
            <CaseInfo current={current} changeTheme={changeTheme} theme={theme} />
            <LightOverlay enabled={Boolean(current.light)} />
            <Title
              theme={theme}
              cases={cases}
              random={current ? cases.indexOf(current) : 0}
            />
          </>
        )}
      </AppContainer>
      

      <div className="filtersDock">
      <Button accent onClick={getRandom} disabled={!current}>
        рандом кейс
      </Button>

      {/* группа фильтров справа от кнопки */}
      <div className="filtersDock__filters">
        <FiltersFab onClick={() => setFiltersOpen(v => !v)} active={filtersOpen} />
        <FiltersPanel
          docked
          open={filtersOpen}
          selected={selectedTags}
          topicTagId={topicTagId}
          onToggleTag={onToggleTag}
          onClearAll={onSelectAll}
          onClose={() => setFiltersOpen(false)}
        />
      </div>
    </div>

      {!current && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            left: 12,
            padding: '8px 10px',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 10,
            boxShadow: '0 10px 24px rgba(0,0,0,0.1)',
            zIndex: 9,
            fontSize: 14,
          }}
        >
          Нет кейсов по выбранным тегам
        </div>
      )}
    </>
  )
}
