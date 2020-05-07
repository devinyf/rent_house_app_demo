import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { NavBar, Icon } from "antd-mobile"
import classnames from "classnames"

import styles from "./index.module.scss"

interface Iprops {
  title?: string
  className?: string
  rightContent?: React.ReactNode
}

type NavBarProps = Iprops & RouteComponentProps

const NavigationBar: React.FC<NavBarProps> = ({
  title = "城市选择",
  history,
  className,
  rightContent,
}) => {
  console.log("navBarClass: ", className)

  const handleGoBack = () => {
    console.log("goBack")
    history.goBack()
  }
  return (
    <div>
      <NavBar
        className={classnames(styles.navBar, className)}
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={handleGoBack}
        rightContent={rightContent}
      >
        {title}
      </NavBar>
    </div>
  )
}

export default withRouter(NavigationBar)
