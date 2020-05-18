import React, { Component } from "react"
import { Flex } from "antd-mobile"
import { RouteComponentProps } from "react-router"
import {
  AutoSizer,
  List,
  WindowScroller,
  InfiniteLoader,
  ListRowProps,
} from "react-virtualized"

import { apiGetHouseListByCondiction } from "api/houses"
import { getCurrentCity } from "utils/coordinate"
import styles from "./index.module.scss"

import SearchBar from "components/searchBar"
import Affix from "components/affix"
import FilterBar from "components/filterBar"
import HouseItem from "components/houseItem"
import { houseInfoType } from "api/map"

type IProps = RouteComponentProps

type IStates = {
  city: string
  houseListData: houseInfoType[]
  count: number
}

export default class Search extends Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      city: "深圳",
      houseListData: [],
      count: 0,
    }
  }

  getLocateCity = async () => {
    const res = await getCurrentCity()
    console.log("currentCity: ", res)
    this.setState({
      city: res.label,
    })
  }

  /**根须筛选条件获取房屋列表 */
  getHouseListByCondition = async (start: number, end: number) => {
    const { value } = await getCurrentCity()
    const res = await apiGetHouseListByCondiction(value, { start, end })
    if (res.houseList.count > 0) {
      // console.log(res.houseList.list)
      if (start === 1) {
        this.setState({
          houseListData: res.houseList.list,
          count: res.houseList.count,
        })
      } else {
        this.setState({
          houseListData: [...this.state.houseListData, ...res.houseList.list],
          count: res.houseList.count,
        })
      }
    }
  }

  handleFilterData = (data: {}) => {
    console.log("handleData : ", data)
  }

  rowRenderer = (rowProps: ListRowProps): React.ReactNode => {
    // cosnt {} = this.state.houseListData
    if (this.state.houseListData[rowProps.index]) {
      return (
        <div key={rowProps.key} style={rowProps.style}>
          <HouseItem {...this.state.houseListData[rowProps.index]} />
        </div>
      )
    } else {
      return (
        <div key={rowProps.key} style={rowProps.style}>
          <div className={styles.loading}>loading...</div>
        </div>
      )
    }
  }

  isRowLoaded = ({ index }: { index: number }): boolean => {
    // console.log("isRowLoaded: ", index)

    return !!this.state.houseListData[index]
  }

  loadMoreRows = ({
    startIndex,
    stopIndex,
  }: {
    startIndex: number
    stopIndex: number
  }) => {
    console.log(startIndex, stopIndex)
    return this.getHouseListByCondition(startIndex, stopIndex)
  }

  // rowRenderer ({ key, index, style}) {
  //   return (
  //     <div
  //       key={key}
  //       style={style}
  //     >
  //       {list[index]}
  //     </div>
  //   )
  // }

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
        <Affix offsetTop={40}>
          <FilterBar emitFilterCriteria={this.handleFilterData} />
        </Affix>
        <div className={styles.houseList}>
          <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <AutoSizer>
                {({ height, width }) => (
                  <InfiniteLoader
                    isRowLoaded={this.isRowLoaded}
                    loadMoreRows={this.loadMoreRows}
                    rowCount={this.state.count}
                    minimumBatchSize={20}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <List
                        autoHeight
                        isScrolling={isScrolling}
                        scrollTop={scrollTop}
                        onRowsRendered={onRowsRendered}
                        // ref={registerChild}
                        height={height}
                        rowCount={this.state.count}
                        rowHeight={120}
                        rowRenderer={this.rowRenderer}
                        width={width}
                      />
                    )}
                  </InfiniteLoader>
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        </div>
      </div>
    )
  }

  componentDidMount() {
    // console.log(111111122222222)

    this.getLocateCity()
    this.getHouseListByCondition(1, 20)
  }
}
