import React, { Component } from "react"
import { RouteComponentProps } from "react-router-dom"
import { Toast, Carousel, Flex } from "antd-mobile"
import classnames from "classnames"

import { apiGetHouseInfoById, HouseDetailType } from "api/houses"
import { apiAddFavorite, apiDelFavorite } from "api/user"
import { BASE_URL } from "api/url"
import NavigationBar from "components/navBar"
import HouseFacilites from "components/houseFacilities"

import styles from "./index.module.scss"

const BMap = window.BMap
const labelStyle = {
  color: "red",
  fontSize: "12px",
  height: "20px",
  lineHeight: "20px",
  fontFamily: "微软雅黑",
}

type Iparams = {
  id: string
}

type Istate = {
  houseInfo?: HouseDetailType
  imgHeight: number | string
  isFavorate: boolean
}

export default class Detail extends Component<
  RouteComponentProps<Iparams>,
  Istate
> {
  constructor(props: RouteComponentProps<Iparams>) {
    super(props)
    this.state = {
      houseInfo: undefined,
      imgHeight: 252,
      isFavorate: false,
    }
  }

  getHouseDetail = async () => {
    const id = this.props.match.params.id
    const { houseInfo, err } = await apiGetHouseInfoById(id)
    if (err) {
      Toast.fail("netWork Err!!")
      return
    }

    this.setState(
      {
        houseInfo,
      },
      () => {
        // setTimeout(() => {
        this.initMap()
        // }, 200)
      }
    )
  }

  handleFavorite = async () => {
    const { id } = this.props.match.params
    if (this.state.isFavorate) {
      // 取消搜藏
      const { isSuccess, err } = await apiDelFavorite(id)
      if (err) {
        Toast.fail(err)
        return
      }
      if (isSuccess) {
        this.setState({
          isFavorate: false,
        })
      }
    } else {
      // 添加搜藏
      const { isSuccess, err } = await apiAddFavorite(id)
      if (err) {
        Toast.fail(err)
        return
      }
      if (isSuccess) {
        this.setState({
          isFavorate: true,
        })
      }
    }
  }

  renderCarousel = () => {
    const { houseInfo } = this.state
    return (
      <Carousel
        autoplay={false}
        infinite
        beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
        afterChange={(index) => console.log("slide to", index)}
      >
        {houseInfo &&
          houseInfo.houseImg.map((val) => (
            <a
              key={val}
              href="http://www.alipay.com"
              style={{
                display: "inline-block",
                width: "100%",
                height: this.state.imgHeight,
              }}
            >
              <img
                src={`${BASE_URL}${val}`}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  verticalAlign: "top",
                }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event("resize"))
                  this.setState({ imgHeight: 252 })
                }}
              />
            </a>
          ))}
      </Carousel>
    )
  }
  renderBaseInfo = () => {
    const { houseInfo } = this.state
    return (
      <div className={styles.info}>
        <h3 className={styles.infoTitle}>{houseInfo && houseInfo.title}</h3>
        <Flex className={styles.tags}>
          {houseInfo &&
            houseInfo.tags.map((ele, idx) => {
              const tagStyle = `tag${(idx % 3) + 1}`
              return (
                <span
                  key={ele}
                  className={classnames(styles.tag, styles[tagStyle])}
                >
                  {ele}
                </span>
              )
            })}
        </Flex>
        <Flex className={styles.infoPrice}>
          <Flex.Item className={styles.infoPriceItem}>
            <div>
              {houseInfo && houseInfo.price}
              <span className={styles.month}>/月</span>
            </div>
            <div>租金</div>
          </Flex.Item>
          <Flex.Item className={styles.infoPriceItem}>
            <div>{houseInfo && houseInfo.roomType}</div>
            <div>房型</div>
          </Flex.Item>
          <Flex.Item className={styles.infoPriceItem}>
            <div>{houseInfo && houseInfo.size}</div>
            <div>面积</div>
          </Flex.Item>
        </Flex>
        <Flex>
          <Flex.Item>
            <div>
              <span className={styles.title}>装修:</span> 精装修
            </div>
            <div>
              <span className={styles.title}>楼层:</span>{" "}
              {houseInfo && houseInfo.floor}
            </div>
          </Flex.Item>
          <Flex.Item>
            <div>
              <span className={styles.title}>朝向:</span>
              {houseInfo && houseInfo.oriented.join(" ")}
            </div>
            <div>
              <span className={styles.title}>类型:</span>普通住宅
            </div>
          </Flex.Item>
        </Flex>
      </div>
    )
  }

  renderMap() {
    const { houseInfo } = this.state

    return (
      <div className={styles.map}>
        <div className={styles.mapTitle}>
          小区:{houseInfo && houseInfo.community}
        </div>
        <div className={styles.mapContainer} id="map"></div>
      </div>
    )
  }
  initMap = () => {
    if (this.state.houseInfo) {
      const {
        houseInfo: {
          coord: { longitude, latitude },
          community,
        },
      } = this.state

      // 创建地图
      const map = new BMap.Map("map")

      let point = new BMap.Point(longitude, latitude)
      map.centerAndZoom(point, 15)

      var opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(-36, -66), //设置文本偏移量
      }

      var label = new BMap.Label("", opts) // 创建文本标注对象
      label.setStyle(labelStyle)
      label.setContent(`
        <div>${community}</div>
        <div class=${styles.mapArrow}></div>
    `)
      map.addOverlay(label)
    }
  }

  renderHouseFacilites = () => {
    if (this.state.houseInfo) {
      const {
        houseInfo: { supporting },
      } = this.state
      return (
        <div>
          <div>房屋配套</div>
          {supporting.length > 0 ? (
            <HouseFacilites supportItemlist={supporting} />
          ) : (
            "暂无数据"
          )}
        </div>
      )
    }
  }

  renderFooter = () => {
    const { isFavorate } = this.state

    return (
      <Flex className={styles.fixedBottom} align="center">
        <Flex.Item /*onClick={this.isFavorate}*/>
          <img
            style={{ height: 16 }}
            className={styles.favoriteImg}
            src={
              isFavorate
                ? "http://huangjiangjun.top:8088/img/star.png"
                : "http://huangjiangjun.top:8088/img/unstar.png"
            }
            alt=""
          />
          <span className={styles.favorite} onClick={this.handleFavorite}>
            {isFavorate ? "已搜藏" : "搜藏"}
          </span>
        </Flex.Item>
        <Flex.Item>在线咨询</Flex.Item>
        <Flex.Item>
          <a className={styles.telephone} href="tel:18576486260">
            {/*  todo 在线咨询  */}
            电话预约
          </a>
        </Flex.Item>
      </Flex>
    )
  }

  render() {
    const { houseInfo } = this.state
    console.log(this.props.match.params)

    return (
      <div>
        <NavigationBar
          className={styles.detailHeader}
          title={houseInfo && houseInfo.community}
          rightContent={[<i key="1" className="iconfont icon-share" />]}
        />
        {/* 轮播图 */}
        {houseInfo && this.renderCarousel()}
        {/* 房屋信息 */}
        {this.renderBaseInfo()}
        {/* 地图 */}
        {this.renderMap()}
        {/* 房屋配套 */}
        {this.renderHouseFacilites()}
        {/* footer 按钮 */}
        {this.renderFooter()}
      </div>
    )
  }

  // ================= lifeCycle Functions =================
  componentDidMount() {
    this.getHouseDetail()
    // console.log("houseInfo: ", this.state.houseInfo)
  }
}
