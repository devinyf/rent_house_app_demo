import React, { useRef, useEffect } from "react"
import styles from "./index.module.scss"

type IaffixProps = {
  offsetTop: number
}

const Affix: React.FC<IaffixProps> = (props) => {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.addEventListener("scroll", onWindowScroll)
    return () => {
      window.removeEventListener("scroll", onWindowScroll)
    }
  }, [])

  const onWindowScroll = () => {
    if (placeholderRef.current != null && contentRef.current != null) {
      const { top } = placeholderRef.current.getBoundingClientRect()
      if (top < 0) {
        contentRef.current.classList.add(styles.fixed)
        placeholderRef.current.style.height = `${props.offsetTop}px`
      } else {
        contentRef.current.classList.remove(styles.fixed)
        placeholderRef.current.style.height = "0px"
      }
    }
  }
  return (
    <div>
      <div ref={placeholderRef}></div>
      <div ref={contentRef}>{props.children}</div>
    </div>
  )
}

export default Affix
