import React, { useState, useEffect } from "react"
import { AutoSizer, List, ListRowProps } from "react-virtualized"
import { Toast } from "antd-mobile"

import NavigationBar from "components/navBar"
import HouseItem from "components/houseItem"
import { houseInfoType } from "api/map"
import { apiGetUserHouses } from "api/user"

type HouseLists = houseInfoType[] | undefined

const Rent: React.FC = () => {
  const [houseList, setHouseList] = useState<HouseLists>(undefined)

  const getHousesData = async () => {
    const { myHouses, err } = await apiGetUserHouses()
    if (err) {
      Toast.fail("netWork err !")
      return
    }
    setHouseList(myHouses)
  }

  useEffect(() => {
    getHousesData()
  }, [])

  const rowRenderer = ({ key, index, style }: ListRowProps) => {
    if (houseList) {
      const ele = houseList[index]
      return (
        <div key={key} style={style}>
          <HouseItem key={ele.houseCode} {...ele} />
        </div>
      )
    }
  }

  return (
    <div style={{ height: "100%" }}>
      <NavigationBar title="我的房租列表" />
      {houseList && (
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height - 45}
              width={width}
              rowCount={houseList.length}
              rowHeight={120}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
      )}
    </div>
  )
}

export default Rent
