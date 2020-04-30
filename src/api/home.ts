import { httpGet } from "utils/http"
import { IApiRsp } from "./common"
import { HOME_GROUP, HOME_NEWS, HOME_SWIPER } from "./url"

type swiperType = {
  alt: string
  id: number
  imgSrc: string
}

type getSwiperRsp = {
  swipers: swiperType[]
  err?: string
}

const apiGetSwipers = async (): Promise<getSwiperRsp> => {
  const [res, err] = await httpGet<IApiRsp<swiperType[]>>(HOME_SWIPER)
  if (err) {
    console.log("apiGetSwipers Err: ", err)
    return { swipers: [], err: "net work Err !!!" }
  }

  return { swipers: res.data.body }
}

type groupType = {
  desc: string
  id: number
  imgSrc: string
  title: string
}

type getGroupRsp = {
  groups: groupType[]
  err?: string
}

const apiGetGroups = async (): Promise<getGroupRsp> => {
  const [res, err] = await httpGet<IApiRsp<groupType[]>>(HOME_GROUP)
  if (err) {
    console.log("apiGetGroups Err: ", err)
    return { groups: [], err: "new work Err !!" }
  }
  return { groups: res.data.body }
}

type newsType = {
  date: string
  from: string
  id: number
  imgSrc: string
  title: string
}

type getNewsRsp = {
  news: newsType[]
  err?: string
}

const apiGetNews = async (): Promise<getNewsRsp> => {
  const [res, err] = await httpGet<IApiRsp<newsType[]>>(HOME_NEWS)
  if (err) {
    console.log("apiGetNews Err: ", err)
    return { news: [], err: "net work Error !!" }
  }
  console.log("news: ", res.data.body)
  return { news: res.data.body }
}

export { apiGetSwipers, apiGetGroups, apiGetNews }
