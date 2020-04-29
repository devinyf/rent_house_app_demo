import { httpGet } from "../utils/http"
import { IApiRsp } from "./common"

import { CITY_LIST, HOT_CITY } from "./url"

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

export const getCityData = async (): Promise<getCityDataRsp> => {
  const [list, hots] = await Promise.all([
    // 城市列表
    httpGet<IApiRsp<IcityInfo>>(CITY_LIST, { level: 1 }),
    // 热门城市
    httpGet<IApiRsp<IcityInfo>>(HOT_CITY),
  ])

  if (list[1] || hots[1] || list[0].status !== 200 || hots[0].status !== 200) {
    return {
      cityList: [],
      hotCitys: [],
      err: "network Error !",
    }
  }
  console.log("getCityData OK")
  return {
    cityList: list[0].data.body,
    hotCitys: hots[0].data.body,
  }
}
