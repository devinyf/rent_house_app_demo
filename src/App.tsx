import React, { lazy, Suspense } from "react"
import "react-virtualized/styles.css"
import "./assets/fonts/iconfont.css"
import "./App.css"

import { HashRouter, Route, Switch, Redirect } from "react-router-dom"
import AuthRoute from "components/authRoute"

// 组件
// import Login from "./views/login"
// import Layout from "./views/layout"
// import Citys from "./views/citys"
// import BdMap from "./views/bdMap"
// import Detail from "./views/detail"
// import Rent from "./views/rent"
// import RentAdd from "./views/rent/add"
// import RentSearch from "./views/rent/search"

const Login = lazy(() => import("./views/login"))
const Layout = lazy(() => import("./views/layout"))
const Citys = lazy(() => import("./views/citys"))
const BdMap = lazy(() => import("./views/bdMap"))
const Detail = lazy(() => import("./views/detail"))
const Rent = lazy(() => import("./views/rent"))
const RentAdd = lazy(() => import("./views/rent/add"))
const RentSearch = lazy(() => import("./views/rent/search"))

function App() {
  return (
    <React.Fragment>
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/layout" component={Layout} />
            <Route path="/citylist" component={Citys} />
            <Route path="/bdmap" component={BdMap} />
            <Route path="/detail/:id" component={Detail} />

            <AuthRoute exact path="/rent" component={Rent} />
            <AuthRoute path="/rent/add" component={RentAdd} />
            <AuthRoute path="/rent/search" component={RentSearch} />

            <Redirect exact from="/" to="/login" />
          </Switch>
        </Suspense>
      </HashRouter>
    </React.Fragment>
  )
}

export default App
