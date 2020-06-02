import React, { Component, lazy, Suspense } from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import { TabBar } from "antd-mobile"

import style from "./index.module.scss"
// 组件
// import Home from "./components/home"
// import Search from "./components/search"
// import News from "./components/news"
// import Me from "./components/me"

const Home = lazy(() => import("./components/home"))
const Search = lazy(() => import("./components/search"))
const News = lazy(() => import("./components/news"))
const Me = lazy(() => import("./components/me"))

export default class Layout extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      selectedTab: props.location.pathname,
    }
  }

  TABS = [
    {
      title: "首页",
      icon: "icon-index",
      path: "/layout/home",
    },
    {
      title: "找房",
      icon: "icon-index",
      path: "/layout/search",
    },
    {
      title: "咨询",
      icon: "icon-index",
      path: "/layout/news",
    },
    {
      title: "我的",
      icon: "icon-index",
      path: "/layout/me",
    },
  ]

  renderTabBar = () => {
    return (
      <TabBar tintColor="#21B97A" noRenderContent className={style.tabbar}>
        {this.TABS.map((ele) => {
          return (
            <TabBar.Item
              title={ele.title}
              key={ele.path}
              selected={this.state.selectedTab === ele.path}
              icon={<i className={`iconfont ${ele.icon}`} />}
              selectedIcon={<i className={`iconfont ${ele.icon}`} />}
              onPress={() => {
                this.setState({
                  selectedTab: ele.path,
                })
                this.props.history.push(ele.path)
              }}
            ></TabBar.Item>
          )
        })}
      </TabBar>
    )
  }

  render() {
    return (
      <div className={style.layout}>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path="/layout/home" component={Home} />
              <Route path="/layout/search" component={Search} />
              <Route path="/layout/news" component={News} />
              <Route path="/layout/me" component={Me} />
              <Redirect exact from="/layout" to="/layout/home" />
            </Switch>
          </Suspense>

          <div className={style.layout}>{this.renderTabBar()}</div>
        </div>
      </div>
    )
  }
  static getDerivedStateFromProps(props: any, state: any) {
    return { selectedTab: props.location.pathname }
  }
}
