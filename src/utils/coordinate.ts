import { httpGet } from "./http"

const BMap = window.BMap
const LOCAL_CITY = "local-city"

const getLocalCitys = () => {
  const citys = window.localStorage.getItem(LOCAL_CITY)
  if (!citys) {
    return
  }
  const cityObj = JSON.parse(citys)
  return cityObj
}

const setLoalCitys = (citys: object) => {
  window.localStorage.setItem(LOCAL_CITY, JSON.stringify(citys))
}

/**
 * 通过ip定位 获取城市坐标
 */
const getCurrentCity = () => {
  return new Promise((resolve, reject) => {
    async function getCityIdByName(result: any) {
      var cityName = result.name
      const curCitysBody = getLocalCitys()
      if (curCitysBody) {
        resolve(curCitysBody)
        return
      }
      // todo ...any
      const [res, err] = await httpGet<any>("/area/info", { name: cityName })
      if (err) {
        reject(err)
        return
      }
      console.log("currCity:====== ", res)
      setLoalCitys(res.data.body)
      resolve(res.data.body)
    }
    var myCity = new BMap.LocalCity()
    myCity.get(getCityIdByName)
  })
}

export { getCurrentCity }

// export default { getCurrentCity }
// var map = new BMap.Map("allmap");
// var point = new BMap.Point(116.331398,39.897445);
// map.centerAndZoom(point,12);
