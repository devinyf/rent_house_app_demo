import React from "react"
import "./assets/fonts/iconfont.css"
import "./App.css"

import { HashRouter, Route, Switch, Redirect } from "react-router-dom"

import Login from "./views/login"
import Layout from "./views/layout"
import Citys from "./views/citys"
import BdMap from "./views/bdMap"
import Detail from "./views/detail"

function App() {
  return (
    <React.Fragment>
      <HashRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/layout" component={Layout} />
          <Route path="/citylist" component={Citys} />
          <Route path="/bdmap" component={BdMap} />
          <Route path="/detail/:id" component={Detail} />

          <Redirect exact from="/" to="/login" />
        </Switch>
      </HashRouter>
    </React.Fragment>
  )
}

export default App
