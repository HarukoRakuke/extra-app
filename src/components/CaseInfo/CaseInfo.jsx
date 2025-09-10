import React, { useRef, useEffect } from 'react'
import Logo from '../Logo/Logo.jsx'
import Button from '../UI/Button/Button.jsx'
import cl from './CaseInfo.module.css'

export default function CaseInfo({ current, changeTheme, theme }) {
  const containerRef = useRef(null)
  const itemsRef = useRef([])

  // Переразбрасываем элементы при смене кейса
  useEffect(() => {
    if (!current) return
    const indices = [0, 1, 2, 3]
    const shuffled = [...indices].sort(() => Math.random() - 0.5)

    itemsRef.current.forEach((item, i) => {
      if (!item) return
      const wrapper = containerRef.current
      if (wrapper) {
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const wrapperRect = wrapper.getBoundingClientRect()

        wrapper.style.position = 'absolute'

        if (screenWidth <= 800) {
          // Центрируем с лёгким смещением вниз
          wrapper.style.left = `${(screenWidth - wrapperRect.width) / 2}px`
          wrapper.style.top = `${(screenHeight - wrapperRect.height) / 2 + screenHeight * 0.1}px`
        } else {
          // Рандом на больших экранах
          const maxLeft = Math.max(0, screenWidth * 0.7 - wrapperRect.width)
          const maxTop = Math.max(0, screenHeight * 0.8 - wrapperRect.height)
          wrapper.style.left = `${Math.random() * maxLeft}px`
          wrapper.style.top = `${Math.random() * maxTop}px`
        }
      }

      item.style.order = shuffled[i]

      const randTop = Math.floor(Math.random() * 19)
      const randLeft = Math.floor(Math.random() * 19)
      const mt = Math.random() < 0.5 ? randTop : -randTop
      const ml = Math.random() < 0.5 ? randLeft : -randLeft
      item.style.marginTop = `${mt}px`
      item.style.marginLeft = `${ml}px`
    })
    // лучше завязываться на стабильный ключ
  }, [current?.id || current?.link || current?.description])

  return (
    <div className={cl.wrapper} ref={containerRef}>
      <a
        href={current.link}
        target="_blank"
        rel="noreferrer"
        ref={(el) => (itemsRef.current[0] = el)}
      >
        <Button>смотреть</Button>
      </a>

      <p ref={(el) => (itemsRef.current[1] = el)}>
        {current.description}
      </p>

      <Logo ref={(el) => (itemsRef.current[2] = el)} theme={theme} />

      <Button ref={(el) => (itemsRef.current[3] = el)} onClick={changeTheme}>
        {theme === 'light' ? '1' : '0'}
      </Button>
    </div>
  )
}
