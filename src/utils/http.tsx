import axios, { AxiosInstance, AxiosResponse } from "axios"
import { BASE_URL } from "../utils/url"

type dataType = [AxiosInstance, undefined]
type errorType = [undefined, AxiosInstance]

const errCheck = (
  innerPromise: Promise<AxiosInstance>
): Promise<dataType | errorType> => {
  return (
    innerPromise
      .then((data: AxiosInstance) => [data, undefined])
      // .catch((error : AxiosInstance) => Promise.resolve([undefined, error]))
      // 相当于 .catch(...) 在TS中会报错
      .then(null, (error: AxiosInstance) => Promise.resolve([undefined, error]))
  )
}

const httpConfig = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
})

type RequestMethods = "GET" | "POST" | "PUT" | "DELETE"

// params: 请求参数 Object {key1:a, key2:b ...}
type ParamsType = { [key: string]: any }

function httpReq(
  subUrl: string,
  method?: RequestMethods,
  args?: ParamsType
): Promise<any> {
  console.log(`innerRequest: ${BASE_URL}${subUrl}`, method, args)
  switch (method) {
    case "GET":
      return errCheck(httpConfig.get(`${BASE_URL}${subUrl}`, { params: args }))
    case "POST":
      return errCheck(httpConfig.post(`${BASE_URL}${subUrl}`, args))
    case "PUT":
      return errCheck(httpConfig.put(`${BASE_URL}${subUrl}`, args))
    case "DELETE":
      return errCheck(
        httpConfig.delete(`${BASE_URL}${subUrl}`, { params: args })
      )
    default:
      break
  }

  return new Promise((resolve, rejects) => {
    rejects(`Unauthorized Reqest Method !! [${method}]`)
  })
}

export function httpGet<T>(
  subUrl: string,
  params?: ParamsType
): Promise<AxiosResponse<T>> {
  console.log("get Request...", subUrl, params)
  return httpReq(subUrl, "GET", params)
}

export function httpPost<T>(
  subUrl: string,
  data: ParamsType
): Promise<AxiosResponse<T>> {
  console.log("post Request...", subUrl, data)
  return httpReq(subUrl, "POST", data)
}

export function httpPut(subUrl: string, data: ParamsType) {
  console.log("put Request...", subUrl, data)
  subUrl = `${subUrl}/${data.id}`
  return httpReq(subUrl, "PUT", data)
}

export function httpDel(subUrl: string, key: any) {
  console.log("delete Request...", subUrl, key)
  subUrl = `${subUrl}/${key}`
  return httpReq(subUrl, "DELETE", undefined)
}
