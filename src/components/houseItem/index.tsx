import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"
import classnames from "classnames"

import { BASE_URL } from "api/url"
import { houseInfoType } from "api/map"
import styles from "./index.module.scss"

type IProps = houseInfoType & RouteComponentProps

const HouseItem: React.FC<IProps> = ({
  houseCode,
  houseImg,
  title,
  tags,
  price,
  desc,
  history,
}) => {
  return (
    <div
      className={styles.house}
      onClick={() => history.push(`/detail/${houseCode}`)}
    >
      <div className={styles.imgWrap}>
        <img src={`${BASE_URL}${houseImg}`} alt="" />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}>{desc}</div>
      </div>
      <ul>
        {tags.map((ele, index) => {
          const tagName = `tag${(index % 3) + 1}`
          return (
            <li key={ele} className={classnames(styles.tag, styles[tagName])}>
              {ele}
            </li>
          )
        })}
      </ul>
      <div className={styles.price}>
        <span className={styles.priceNum}>{price}</span>
      </div>
    </div>
  )
}

export default withRouter(HouseItem)
