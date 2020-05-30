import React, { Component } from "react"
import { Toast } from "antd-mobile"
import { List, AutoSizer, ListRowProps } from "react-virtualized"

import NavigationBar from "../../components/navBar"
import { getCurrentCity, setLoalCity } from "../../utils/coordinate"
import styles from "./index.module.scss"

import { getCityData, IcityInfo } from "../../api/citys"
import { RouteComponentProps } from "react-router-dom"

// 整理后的城市数据： 按字母排序
type organizedCitys = { [key: string]: IcityInfo[] }

interface ICityStates {
  cityObjs: organizedCitys
  cityIndexs: string[]
  selectedCity: number
}

const TITLE_HEIGHT = 36
const CONTENT_HEIGHT = 50

export default class Citys extends Component<RouteComponentProps, ICityStates> {
  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      cityObjs: {},
      cityIndexs: [],
      selectedCity: 0,
    }
  }
  getCityList = async () => {
    const { cityList, hotCitys, err } = await getCityData()
    if (err) {
      Toast.fail(err)
      return
    }

    // 接口城市数据按字母顺序处理 {a:{}, b:{}}

    let orgCitysObj: organizedCitys = cityList.reduce(
      (acc: organizedCitys, ele: IcityInfo): organizedCitys => {
        const tmp: string = ele.short.substring(0, 1)
        if (!acc[tmp]) {
          acc[tmp] = []
        }
        acc[tmp].push(ele)
        return acc
      },
      {}
    )
    let orgCityList = Object.keys(orgCitysObj).sort()
    // 热门城市
    orgCitysObj["hot"] = hotCitys
    orgCityList.unshift("hot")
    // 当前城市 百度地图定位
    const curCitys: any = await getCurrentCity()
    orgCitysObj["#"] = [curCitys]
    orgCityList.unshift("#")

    this.setState({
      cityObjs: orgCitysObj,
      cityIndexs: orgCityList,
    })
  }

  selectCity = (item: IcityInfo) => {
    setLoalCity({ label: item.label, value: item.value })
    this.props.history.goBack()
  }

  // 处理显示城市名称
  formatTitle = (title: string) => {
    switch (title) {
      case "#":
        return "当前城市"
      case "hot":
        return "热门城市"

      default:
        return title.toUpperCase()
    }
  }
  // 渲染右侧索引栏
  renderCityIndex = () => {
    const { cityIndexs } = this.state

    return (
      <div className={styles.cityIndex}>
        {cityIndexs.map((ele) => {
          return (
            <div key={ele} className={styles.cityIndexItem}>
              <span>{ele === "hot" ? "热" : ele.toUpperCase()}</span>
            </div>
          )
        })}
      </div>
    )
  }

  // 渲染左侧城市列表 (virtualized 内部渲染方法)
  renderCityObj = (rowProps: ListRowProps): React.ReactNode => {
    const title = this.state.cityIndexs[rowProps.index]
    // 这里是每个 title 下的数据集
    const contentList = this.state.cityObjs[title].map((ele) => {
      return (
        <li
          onClick={() => {
            this.selectCity(ele)
          }}
          key={ele.value}
          className={styles.name}
        >
          {ele.label}
        </li>
      )
    })

    return (
      <div key={rowProps.key} style={rowProps.style} className={styles.city}>
        <h4 className={styles.title}>{this.formatTitle(title)}</h4>
        <ul className={styles.name}>{contentList}</ul>
      </div>
    )
  }
  calcRowHeight = ({ index }: { index: number }): number => {
    const { cityIndexs, cityObjs } = this.state
    let tmpList = cityObjs[cityIndexs[index]]
    let listHeight = TITLE_HEIGHT + CONTENT_HEIGHT * tmpList.length
    return listHeight
  }

  render() {
    const { cityObjs, cityIndexs } = this.state
    return (
      <div className={styles.citylist}>
        <NavigationBar />
        {/* 左侧城市列表 */}
        {cityObjs && (
          <AutoSizer>
            {({ height, width }) => (
              <List
                // style={{ backgroundColor: "red" }}
                width={width}
                height={height}
                rowCount={cityIndexs.length}
                rowHeight={this.calcRowHeight}
                rowRenderer={this.renderCityObj}
              />
            )}
          </AutoSizer>
        )}
        {/* 右侧城市索引 */}
        {cityIndexs && this.renderCityIndex()}
      </div>
    )
  }

  // =================== lifeCycle Functions ===================
  componentDidMount() {
    this.getCityList()
  }
}
