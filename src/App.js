import './App.css'
import { useState, useEffect, useRef } from 'react'
import { getPostTeasers } from './utils/getPostTeasers'
import Button from './components/UI/Button/Button.jsx'
import CaseInfo from './components/CaseInfo/CaseInfo.jsx'
import Title from './components/Title/Title.jsx'

function App() {
  const [cases, setCases] = useState([])
  const [theme, setTheme] = useState('light')
  const [random, setRandom] = useState(0)
  const [positions, setPositions] = useState({})

  const dragItem = useRef(null)
  const offset = useRef({ x: 0, y: 0 })
  const animationFrame = useRef(null)

  useEffect(() => {
    getPostTeasers()
      .then((data) => {
        const index = Math.floor(Math.random() * data.length)
        setCases(data)
        setRandom(index)

        const initial = {}
        data[index].extras?.forEach((_, i) => {
          initial[i] = {
            top: Math.floor(Math.random() * 80) + 10,
            left: Math.floor(Math.random() * 80) + 10
          }
        })
        setPositions(initial)
      })
      .catch((err) => {
        console.error('Ошибка при загрузке данных из Airtable:', err)
      })
  }, [])

  function getRandom() {
    let newRandom
    do {
      newRandom = Math.floor(Math.random() * cases.length)
    } while (newRandom === random)
    setRandom(newRandom)

    const initial = {}
    cases[newRandom].extras?.forEach((_, i) => {
      initial[i] = {
        top: Math.floor(Math.random() * 80) + 10,
        left: Math.floor(Math.random() * 80) + 10
      }
    })
    setPositions(initial)
  }

  function changeTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleMouseDown = (e, idx) => {
    e.preventDefault()
    e.stopPropagation()

    dragItem.current = idx
    const rect = e.target.getBoundingClientRect()
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e) => {
    if (dragItem.current == null) return
    if (animationFrame.current) return // throttle via RAF

    animationFrame.current = requestAnimationFrame(() => {
      const idx = dragItem.current
      const container = document.querySelector('.App')
      const rect = container.getBoundingClientRect()

      const x = e.clientX - rect.left - offset.current.x
      const y = e.clientY - rect.top - offset.current.y

      const newLeft = (x / rect.width) * 100
      const newTop = (y / rect.height) * 100

      setPositions((prev) => ({
        ...prev,
        [idx]: {
          top: newTop,
          left: newLeft
        }
      }))

      animationFrame.current = null
    })
  }

  const handleMouseUp = () => {
    dragItem.current = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }
  }

  if (cases.length === 0) return <p>Загрузка...</p>

  return (
    <div
      className={`App ${theme}`}
      style={{
        backgroundImage: `url(${cases[random].background})`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {cases[random].extras?.map((url, idx) => {
        const pos = positions[idx] || { top: 20, left: 20 }

        return (
          <img
            key={idx}
            className="extra-image"
            src={url}
            alt={`extra-${idx}`}
            onMouseDown={(e) => handleMouseDown(e, idx)}
            style={{
              position: 'absolute',
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              zIndex: 4,
              cursor: 'grab',
              pointerEvents: 'auto',
              userSelect: 'none',
              transition: 'none'
            }}
          />
        )
      })}

      <CaseInfo
        cases={cases}
        random={random}
        changeTheme={changeTheme}
        theme={theme}
      />

      {cases[random].light && (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            backgroundColor: 'rgba(43, 43, 43, 0.2)',
            top: 0,
            left: 0,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
      )}

      <Title theme={theme} cases={cases} random={random} />

      <Button accent absolute onClick={getRandom}>
        рандом кейс
      </Button>
    </div>
  )
}

export default App
