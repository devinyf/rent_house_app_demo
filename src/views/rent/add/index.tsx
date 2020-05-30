import React, { Component } from "react"
import {
  List,
  InputItem,
  Picker,
  TextareaItem,
  ImagePicker,
  Flex,
  Toast,
} from "antd-mobile"
import { RouteComponentProps } from "react-router-dom"
import store from "store"

import { apiUploadHouseImgs } from "api/houses"
import { apiAddUserHouse } from "api/user"
import NavigationBar from "components/navBar"
import styles from "./index.module.scss"
import HouseFacilites from "components/houseFacilities"

// 房屋类型
const roomTypeData = [
  { label: "一室", value: "ROOM|d4a692e4-a177-37fd" },
  { label: "二室", value: "ROOM|d1a00384-5801-d5cd" },
  { label: "三室", value: "ROOM|20903ae0-c7bc-f2e2" },
  { label: "四室", value: "ROOM|ce2a5daa-811d-2f49" },
  { label: "四室+", value: "ROOM|2731c38c-5b19-ff7f" },
]

// 楼层
const floorData = [
  { label: "高楼层", value: "FLOOR|1" },
  { label: "中楼层", value: "FLOOR|2" },
  { label: "低楼层", value: "FLOOR|3" },
]

// 朝向：
const orientedData = [
  { label: "东", value: "ORIEN|141b98bf-1ad0-11e3" },
  { label: "西", value: "ORIEN|103fb3aa-e8b4-de0e" },
  { label: "南", value: "ORIEN|61e99445-e95e-7f37" },
  { label: "北", value: "ORIEN|caa6f80b-b764-c2df" },
  { label: "东南", value: "ORIEN|dfb1b36b-e0d1-0977" },
  { label: "东北", value: "ORIEN|67ac2205-7e0f-c057" },
  { label: "西南", value: "ORIEN|2354e89e-3918-9cef" },
  { label: "西北", value: "ORIEN|80795f1a-e32f-feb9" },
]

type UploadFileType = {
  file: object
  orientation: number
  url: string
}

type Istate = {
  communityName?: string
  community: string
  roomType: string
  title: string
  description: string
  houseImg: string
  oriented: string
  supporting: string
  price: string
  size: string
  floor: string
  files: {}[]
}

type StoreType = {
  community?: string
  communityName?: string
}

export default class RentAdd extends Component<RouteComponentProps, Istate> {
  constructor(props: any) {
    super(props)
    const storeStat: any = store.getState()
    let community: any, communityName: any
    if (storeStat) {
      community = storeStat.community
      communityName = storeStat.communityName
    }

    this.state = {
      communityName: communityName,
      community: community || "",
      roomType: "",
      title: "",
      description: "",
      houseImg: "",
      oriented: "",
      supporting: "",
      price: "",
      size: "",
      floor: "",
      files: [],
    }
  }

  handlePhotoChange = (
    files: {}[],
    type: string,
    index: number | undefined
  ) => {
    this.setState({
      files,
    })
  }

  handleSelectedData = (data: string) => {
    if (data) {
      this.setState({
        supporting: data,
      })
    }
  }

  cancel = () => {
    this.props.history.goBack()
  }

  publishHouse = async () => {
    const { isSucc, err } = await apiAddUserHouse(this.state)
    if (err) {
      Toast.fail(err)
      return
    }
    if (isSucc) {
      this.props.history.replace("/rent")
    }
  }

  formDataValidation = (): boolean => {
    // 数据完整性校验
    const {
      community,
      price,
      size,
      title,
      roomType,
      floor,
      oriented,
      files,
      supporting,
    } = this.state

    if (!community) {
      Toast.info("必须选择小区", 1)
      return false
    }

    if (price.trim().length === 0) {
      Toast.info("必须填写租金", 1)
      return false
    }

    if (size.trim().length === 0) {
      Toast.info("必须填写建筑面积", 1)
      return false
    }

    if (roomType.trim().length === 0) {
      Toast.info("必须选择户型", 1)
      return false
    }

    if (floor.trim().length === 0) {
      Toast.info("必须选择所在楼层", 1)
      return false
    }

    if (oriented.trim().length === 0) {
      Toast.info("必须选择朝向", 1)
      return false
    }

    if (title.trim().length === 0) {
      Toast.info("必须填写房屋标题", 1)
      return false
    }

    if (files.length === 0) {
      Toast.info("必须选择房屋头像", 1)
      return false
    }

    if (supporting.trim().length === 0) {
      Toast.info("必须选择房屋配套", 1)
      return false
    }

    return true
  }

  submit = async () => {
    if (!this.formDataValidation()) return

    const { files } = this.state
    const formData = new FormData()
    files.forEach((ele: any) => {
      formData.append("file", ele.file)
    })

    const { urls, err } = await apiUploadHouseImgs(formData)
    if (err) {
      Toast.fail(err)
      return
    }
    this.setState(
      {
        houseImg: urls.join("|"),
      },
      this.publishHouse
    )
  }

  render() {
    const {
      communityName,
      price,
      size,
      roomType,
      floor,
      title,
      oriented,
      description,
      files,
    } = this.state
    return (
      <div className={styles.root}>
        <NavigationBar title="房源发布" />
        <List renderHeader={() => "房源信息"} className="my-list">
          <List.Item
            extra={communityName ? communityName : "请输入小区名称"}
            arrow="horizontal"
            onClick={() => this.props.history.push("/rent/search")}
          >
            小区名称
          </List.Item>
          <InputItem
            clear
            placeholder="请输入租金/月"
            value={price}
            onChange={(val) => this.setState({ price: val })}
            extra="¥/月"
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem
            clear
            placeholder="请输入建筑面积"
            value={size}
            onChange={(val) => this.setState({ size: val })}
            extra="㎡"
          >
            建筑面积
          </InputItem>
          <Picker
            data={roomTypeData}
            value={[roomType]}
            onChange={(val) =>
              val &&
              this.setState({
                roomType: val[0] as string,
              })
            }
          >
            <List.Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </List.Item>
          </Picker>
          <Picker
            data={floorData}
            value={[floor]}
            onChange={(val) =>
              val && this.setState({ floor: val[0] as string })
            }
          >
            <List.Item arrow="horizontal">所在楼层</List.Item>
          </Picker>
          <Picker
            data={orientedData}
            value={[oriented]}
            onChange={(val) =>
              val && this.setState({ oriented: val[0] as string })
            }
          >
            <List.Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </List.Item>
          </Picker>
        </List>
        <List renderHeader={() => "房屋标题"} className="my-list">
          <InputItem
            value={title}
            onChange={(val: string) => this.setState({ title: val })}
            placeholder="请输入标题（例如：整租 小区名 2室 5000元)"
          />
        </List>
        <List renderHeader={() => "房屋描述"} className="my-list">
          <TextareaItem
            value={description}
            onChange={(val) => this.setState({ description: val as string })}
            rows={3}
            placeholder="房屋介绍信息"
          />
        </List>
        <List renderHeader={() => "房屋头像"}>
          <ImagePicker
            files={files}
            onChange={this.handlePhotoChange}
            selectable={files.length < 9}
          />
        </List>
        <List renderHeader={() => "房屋配套"}>
          <HouseFacilites
            supportItemlist="all"
            editable
            emitSelectedData={this.handleSelectedData}
          />
        </List>
        <Flex className={styles.bottom}>
          <Flex.Item onClick={this.cancel} className={styles.cancel}>
            取消
          </Flex.Item>
          <Flex.Item onClick={this.submit} className={styles.confirm}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
