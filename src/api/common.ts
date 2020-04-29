export interface IApiRsp<B> {
  status: number
  description: string
  body: B[]
}
