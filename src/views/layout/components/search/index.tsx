import React, { Component } from "react"
import { Flex } from "antd-mobile"
import { RouteComponentProps } from "react-router"

import { getCurrentCity } from "utils/coordinate"
import styles from "./index.module.scss"

import SearchBar from "components/searchBar"
import FilterBar from "components/filterBar"

type IProps = RouteComponentProps

type IStates = {
  city: string
}

export default class Search extends Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      city: "深圳",
    }
  }

  getLocateCity = async () => {
    const res = await getCurrentCity()
    console.log("currentCity: ", res)
    this.setState({
      city: res.label,
    })
  }

  render() {
    return (
      <div className={styles.root}>
        <Flex className={styles.listHeader}>
          <i
            onClick={() => this.props.history.goBack()}
            className="iconfont icon-back"
          />
          <SearchBar
            cityName={this.state.city}
            className={styles.mySearchBar}
          ></SearchBar>
        </Flex>
        <FilterBar />
      </div>
    )
  }

  componentDidMount() {
    this.getLocateCity()
  }
}
