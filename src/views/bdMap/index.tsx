import React, { Component } from "react"
import NavigationBar from "../../components/navBar"
import { getCurrentCity } from "../../utils/coordinate"

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
  label?: string
  value?: string
}
interface IBdmapState {
  curCityInfo: cityInfo
}

export default class BdMap extends Component<IBdmapProps, IBdmapState> {
  bdmap: any = {}
  constructor(props: IBdmapProps) {
    super(props)
    this.state = {
      curCityInfo: {},
    }
  }

  getCityInfo = async () => {
    let res: any = await getCurrentCity()
    console.log("curCity: ", res)
    this.setState({
      curCityInfo: res,
    })
    this.initBdMap()
  }

  initBdMap = () => {
    const { label } = this.state.curCityInfo
    this.bdmap = new BMap.Map("container")
    // 获取当前城市坐标  地址解析
    var myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    console.log(label)

    myGeo.getPoint(
      label,
      (point: any) => {
        if (point) {
          console.log("point: ", point)

          this.bdmap.centerAndZoom(point, 13)
          this.bdmap.addOverlay(new BMap.Marker(point))
        }
      },
      label
    )
  }

  render() {
    return (
      <div className={styles.map}>
        <NavigationBar title="地图导航" />
        <div id="container"></div>
      </div>
    )
  }
  componentDidMount() {
    this.getCityInfo()
    // this.initBdMap()
  }
}
