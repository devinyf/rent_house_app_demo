/**
 * 后端应答格式：
 * status - 状态码
 * description - 说明
 * body - 数据
 */
export interface IApiRsp<B> {
  status: number
  description: string
  body: B
}
