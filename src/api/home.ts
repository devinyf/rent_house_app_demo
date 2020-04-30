import { httpGet } from "utils/http"
import { IApiRsp } from "./common"

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
  const [res, err] = await httpGet<IApiRsp<swiperType>>("/home/swiper")
  if (err) {
    console.log("apiGetSwipers Err: ", err)
    return { swipers: [], err: "net work Err !!!" }
  }
  console.log("debug 1111 test>>>>>>>>", res.data.body)

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
  const [res, err] = await httpGet<IApiRsp<groupType>>(
    "/home/groups?area=AREA%7C88cff55c-aaa4-e2e0"
  )
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
  const [res, err] = await httpGet<IApiRsp<newsType>>(
    "/home/news?area=AREA%7C88cff55c-aaa4-e2e0"
  )
  if (err) {
    console.log("apiGetNews Err: ", err)
    return { news: [], err: "net work Error !!" }
  }
  console.log("news: ", res.data.body)
  return { news: res.data.body }
}

export { apiGetSwipers, apiGetGroups, apiGetNews }
