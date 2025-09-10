import React from 'react'
import cl from './Title.module.css'

export default function Title({ theme, cases, random, ...props }) {
  const themeClass = `${cl.title} ${
    theme === 'dark' ? cl.darkTheme : cl.whiteTheme
  }`

  return <h1 className={themeClass}>{cases[random].title}</h1>
}
