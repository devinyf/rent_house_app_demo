import React from "react"

import styles from "./index.module.scss"
import { Flex } from "antd-mobile"

import { Link } from "react-router-dom"

import classnames from "classnames"

interface SearchBarProps {
  cityName: string
  className?: string
}

// type Iprops = SearchBarProps & React.HTMLAttributes<HTMLElement>

const SearchBar: React.FC<SearchBarProps> = ({ cityName, className }) => {
  const goCityListPage = () => {}
  return (
    <Flex className={classnames(styles.root, className)}>
      <Flex className={styles.searchLeft}>
        <Link to="/citylist">
          <span className={styles.location} onClick={goCityListPage}>
            {cityName}
          </span>
          <i className="iconfont icon-arrow"></i>
        </Link>
      </Flex>
      <Link to={"/bdmap"}>
        <i className="iconfont icon-map"></i>
      </Link>
    </Flex>
  )
}

export default SearchBar
