import axios, { AxiosResponse } from "axios"
import { BASE_URL } from "../api/url"

const httpConfig = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
})

const errCheck = <R extends any>(
  innerPromise: Promise<R>
): Promise<[R, undefined] | [undefined, R]> => {
  return (
    // .catch((error: R) => Promise.resolve([undefined, error]))
    // .then(null, (error))相当于 .catch(error) 在TS中会报错
    innerPromise
      .then((data: R) => [data, undefined])
      .then(null, (error: R) => Promise.resolve([undefined, error]))
  )
}

type RequestMethods = "GET" | "POST" | "PUT" | "DELETE"

// params: 请求参数 Object {key1:a, key2:b ...}
type ParamsType = { [key: string]: any }

function httpReq<T>(
  subUrl: string,
  method?: RequestMethods,
  args?: ParamsType
): Promise<any> {
  console.log(`innerRequest: ${BASE_URL}${subUrl}`, method, args)
  switch (method) {
    case "GET":
      return errCheck(
        httpConfig.get<T>(`${BASE_URL}${subUrl}`, { params: args })
      )
    case "POST":
      return errCheck(httpConfig.post<T>(`${BASE_URL}${subUrl}`, args))
    case "PUT":
      return errCheck(httpConfig.put<T>(`${BASE_URL}${subUrl}`, args))
    case "DELETE":
      return errCheck(
        httpConfig.delete<T>(`${BASE_URL}${subUrl}`, { params: args })
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
  // ): Promise<AxiosResponse<T>> {
): Promise<[AxiosResponse<T>, any]> {
  console.log("get Request...", subUrl, params)
  return httpReq<T>(subUrl, "GET", params)
}

export function httpPost<T>(
  subUrl: string,
  data: ParamsType
): Promise<[AxiosResponse<T>, any]> {
  console.log("post Request...", subUrl, data)
  return httpReq(subUrl, "POST", data)
}

export function httpPut<T>(
  subUrl: string,
  data: ParamsType
): Promise<[AxiosResponse<T>, any]> {
  console.log("put Request...", subUrl, data)
  subUrl = `${subUrl}/${data.id}`
  return httpReq(subUrl, "PUT", data)
}

export function httpDel<T>(
  subUrl: string,
  key: any
): Promise<[AxiosResponse<T>, any]> {
  console.log("delete Request...", subUrl, key)
  subUrl = `${subUrl}/${key}`
  return httpReq(subUrl, "DELETE", undefined)
}
