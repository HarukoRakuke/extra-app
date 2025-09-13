import { useEffect, useState } from 'react'
import styles from './SkeletonScreen.module.css'

export default function SkeletonScreen({ count = 4 }) {
  const [positions, setPositions] = useState([])

  useEffect(() => {
    const { innerWidth: w, innerHeight: h } = window
    const extraSize = 80 // должен совпадать с размером extraImg в css

    const arr = Array.from({ length: count }, () => {
      const left = Math.random() * (w - extraSize)
      const top = Math.random() * (h / 2 - extraSize) // только верхняя половина
      return { left, top }
    })
    setPositions(arr)
  }, [count])

  return (
    <div className={styles.skeletonScreen}>
      <div className={styles.logo} />
      <div className={`${styles.skeleton} ${styles.skeletonHero}`} />
      <div className={styles.skeletonButtonFlex}>
        <div className={`${styles.skeleton} ${styles.button1}`} />
        <div className={`${styles.skeleton} ${styles.button2}`} />
      </div>

      {positions.map((pos, i) => (
        <div
          key={i}
          className={`${styles.skeleton} ${styles.extraImg}`}
          style={{ left: pos.left, top: pos.top, position: 'absolute' }}
        />
      ))}
    </div>
  )
}
