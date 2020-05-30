import React, { Component } from "react"
import { SearchBar, Toast } from "antd-mobile"
import _ from "lodash"
import { RouteComponentProps } from "react-router-dom"

import store from "store/index"
import styles from "./index.module.scss"
import { apiGetCommunitys, CommunitysType } from "api/citys"
import { getCurrentCity } from "utils/coordinate"

type IStates = {
  commlist?: CommunitysType[]
  cityId: string
}

export default class RentSearch extends Component<
  RouteComponentProps,
  IStates
> {
  _isMounted = false
  constructor(props: any) {
    super(props)
    this.state = {
      commlist: undefined,
      cityId: "",
    }
  }
  handleOnChange = _.debounce(async (keyword: string) => {
    const { comm, err } = await apiGetCommunitys(keyword, this.state.cityId)
    if (err) {
      Toast.fail("NetWork Err !!")
      return
    }

    if (this._isMounted) {
      this.setState({
        commlist: comm,
      })
    }
  }, 500)

  getCityInfo = async () => {
    let { value } = await getCurrentCity()
    if (this._isMounted) {
      this.setState({
        cityId: value,
      })
    }
  }

  toggleSelect = ({ community, communityName }: CommunitysType) => {
    store.dispatch({
      type: "SET_COMMUNITY",
      payload: { community, communityName },
    })
    this.props.history.goBack()
  }

  render() {
    const { commlist } = this.state
    return (
      <div className={styles.root}>
        <SearchBar
          placeholder="请输入小区和地址"
          onChange={this.handleOnChange}
          onCancel={() => this.props.history.goBack()}
        />
        <ul className={styles.tips}>
          {commlist &&
            commlist.map((ele) => {
              return (
                <li
                  onClick={() => this.toggleSelect(ele)}
                  className={styles.tip}
                  key={ele.community}
                >
                  {ele.communityName}
                </li>
              )
            })}
        </ul>
      </div>
    )
  }

  componentDidMount() {
    this._isMounted = true
    this.getCityInfo()
  }

  componentWillUnmount() {
    this._isMounted = false
  }
}
