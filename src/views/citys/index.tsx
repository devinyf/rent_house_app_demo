import React, { Component } from "react"
import { Toast } from "antd-mobile"
import { List, AutoSizer, ListRowProps } from "react-virtualized"

import { httpGet } from "../../utils/http"
import NavigationBar from "../../components/navBar"
import { getCurrentCity } from "../../utils/coordinate"
import styles from "./index.module.scss"

interface IrowRendererType {
  key: any
  index: any
  isScrolling: boolean
  isVisible: boolean
  style: any
}

interface IcityInfo {
  label: string
  value: string
  pinyin: string
  short: string
}

interface IcityReqType {
  status: number
  description: string
  body: IcityInfo[]
}

type organizedCitys = { [key: string]: IcityInfo[] }

type CityStates = {
  cityObjs: organizedCitys
  cityIndexs: string[]
  selectedCity: number
}

const TITLE_LEIGHT = 36
const CONTENT_LEIGHT = 50

export default class Citys extends Component<any, CityStates> {
  constructor(props: CityStates) {
    super(props)
    this.state = {
      cityObjs: {},
      cityIndexs: [],
      selectedCity: 0,
    }
  }
  getCityList = async () => {
    const [cityList, hotCitys] = await Promise.all([
      httpGet<IcityReqType>("/area/city", { level: 1 }),
      httpGet<IcityReqType>("/area/hot"),
    ])
    if (
      cityList[1] ||
      hotCitys[1] ||
      cityList[0].status !== 200 ||
      hotCitys[0].status !== 200
    ) {
      Toast.fail("network error !!")
      return
    }
    console.log("cityList: ", cityList)

    // 接口城市数据按字母顺序处理 {a:{}, b:{}}

    let orgCitysObj: organizedCitys = cityList[0].data.body.reduce(
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
    orgCitysObj["hot"] = hotCitys[0].data.body
    orgCityList.unshift("hot")
    // 当前城市 百度地图定位
    const curCitys: any = await getCurrentCity()
    console.log("mapRes: ", curCitys)
    orgCitysObj["#"] = [curCitys]
    orgCityList.unshift("#")
    // console.log("orgCitysObj", orgCitysObj)
    // console.log("orgCityList", orgCityList)

    this.setState({
      cityObjs: orgCitysObj,
      cityIndexs: orgCityList,
    })
  }

  // 处理显示城市名称
  formatTitle = (title: string) => {
    switch (title) {
      case "#":
        return "定位城市"
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
  rowRenderer = (rowProps: ListRowProps): React.ReactNode => {
    // console.log("rowProps: ", rowProps)
    const title = this.state.cityIndexs[rowProps.index]
    const contentList = this.state.cityObjs[title].map((ele) => {
      return (
        <div key={ele.value} className={styles.name}>
          {ele.label}
        </div>
      )
    })

    return (
      <div key={rowProps.key} style={rowProps.style} className={styles.city}>
        <div className={styles.title}>{this.formatTitle(title)}</div>
        <div className={styles.name}>{contentList}</div>
      </div>
    )
  }
  calcRowHeight = ({ index }: { index: number }): number => {
    const { cityIndexs, cityObjs } = this.state
    let tmpList = cityObjs[cityIndexs[index]]
    let listHeight = TITLE_LEIGHT + CONTENT_LEIGHT * tmpList.length
    return listHeight
  }

  render() {
    const { cityObjs, cityIndexs } = this.state
    return (
      <div className={styles.citylist}>
        <NavigationBar />
        {cityObjs && (
          <AutoSizer>
            {({ height, width }) => (
              <List
                // style={{ backgroundColor: "red" }}
                width={width}
                height={height}
                rowCount={cityIndexs.length}
                rowHeight={this.calcRowHeight}
                rowRenderer={this.rowRenderer}
              />
            )}
          </AutoSizer>
        )}
        {cityIndexs && this.renderCityIndex()}
      </div>
    )
  }

  // =================== lifeCycle Functions ===================
  componentDidMount() {
    this.getCityList()
  }
}
