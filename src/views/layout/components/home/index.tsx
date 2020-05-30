import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Carousel, Flex, Grid, WingBlank, Toast } from "antd-mobile"

import SearchBar from "components/searchBar"
import styles from "./index.module.scss"

import { BASE_URL } from "api/url"
import { apiGetGroups, apiGetNews, apiGetSwipers } from "api/home"

import { getCurrentCity } from "utils/coordinate"

import image1 from "assets/images/nav-1.png"
import image2 from "assets/images/nav-2.png"
import image3 from "assets/images/nav-3.png"
import image4 from "assets/images/nav-4.png"

export default class Home extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      imgHeight: 212,
      swipers: undefined, // 轮播图
      groups: undefined,
      news: undefined,
      cityInfo: {},
    }
  }

  navs = [
    { icon: image1, text: "整租", path: "/layout/search" },
    { icon: image2, text: "合租", path: "/layout/search" },
    { icon: image3, text: "地图找房", path: "/bdmap" },
    { icon: image4, text: "去出租", path: "/rent/add" },
  ]

  getSwiperData = async () => {
    const { swipers, err } = await apiGetSwipers()
    if (err) {
      Toast.fail(err)
      return
    }

    this.setState({
      swipers,
    })
  }
  getGroupsData = async () => {
    const { groups, err } = await apiGetGroups()
    if (err) {
      Toast.fail(err)
      return
    }

    this.setState({
      groups,
    })
  }
  getNewsData = async () => {
    const { news, err } = await apiGetNews()
    if (err) {
      Toast.fail(err)
      return
    }

    this.setState({
      news,
    })
  }

  getLocateCity = async () => {
    const res = await getCurrentCity()
    console.log("currentCity: ", res)
    this.setState({
      cityInfo: res,
    })
  }

  renderSwiper() {
    return (
      <Carousel autoplay={false} infinite>
        {this.state.swipers.map((val: any) => (
          <a
            key={val.id}
            href="http://www.alipay.com"
            style={{
              display: "inline-block",
              width: "100%",
              height: this.state.imgHeight,
            }}
          >
            <img
              src={`${BASE_URL}${val.imgSrc}`}
              alt=""
              style={{ width: "100%", verticalAlign: "top" }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event("resize"))
                this.setState({ imgHeight: "auto" })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  renderNavs() {
    return (
      <Flex className={styles.nav}>
        {this.navs.map((ele) => {
          return (
            <Flex.Item key={ele.text}>
              <Link to={`${ele.path}`}>
                <img src={ele.icon} alt="" />
                <p>{ele.text}</p>
              </Link>
            </Flex.Item>
          )
        })}
      </Flex>
    )
  }
  renderGroup() {
    return (
      <div className={styles.groups}>
        <Flex>
          <Flex.Item className={styles.title}>租房小组</Flex.Item>
          <Flex.Item align="end">更多</Flex.Item>
        </Flex>
        <Grid
          columnNum={2}
          hasLine={false}
          square={false}
          data={this.state.groups}
          renderItem={(dataItem: any) => {
            return (
              <div className={styles.navItem}>
                <div className="left">
                  <p> {dataItem.title}</p>
                  <p> {dataItem.desc}</p>
                </div>
                <div className="right">
                  <img src={`${BASE_URL}${dataItem.imgSrc}`} alt="" />
                </div>
              </div>
            )
          }}
        />
      </div>
    )
  }

  renderNews = () => {
    return (
      <div className={styles.news}>
        <h3 className={styles.groupTitle}>最新咨询</h3>
        <WingBlank size="md">
          {this.state.news.map((ele: any) => {
            return (
              <div key={ele.id} className={styles.newItem}>
                <div className={styles.imgWrap}>
                  <img src={`${BASE_URL}${ele.imgSrc}`} alt="" />
                </div>
                <Flex
                  className={styles.content}
                  justify="between"
                  direction="column"
                >
                  <h3 className={styles.title}>{ele.title}</h3>
                  <Flex className={styles.info}>
                    <span>{ele.form}</span>
                    <span>{ele.date}</span>
                  </Flex>
                </Flex>
              </div>
            )
          })}
        </WingBlank>
      </div>
    )
  }

  render() {
    const { swipers, groups, news, cityInfo } = this.state
    return (
      <div className={styles.root}>
        <SearchBar cityName={cityInfo.label}></SearchBar>
        {swipers && this.renderSwiper()}
        {this.renderNavs()}
        {groups && this.renderGroup()}
        {news && this.renderNews()}
      </div>
    )
  }

  componentDidMount() {
    // console.log(style)
    this.getSwiperData()
    this.getGroupsData()
    this.getNewsData()
    this.getLocateCity()
  }
}
