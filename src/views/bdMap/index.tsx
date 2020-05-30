import React, { Component } from "react"
import NavigationBar from "../../components/navBar"
import { getCurrentCity } from "../../utils/coordinate"
import { apiGetMapInfo, apiGetHouseList, houseInfoType } from "api/map"
import { Toast } from "antd-mobile"
import classnames from "classnames"
import HouseItem from "components/houseItem"

import styles from "./index.module.scss"

declare global {
  interface Window {
    BMap: any
  }
}

const BMap = window.BMap

interface IBdmapProps {
  cityName: string
}

type cityInfo = {
  label?: string // 城市名
  value?: string // 城市id
}
interface IBdmapState {
  curCityInfo: cityInfo
  isShowHouseList: boolean
  houseList: houseInfoType[]
}

export default class BdMap extends Component<IBdmapProps, IBdmapState> {
  bdmap: any = {}
  constructor(props: IBdmapProps) {
    super(props)
    this.state = {
      curCityInfo: {
        label: undefined,
        value: undefined,
      },
      isShowHouseList: false,
      houseList: [],
    }
  }
  // 渲染地图覆盖层
  renderOverLayData = async (areaId: string, bdMap: any, zoomLevel: number) => {
    Toast.loading("Loading...", 0, () => {
      console.log("Load complete !!!")
    })
    const { mapInfo, err } = await apiGetMapInfo(areaId)
    if (err) {
      Toast.fail(err)
      return
    }
    Toast.hide()
    // return mapInfo
    mapInfo.forEach((ele) => {
      let point = new BMap.Point(ele.coord.longitude, ele.coord.latitude)
      let opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(30, -30), //设置文本偏移量
      }
      let overLayLabel = new BMap.Label("", opts) // 创建文本标注对象
      if (zoomLevel < 15) {
        overLayLabel.setContent(
          `<div class=${styles.bubble}>
            <p class=${styles.name}>${ele.label}区</p>
            <p class=${styles.name}>${ele.count}套</p>
          </div>`
        )
      } else {
        overLayLabel.setContent(
          `<div class=${styles.rect}>
            <span class=${styles.housename}>${ele.label}</span>
            <span class=${styles.housenum}>${ele.count}套</span>
            <i class=${styles.arrow}></i>
          </div>`
        )
      }

      overLayLabel.setStyle({
        color: "#fff",
        // backGroundColor: "#00bb72",
        border: "1px",
        borderColor: "green",
        fontSize: "14px",
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑",
      })
      overLayLabel.addEventListener("click", (e: TouchEvent) => {
        if (zoomLevel < 15) {
          setTimeout(() => {
            bdMap.clearOverlays()
          }, 0)
          bdMap.centerAndZoom(point, zoomLevel + 2)
          this.renderOverLayData(ele.value, bdMap, zoomLevel + 2)
        } else {
          if (e.changedTouches.length > 0) {
            const { clientX, clientY } = e.changedTouches[0]
            const moveX = window.screen.width / 2 - clientX
            const moveY = window.screen.height / 2 - clientY

            this.bdmap.panBy(moveX, moveY)
          }

          this.getHouseListInfo(ele.value)
          this.setState({
            isShowHouseList: true,
          })
        }
      })

      bdMap.addOverlay(overLayLabel)
    })
  }

  getHouseListInfo = async (id: string) => {
    const { houses, err } = await apiGetHouseList(id)
    if (err) {
      Toast.fail(err)
      return
    }
    this.setState({
      houseList: houses.list,
    })
  }

  getCityInfo = async () => {
    let res: any = await getCurrentCity()
    this.setState({
      curCityInfo: res,
    })
    this.initBdMap()
  }

  initBdMap = () => {
    const { label, value } = this.state.curCityInfo
    this.bdmap = new BMap.Map("container")

    this.bdmap.addEventListener("touchstart", () => {
      this.setState({
        isShowHouseList: false,
      })
    })

    // 获取当前城市坐标  地址解析
    let myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野

    myGeo.getPoint(
      label,
      (point: any) => {
        if (point) {
          let zoomLevel = 11
          this.bdmap.centerAndZoom(point, zoomLevel)

          if (value) {
            this.renderOverLayData(value, this.bdmap, zoomLevel)
          }
        }
      },
      label
    )
  }
  // 房屋详情列表弹窗
  renderHoseList = () => {
    const { isShowHouseList, houseList } = this.state
    return (
      <div
        className={classnames(styles.houseList, {
          [styles.show]: isShowHouseList,
        })}
      >
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <a className={styles.titleMore} href="#">
            更多房源
          </a>
        </div>
        <div className={styles.houseItems}>
          {houseList &&
            houseList.map((ele) => {
              return <HouseItem key={ele.houseCode} {...ele} />
            })}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.map}>
        <NavigationBar title="地图导航" />
        <div id="container"></div>
        {this.renderHoseList()}
      </div>
    )
  }
  componentDidMount() {
    this.getCityInfo()
  }
}
