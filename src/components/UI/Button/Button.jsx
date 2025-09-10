import React from 'react'
import cl from './Button.module.css'

export default function Button({
  accent = false,
  absolute = false,
  children,
  ...props
}) {
  const className = `${cl.btn} ${accent ? cl.accent : ''} ${
    absolute ? cl.absolute : ''
  }`
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}
