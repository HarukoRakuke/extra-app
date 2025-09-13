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
import SkeletonScreen from './components/UI/SkeletonScreen/SkeletonScreen.jsx'

import { getTopicOfDayId } from './utils/topicOfDay'

// утилита предзагрузки изображений
function preloadImages(urls = []) {
  const unique = Array.from(new Set(urls.filter(Boolean)))
  if (!unique.length) return Promise.resolve()
  return Promise.all(
    unique.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = img.onerror = () => resolve()
          img.src = src
        })
    )
  )
}

export default function App() {
  const { cases, loading, error } = useCases()
  const [theme, setTheme] = useState('light')

  // MULTI-SELECT: Set<string>
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [caseReady, setCaseReady] = useState(false) // ассеты текущего кейса готовы
  const containerRef = useRef(null)

  // фильтрация
  const filteredCases = useMemo(() => {
    if (!selectedTags.size) return cases
    return cases.filter((c) => c?.tag && selectedTags.has(c.tag))
  }, [cases, selectedTags])

  // при изменении списка — выбираем случайный кейс
  useEffect(() => {
    if (!filteredCases || filteredCases.length === 0) return
    setCurrentIndex(Math.floor(Math.random() * filteredCases.length))
  }, [filteredCases])

  const current = filteredCases[currentIndex]
  const hasCases = !!(filteredCases && filteredCases.length > 0)

  // предзагрузка ассетов нового кейса и показ скелетона на время
  useEffect(() => {
    if (!hasCases) return
    let cancelled = false
    // при смене индекса — сначала показываем скелетоны
    setCaseReady(false)

    // собираем потенциальные изображения кейса
    const urls = []
    if (current?.background) urls.push(current.background)
    if (Array.isArray(current?.extras)) {
      current.extras.forEach((e) => {
        if (typeof e === 'string') urls.push(e)
        else if (e?.src) urls.push(e.src)
      })
    }
    if (current?.image) urls.push(current.image)
    if (Array.isArray(current?.images)) urls.push(...current.images)

    preloadImages(urls).finally(() => {
      if (!cancelled) setCaseReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [currentIndex, hasCases]) // обновляемся именно на смену текущего кейса

  const getRandom = () => {
    if (!hasCases || filteredCases.length <= 1) return
    let next
    do {
      next = Math.floor(Math.random() * filteredCases.length)
    } while (next === currentIndex)
    setCurrentIndex(next) // скелетоны появятся сами (caseReady=false), потом предзагрузка
  }

  const changeTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const onSelectAll = () => {
    setSelectedTags(new Set())
  }

  const topicTagId = getTopicOfDayId()

  const onToggleTag = (id) => {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (error) return <p>Не удалось загрузить кейсы</p>

  // Показ скелетона:
  // - пока идёт загрузка данных (loading)
  // - или когда есть кейсы, но ассеты текущего ещё не догрузились
  const showSkeleton = loading || (hasCases && !caseReady)

  // фон подставляем только когда кейс готов, чтобы не мигало старым
  const safeBackground = hasCases && caseReady ? current?.background : undefined

  return (
    <>
      <AppContainer
        ref={containerRef}
        theme={theme}
        background={safeBackground}
        key={current?.id || currentIndex}
      >
        {showSkeleton ? (
          <SkeletonScreen />
        ) : hasCases && current ? (
          <>
            <ExtrasLayer
              key={`extras-${current?.id || currentIndex}`}
              extras={current.extras}
              containerRef={containerRef}
              theme={theme}
            />
            <CaseInfo
              key={`info-${current?.id || currentIndex}`}
              current={current}
              changeTheme={changeTheme}
              theme={theme}
            />
            <LightOverlay enabled={Boolean(current.light)} />
            <Title
              theme={theme}
              cases={cases}
              random={current ? cases.indexOf(current) : 0}
            />
          </>
        ) : null}
      </AppContainer>

      <div className="filtersDock">
        <Button accent onClick={getRandom} disabled={!hasCases || !current}>
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

      {!loading && !hasCases && (
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
