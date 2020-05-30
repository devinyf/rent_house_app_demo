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
  supportItemlist: string[] | "all"
  editable?: true
  emitSelectedData?: (data: string) => void
}

type IState = {
  supportedItems: ItemType[]
  selectedItem: string[]
}

export default class HouseFacilites extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const { supportItemlist, editable } = this.props
    let tmpsupportedItems: ItemType[] = []
    if (!editable) {
      tmpsupportedItems = HOUSE_PACKAGE.filter((ele) => {
        return supportItemlist.includes(ele.name)
      })
    } else {
      tmpsupportedItems = HOUSE_PACKAGE
    }
    // console.log("supportedItems", tmpsupportedItems)

    this.state = {
      supportedItems: tmpsupportedItems,
      selectedItem: [],
    }
  }
  toggleFac = (name: string) => {
    if (!this.props.editable) {
      console.log("not editable")
      return
    }
    let { selectedItem } = this.state
    // console.log(name)

    if (selectedItem.includes(name)) {
      // selectedItem.splice(name, 1)
      selectedItem = selectedItem.filter((ele) => {
        return ele !== name
      })
    } else {
      selectedItem.push(name)
    }

    this.setState(
      {
        selectedItem,
      },
      () => {
        this.props.emitSelectedData &&
          this.props.emitSelectedData(this.state.selectedItem.join("|"))
      }
    )
  }
  render() {
    return (
      <ul className={styles.root}>
        {this.state.supportedItems.map((ele) => {
          return (
            <li
              className={classnames(styles.item, {
                [styles.active]: this.state.selectedItem.includes(ele.name),
              })}
              key={ele.id}
              onClick={() => this.toggleFac(ele.name)}
            >
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
