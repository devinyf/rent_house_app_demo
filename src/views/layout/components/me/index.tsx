import React, { Component, ReactElement } from "react"
import { Button, Grid, Toast, Modal } from "antd-mobile"
import { Link, RouteComponentProps } from "react-router-dom"
import { DataItem } from "antd-mobile/lib/grid/PropsType"

import styles from "./index.module.scss"
import { apiGetUser, apiLogout, userInfoType } from "api/user"
import { BASE_URL } from "api/url"
import { removeToken } from "utils/localStorage"

// 菜单数据
const menus = [
  { id: 1, name: "我的收藏", iconfont: "icon-coll", to: "/favorate" },
  { id: 2, name: "我的出租", iconfont: "icon-index", to: "/rent" },
  { id: 3, name: "看房记录", iconfont: "icon-record", to: "" },
  {
    id: 4,
    name: "成为房主",
    iconfont: "icon-identity",
    to: "",
  },
  { id: 5, name: "个人资料", iconfont: "icon-myinfo", to: "" },
  { id: 6, name: "联系我们", iconfont: "icon-cust", to: "" },
]

interface IMenuType extends DataItem {
  id: number
  name: string
  iconfont: string
  to: string
}

type IStates = {
  // token: string
  userInfo?: userInfoType
}

export default class Me extends Component<RouteComponentProps, IStates> {
  _isMounted = false
  constructor(props: any) {
    super(props)
    this.state = {
      userInfo: undefined,
    }
  }
  renderItem = (dataItem: DataItem | undefined): ReactElement<any> => {
    if (dataItem) {
      return (
        <Link to={dataItem.to}>
          <div className={styles.menuItem}>
            <i className={`iconfont ${dataItem.iconfont}`} />
            <span>{dataItem.name}</span>
          </div>
        </Link>
      )
    } else {
      return <div></div>
    }
  }

  getUserInfo = async () => {
    const { userInfo, err } = await apiGetUser()
    if (err) {
      Toast.fail("请登录")
      return
    }
    if (this._isMounted) {
      this.setState({
        userInfo,
      })
    }
  }
  handleLogout = () => {
    Modal.alert("提示", "确认退出吗？", [
      { text: "取消" },
      {
        text: "确定",
        onPress: async () => {
          const { isSuccess } = await apiLogout()
          if (isSuccess) {
            removeToken()
            if (this._isMounted) {
              this.setState({
                userInfo: undefined,
              })
            }
          }
        },
      },
    ])
  }

  render() {
    const { userInfo } = this.state
    return (
      <div>
        <div className={styles.title}>
          <img
            className={styles.bg}
            src="http://huangjiangjun.top:8088/img/profile/bg.png"
            alt=""
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img
                className={styles.avatar}
                src={
                  userInfo
                    ? `${BASE_URL}${userInfo.avatar}`
                    : "http://huangjiangjun.top:8088/img/profile/avatar.png"
                }
                alt=""
              />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>
                {userInfo ? userInfo.nickname : "游客"}
              </div>
              {userInfo ? (
                <div>
                  <div className={styles.auth}>
                    <span onClick={this.handleLogout}>退出</span>
                  </div>
                  <div className={styles.edit}>
                    编辑个人资料
                    <span className={styles.arrow}>
                      <i className="iconfont icon-arrow"></i>
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.edit}>
                  <Button
                    onClick={() => this.props.history.push("/login")}
                    type="primary"
                    size="small"
                    inline
                  >
                    去登录
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={this.renderItem}
        />
      </div>
    )
  }
  componentDidMount() {
    this._isMounted = true
    this.getUserInfo()
  }
  componentWillUnmount() {
    this._isMounted = false
  }
}
