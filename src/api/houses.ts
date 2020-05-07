import { httpGet } from "utils/http"
import { IApiRsp } from "./common"
import { HOUSE } from "./url"

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

export { apiGetHouseInfoById }
