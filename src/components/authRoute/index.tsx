import React from "react"
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom"
import { isAuth } from "utils/localStorage"

type BaseArgs = {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>
}

type IArgs = BaseArgs & RouteProps

function AuthRoute({ component: Component, ...rest }: IArgs) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuth()) {
          return <Component {...props} />
        } else {
          return (
            <Redirect
              to={{
                pathname: "login",
                state: { toPath: props.location.pathname },
              }}
            />
          )
        }
      }}
    />
  )
}

export default AuthRoute
