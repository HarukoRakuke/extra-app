import React, { useRef, useEffect } from 'react'
import Logo from '../Logo/Logo.jsx'
import Button from '../UI/Button/Button.jsx'
import cl from './CaseInfo.module.css'

export default function CaseInfo({
  cases,
  random,
  changeTheme,
  theme,
  ...props
}) {
  const containerRef = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const indices = [0, 1, 2, 3]
    const shuffled = indices.sort(() => Math.random() - 0.5)

    itemsRef.current.forEach((item, i) => {
      const wrapper = containerRef.current
      if (wrapper) {
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const wrapperRect = wrapper.getBoundingClientRect()

        const maxLeft = screenWidth - wrapperRect.width
        const maxTop = screenHeight * 0.8 - wrapperRect.height

        const left = Math.random() * maxLeft
        const top = Math.random() * maxTop

        wrapper.style.position = 'absolute'
        wrapper.style.left = `${left}px`
        wrapper.style.top = `${top}px`
      }
      item.style.order = shuffled[i]

      const randTop = Math.floor(Math.random() * 19)
      const randLeft = Math.floor(Math.random() * 19)
      const mt = Math.random() < 0.5 ? randTop : -randTop
      const ml = Math.random() < 0.5 ? randLeft : -randLeft

      item.style.marginTop = `${mt}px`
      item.style.marginLeft = `${ml}px`
    })
  }, [random])

  return (
    <div className={cl.wrapper} ref={containerRef}>
      <a
        href={cases[random].link}
        target="_blank"
        ref={(el) => (itemsRef.current[0] = el)}
      >
        <Button>смотреть</Button>
      </a>

      <p ref={(el) => (itemsRef.current[1] = el)}>
        {cases[random].description}
      </p>

      <Logo ref={(el) => (itemsRef.current[2] = el)} theme={theme} />
      <Button ref={(el) => (itemsRef.current[3] = el)} onClick={changeTheme}>
        {theme === 'light' ? '1' : '0'}
      </Button>
    </div>
  )
}
