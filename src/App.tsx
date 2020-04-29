import React from "react"
import "./assets/fonts/iconfont.css"
import "./App.css"

import { HashRouter, Route, Switch, Redirect } from "react-router-dom"

import Login from "./views/login"
import Layout from "./views/layout"
import Citys from "./views/citys"
import BdMap from "./views/bdMap"

function App() {
  return (
    <React.Fragment>
      <HashRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/layout" component={Layout} />
          <Route path="/citylist" component={Citys} />
          <Route path="/bdmap" component={BdMap} />

          <Redirect exact from="/" to="/login" />
        </Switch>
      </HashRouter>
    </React.Fragment>
  )
}

export default App
