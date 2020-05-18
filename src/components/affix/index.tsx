import React, { useRef, useEffect } from "react"
import styles from "./index.module.scss"

type IaffixProps = {}

const Affix: React.FC<IaffixProps> = (props) => {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const onWindowScroll = () => {
    if (placeholderRef.current != null && contentRef.current != null) {
      const { top } = placeholderRef.current.getBoundingClientRect()
      if (top < 0) {
        contentRef.current.classList.add(styles.fixed)
        placeholderRef.current.style.height = "40px"
      } else {
        contentRef.current.classList.remove(styles.fixed)
        placeholderRef.current.style.height = "0px"
      }
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", onWindowScroll)
    return () => {
      window.removeEventListener("scroll", onWindowScroll)
    }
  }, [])
  return (
    <div>
      <div ref={placeholderRef}></div>
      <div ref={contentRef}>{props.children}</div>
    </div>
  )
}

export default Affix
