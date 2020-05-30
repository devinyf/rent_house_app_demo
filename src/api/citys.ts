import { httpGet } from "../utils/http"
import { IApiRsp } from "./common"

import { CITY_LIST, HOT_CITY, CURRENT_CITY, COMMUNITYS } from "./url"

export type IcityInfo = {
  label: string
  value: string
  pinyin: string
  short: string
}

type getCityDataRsp = {
  cityList: IcityInfo[]
  hotCitys: IcityInfo[]
  err?: string
}

/**
 * 城市列表页 获取1级城市列表
 */
export const getCityData = async (): Promise<getCityDataRsp> => {
  const [list, hots] = await Promise.all([
    // 城市列表
    httpGet<IApiRsp<IcityInfo[]>>(CITY_LIST, { level: 1 }),
    // 热门城市
    httpGet<IApiRsp<IcityInfo[]>>(HOT_CITY),
  ])

  if (list[1] || hots[1] || list[0].status !== 200 || hots[0].status !== 200) {
    return {
      cityList: [],
      hotCitys: [],
      err: "network Error !",
    }
  }
  return {
    cityList: list[0].data.body,
    hotCitys: hots[0].data.body,
  }
}

export type currentCityInfo = {
  label: string
  value: string
}

export type selectCityRsp = {
  cityInfo: currentCityInfo
  err?: string
}

/**
 * 通过城市名获取城市信息
 * @param cityName
 */
export const getCityByName = async (
  cityName: string
): Promise<selectCityRsp> => {
  const [res, err] = await httpGet<IApiRsp<currentCityInfo>>(CURRENT_CITY, {
    name: cityName,
  })
  if (err) {
    return { cityInfo: { label: "", value: "" }, err: "network Err!!" }
  }

  return { cityInfo: res.data.body }
}

export type CommunitysType = {
  city: string
  cityName: string
  area: string
  areaName: string
  street: string
  streetName: string
  community: string
  communityName: string
}

type getCommunitysRsp = {
  comm?: CommunitysType[]
  err?: string
}

export const apiGetCommunitys = async (
  name: string,
  id: string
): Promise<getCommunitysRsp> => {
  const [res, err] = await httpGet<IApiRsp<CommunitysType[]>>(COMMUNITYS, {
    name,
    id,
  })
  if (err || res.data.status !== 200) {
    return { err: "network Err!!" }
  }
  return { comm: res.data.body }
}
