import { getCityByName, currentCityInfo } from "api/citys"

const BMap = window.BMap
const LOCAL_CITY = "local-city"

const getLocalCity = () => {
  const citys = window.localStorage.getItem(LOCAL_CITY)
  if (!citys) {
    return
  }
  const cityObj = JSON.parse(citys)
  return cityObj
}

const setLoalCity = (citys: currentCityInfo) => {
  window.localStorage.setItem(LOCAL_CITY, JSON.stringify(citys))
}

/**
 *  当前选择的城市
 */
const getCurrentCity = (): Promise<currentCityInfo> => {
  return new Promise((resolve, reject) => {
    async function getCityIdByName(result: any) {
      // 本地缓存数据
      const curCitysBody = getLocalCity()
      if (curCitysBody) {
        resolve(curCitysBody)
        return
      }

      // 通过ip获取定位的城市信息  result: 百度地图定位到的城市信息
      var cityName: string = result.name
      // Ip定位获取当前城市
      const { cityInfo, err } = await getCityByName(cityName)
      if (err) {
        reject(err)
        return
      }
      console.log("currCity:====== ", cityInfo)

      setLoalCity(cityInfo)
      resolve(cityInfo)
    }
    var myCity = new BMap.LocalCity()
    myCity.get(getCityIdByName)
  })
}

export { getCurrentCity, setLoalCity }

// var map = new BMap.Map("allmap");
// var point = new BMap.Point(116.331398,39.897445);
// map.centerAndZoom(point,12);
