import { httpGet, httpPost } from "utils/http"
import { IApiRsp } from "./common"
import { HOUSE, HOUSE_CONDITION, HOUSE_IMAGE } from "./url"
import { houseInfoType } from "api/map"

export type HouseDetailType = {
  houseImg: string[]
  title: string
  tags: string[]
  price: number
  houseCode: string
  description: string
  roomType: string
  oriented: string[]
  floor: string
  community: string
  coord: {
    latitude: number
    longitude: number
  }
  supporting: string[]
  size: number
}

type getHouseInfoByIdRsp = {
  houseInfo: HouseDetailType
  err?: string
}

const apiGetHouseInfoById = async (
  id: string
): Promise<getHouseInfoByIdRsp> => {
  const [res, err] = await httpGet<IApiRsp<HouseDetailType>>(`${HOUSE}/${id}`)
  if (err) {
    return {
      houseInfo: {
        houseImg: [],
        title: "",
        tags: [],
        price: 0,
        houseCode: "",
        description: "",
        roomType: "",
        oriented: [],
        floor: "",
        community: "",
        coord: {
          latitude: 0,
          longitude: 0,
        },
        supporting: [],
        size: 0,
      },
      err: err,
    }
  }
  return { houseInfo: res.data.body }
}

export type HouseInfo = {
  label: string
  value: string
}

type HouseInfoCascade = HouseInfo & {
  children: HouseInfo[]
}

export type HouseConditionType = {
  area: HouseInfoCascade
  characteristic: HouseInfo[]
  floor: HouseInfo[]
  rentType: HouseInfo[]
  oriented: HouseInfo[]
  price: HouseInfo[]
  roomType: HouseInfo[]
  subway: HouseInfoCascade
}

type getHouseConditionRsp = {
  houseCondition: HouseConditionType
  err?: string
}

const apiGetHouseConditionById = async (
  id: string
): Promise<getHouseConditionRsp> => {
  const [res, err] = await httpGet<IApiRsp<HouseConditionType>>(
    HOUSE_CONDITION,
    { id }
  )
  if (err) {
    return {
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
      err,
    }
  }
  return { houseCondition: res.data.body }
}

type houseListType = {
  list: houseInfoType[]
  count: number
}

type getHouseListByCondictionRsp = {
  houseList: houseListType
  err?: string
}

const apiGetHouseListByCondiction = async (
  cityId: string,
  args?: {}
): Promise<getHouseListByCondictionRsp> => {
  const [res, err] = await httpGet<IApiRsp<houseListType>>(HOUSE, {
    cityId,
    ...args,
  })
  if (err) {
    return {
      houseList: {
        list: [],
        count: 0,
      },
      err,
    }
  }
  // res.data.body.list
  return { houseList: res.data.body }
}

type UploadFileRsp = {
  urls: string[]
  err?: string
}

const apiUploadHouseImgs = async (
  formData: FormData
): Promise<UploadFileRsp> => {
  const [res, err] = await httpPost<IApiRsp<string[]>>(HOUSE_IMAGE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  if (err || res.data.status !== 200) {
    return { urls: [], err: "netWork Err !" }
  }
  return { urls: res.data.body }
}

// const api

export {
  apiGetHouseInfoById,
  apiGetHouseConditionById,
  apiGetHouseListByCondiction,
  apiUploadHouseImgs,
}
