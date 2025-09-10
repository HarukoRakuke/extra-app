import React, { forwardRef } from 'react'
const AppContainer = forwardRef(function AppContainer(
  { theme = 'light', background, children },
  ref
) {
  return (
    <div
      ref={ref}
      className={`App ${theme}`}
      style={{
        backgroundImage: `url(${background})`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
})

export default AppContainer
