import React from "react"

import styles from "./index.module.scss"
import { Flex } from "antd-mobile"

import { Link } from "react-router-dom"

interface SearchBarProps {
  cityName: string
}

// type Iprops = SearchBarProps & React.HTMLAttributes<HTMLElement>

const SearchBar: React.FC<SearchBarProps> = ({ cityName }) => {
  return (
    <Flex className={styles.root}>
      <Flex className={styles.searchLeft}>
        <span className={styles.location}>{cityName}</span>
        <i className="iconfont icon-arrow"></i>
      </Flex>
      <Link to={"/bdmap"}>
        <i className="iconfont icon-map"></i>
      </Link>
    </Flex>
  )
}

export default SearchBar
