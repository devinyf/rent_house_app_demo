import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { NavBar, Icon } from "antd-mobile"

interface Iprops {
  title?: string
}

type NavBarProps = Iprops & RouteComponentProps

const NavigationBar: React.FC<NavBarProps> = ({
  title = "城市选择",
  history,
}) => {
  const handleGoBack = () => {
    console.log("goBack")
    history.goBack()
  }
  return (
    <div>
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={handleGoBack}
        rightContent={[
          <Icon key="0" type="search" style={{ marginRight: "16px" }} />,
          <Icon key="1" type="ellipsis" />,
        ]}
      >
        {title}
      </NavBar>
    </div>
  )
}

export default withRouter(NavigationBar)
