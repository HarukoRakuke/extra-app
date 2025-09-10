import React from 'react'
import cl from './Logo.module.css'

export default function Logo({ theme, ...props }) {
  const themeClass = `${cl.logo} ${
    theme === 'dark' ? cl.darkTheme : cl.whiteTheme
  }`
  const holderClass = `${cl.logoHolder} ${
    theme === 'dark' ? cl.dark : cl.white
  }`
  return (
    <div className={holderClass}>
      <div className={themeClass}></div>
    </div>
  )
}
