import React, { Component } from "react"
import { Flex, PickerView } from "antd-mobile"
import classnames from "classnames"

import styles from "./index.module.scss"

import { getCurrentCity } from "utils/coordinate"
import {
  apiGetHouseConditionById,
  apiGetHouseListByCondiction,
  HouseConditionType,
  HouseInfo,
} from "api/houses"
import FilterFooter from "components/filterFooter"

type OpenType = "area" | "mode" | "price" | "more" | ""

type FilterCategory = {
  name: string
  type: OpenType
}

const filterTypes: FilterCategory[] = [
  { name: "区域", type: "area" },
  { name: "方式", type: "mode" },
  { name: "租金", type: "price" },
  { name: "更多", type: "more" },
]

type IState = {
  openType: OpenType
  filterCriteria: {
    area: string[]
    mode: string[]
    price: string[]
    more: string[]
  }
  pickedValue: {
    area: string[]
    mode: string[]
    price: string[]
    // more: string[]
  }
  houseCondition: HouseConditionType
  moreValue: string[]
}

export default class FilterBar extends Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      openType: "area",
      // 房屋列表筛选条件
      filterCriteria: {
        area: ["area", "null"],
        mode: ["null"],
        price: ["null"],
        more: [],
      },
      // 当前选中的条件
      pickedValue: {
        area: [],
        mode: [],
        price: [],
      },
      moreValue: [],
      // 接口获取 房屋信息
      houseCondition: {
        area: { label: "", value: "", children: [] },
        characteristic: [],
        floor: [],
        rentType: [],
        oriented: [],
        price: [],
        roomType: [],
        subway: { label: "", value: "", children: [] },
      },
    }
  }
  getHouseConditionData = async () => {
    const { value } = await getCurrentCity()
    const res = await apiGetHouseConditionById(value)
    // console.log("houseCondition: ", res)
    this.setState({
      houseCondition: res.houseCondition,
    })
  }
  /**根须筛选条件获取房屋列表 */
  getHouseListByCondition = async () => {
    const { value } = await getCurrentCity()
    const res = await apiGetHouseListByCondiction(value, { start: 1, end: 5 })
    // console.log(">>>>>>>>: ", res)
    if (res.houseList.count > 0) {
      console.log(res.houseList.list)
    }
  }

  toggleSelectTag = (type: OpenType) => {
    this.setState({
      openType: type,
    })
  }

  renderMask = () => {
    const { openType } = this.state
    if (openType === "") {
      return null
    }
    return (
      <div
        className={styles.mask}
        onClick={() => this.setState({ openType: "" })}
      ></div>
    )
  }

  renderFilterTitle = () => {
    return (
      <Flex className={styles.filterTitle}>
        {filterTypes.map((ele) => {
          return (
            <Flex.Item
              key={ele.type}
              className={classnames(styles.dropdown, {
                [styles.selected]: ele.type === this.state.openType,
              })}
              onClick={() => {
                this.toggleSelectTag(ele.type)
              }}
            >
              {ele.name}
              <i className="iconfont icon-arrow"></i>
            </Flex.Item>
          )
        })}
      </Flex>
    )
  }
  changeValue = (value: string[]) => {
    const { openType, pickedValue } = this.state
    // this.setState({
    //   pickedValue: {
    //     ...this.state.pickedValue,
    //     [openType]: value,
    //   },
    // })
    if (openType !== "" && openType !== "more") {
      pickedValue[openType] = value

      this.setState({
        pickedValue,
      })
    }
  }
  renderPickerView = () => {
    const {
      openType,
      pickedValue,
      houseCondition: { area, subway, rentType, price },
    } = this.state
    let data: any = []
    let cols: number = 0
    let value: string[] = []
    switch (openType) {
      case "area":
        data = [area, subway]
        cols = 3
        value = pickedValue["area"]
        break
      case "mode":
        data = rentType
        cols = 1
        value = pickedValue["mode"]
        break
      case "price":
        data = price
        cols = 1
        value = pickedValue["price"]
        break
      default:
        break
    }

    return (
      <div>
        <PickerView
          // key={openType}
          data={data}
          cols={cols}
          value={value}
          onChange={this.changeValue}
        />
        <FilterFooter
          emitSubmit={this.handleSubmit}
          emitCancel={this.handleCancel}
        />
      </div>
    )
  }

  // 切换 more 筛选条件的选中状态
  taggleSelectState = (value: string) => {
    const { moreValue } = this.state
    let newMore: string[] = []
    if (moreValue.includes(value)) {
      newMore = moreValue.filter((ele) => ele !== value)
    } else {
      newMore = [...moreValue, value]
    }

    this.setState({
      moreValue: newMore,
    })
  }

  renderDDItem = (data: HouseInfo[]) => {
    const { moreValue } = this.state
    return data.map((ele) => {
      return (
        <span
          key={ele.value}
          onClick={() => this.taggleSelectState(ele.value)}
          className={classnames(styles.tag, {
            [styles.tagActive]: moreValue.includes(ele.value),
          })}
        >
          {ele.label}
        </span>
      )
    })
  }
  renderMorePick = () => {
    const {
      houseCondition: { roomType, oriented, floor, characteristic },
    } = this.state
    return (
      <React.Fragment>
        <div className={styles.filterMore}>
          {/* // 遮罩层 */}
          {/* <div
          onClick={() => this.setState({ openType: "" })}
          className={styles.mask}
        ></div> */}
          <div className={styles.tags}>
            <dl className={styles.dl}>
              <dt className={styles.dt}>户型</dt>
              <dd className={styles.dd}>{this.renderDDItem(roomType)}</dd>
              <dt className={styles.dt}>朝向</dt>
              <dd className={styles.dd}>{this.renderDDItem(oriented)}</dd>
              <dt className={styles.dt}>楼层</dt>
              <dd className={styles.dd}>{this.renderDDItem(floor)}</dd>
              <dt className={styles.dt}>房屋亮点</dt>
              <dd className={styles.dd}>{this.renderDDItem(characteristic)}</dd>
            </dl>
          </div>
          <div className={styles.filterMoreFooter}>
            <FilterFooter
              emitCancel={this.handleCancel}
              emitSubmit={this.handleSubmit}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }

  handleSubmit = () => {
    console.log("handleSubmit")

    const { pickedValue, filterCriteria, moreValue } = this.state
    this.setState({
      filterCriteria: { ...filterCriteria, ...pickedValue, more: moreValue },
      openType: "",
    })

    // http
  }

  handleCancel = () => {
    console.log("handleCancel")
    this.setState({
      openType: "",
    })
  }

  render() {
    const {
      houseCondition: { area, subway },
      openType,
    } = this.state

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        {this.renderMask()}
        {/* 筛选栏 */}
        <div className={styles.content}>
          {this.renderFilterTitle()}
          {(area.children.length > 0 || subway.children.length > 0) &&
            (openType === "area" ||
              openType === "mode" ||
              openType === "price") &&
            this.renderPickerView()}
        </div>
        {openType === "more" && this.renderMorePick()}
      </div>
    )
  }
  componentDidMount() {
    // console.log(111111)

    this.getHouseConditionData()
    this.getHouseListByCondition()
  }
}
