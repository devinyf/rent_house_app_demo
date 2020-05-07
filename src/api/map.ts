import { httpGet } from "utils/http"
import { IApiRsp } from "./common"
import { MAP_INFO, HOUSE } from "./url"

type coordType = {
  latitude: string
  longitude: string
}

type mapType = {
  label: string
  value: string
  coord: coordType
  count: number
}

type getMapInfoRsp = {
  mapInfo: mapType[]
  err?: string
}

/**
 * 通过城市id 获取城市地图数据
 * @param areaId 区域ID
 */
const apiGetMapInfo = async (areaId: string): Promise<getMapInfoRsp> => {
  const [res, err] = await httpGet<IApiRsp<mapType[]>>(MAP_INFO, { id: areaId })
  if (err) {
    return { mapInfo: [], err: `netWork Err!![${err}]` }
  }
  return { mapInfo: res.data.body }
}

export type houseInfoType = {
  houseImg: string
  title: string
  tags: string[]
  price: number
  desc: string
  houseCode: string
}

type houseListType = {
  list: houseInfoType[]
  count: number
}

type getHouseListRsp = {
  houses: houseListType
  err?: string
}

/**
 * 根据筛选条件获取房源数据
 * @param id 区域id
 */
const apiGetHouseList = async (id: string): Promise<getHouseListRsp> => {
  const [res, err] = await httpGet<IApiRsp<houseListType>>(HOUSE, {
    cityId: id,
  })
  if (err) {
    return { houses: { list: [], count: 0 }, err: "network Err !!" }
  }

  return { houses: res.data.body }
}

export { apiGetMapInfo, apiGetHouseList }
