import React, { Component } from "react"

import classnames from "classnames"
import styles from "./index.module.scss"

// 所有房屋配置项
const HOUSE_PACKAGE = [
  {
    id: 1,
    name: "衣柜",
    icon: "icon-wardrobe",
  },
  {
    id: 2,
    name: "洗衣机",
    icon: "icon-wash",
  },
  {
    id: 3,
    name: "空调",
    icon: "icon-air",
  },
  {
    id: 4,
    name: "天然气",
    icon: "icon-gas",
  },
  {
    id: 5,
    name: "冰箱",
    icon: "icon-ref",
  },
  {
    id: 6,
    name: "暖气",
    icon: "icon-Heat",
  },
  {
    id: 7,
    name: "电视",
    icon: "icon-vid",
  },
  {
    id: 8,
    name: "热水器",
    icon: "icon-heater",
  },
  {
    id: 9,
    name: "宽带",
    icon: "icon-broadband",
  },
  {
    id: 10,
    name: "沙发",
    icon: "icon-sofa",
  },
]
type ItemType = {
  id: number
  name: string
  icon: string
}

type IProps = {
  supportItemlist: string[]
}
type IState = {
  supportedItems: ItemType[]
}

export default class HouseFacilites extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const tmpsupportedItems = HOUSE_PACKAGE.filter((ele) => {
      return this.props.supportItemlist.includes(ele.name)
    })
    console.log("supportedItems", tmpsupportedItems)

    this.state = {
      supportedItems: tmpsupportedItems,
    }
  }
  render() {
    return (
      <ul className={styles.root}>
        {this.state.supportedItems.map((ele) => {
          return (
            <li className={styles.item} key={ele.id}>
              <p>
                <i
                  className={classnames(`iconfont`, ele.icon, styles.icon)}
                ></i>
              </p>
              {ele.name}
            </li>
          )
        })}
      </ul>
    )
  }
  componentDidMount() {
    // console.log(">>>>>>>>>", this.props.supportItemlist)
  }
}
