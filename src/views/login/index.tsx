import React, { Component } from "react"
import { WhiteSpace, WingBlank, Flex, Toast } from "antd-mobile"
import { RouteComponentProps } from "react-router-dom"

import styles from "./index.module.scss"
import NavBar from "components/navBar"
import { apiLogin } from "api/user"
import { setLocalToken } from "utils/localStorage"

interface IStates {
  username: string
  password: string
}

// interface InputTarget extends HTMLInputElement {
//   target: {
//     name: "username" | "password"
//     // password: string
//   }
// }
export default class Login extends Component<RouteComponentProps, IStates> {
  constructor(props: any) {
    super(props)
    this.state = {
      username: "",
      password: "",
    }
  }

  changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    this.setState({
      [name]: e.target.value,
    } as Pick<IStates, keyof IStates>)
  }

  handleLogin = async (userInfo: IStates) => {
    const { token, err } = await apiLogin(userInfo)
    if (err) {
      Toast.fail("NetWork Err !")
      return
    }

    setLocalToken(token)
    this.props.history.goBack()
  }

  render() {
    const { username, password } = this.state
    return (
      <div>
        <NavBar title="账号登录" />
        <WhiteSpace size="lg" />
        <WingBlank size="lg">
          <div>
            <input
              placeholder="请输入用户名"
              name="username"
              value={username}
              onChange={this.changeValue}
              className={styles.input}
              type="text"
            />
          </div>
          <div>
            <input
              placeholder="请输入密码"
              name="password"
              value={password}
              onChange={this.changeValue}
              className={styles.input}
              type="password"
            />
          </div>
          <div className={styles.formSubmit}>
            <div
              onClick={() => this.handleLogin(this.state)}
              className={styles.submit}
            >
              登 录
            </div>
          </div>
          <Flex className={styles.backHome} align="center">
            <Flex.Item>
              <a>还没有账号, 去注册</a>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}
