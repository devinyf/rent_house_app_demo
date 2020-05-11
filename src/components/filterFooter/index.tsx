import React from "react"
import { Flex } from "antd-mobile"
import classnames from "classnames"

import styles from "./index.module.scss"

type IProps = {
  cancelText?: string
  sureText?: string
  emitSubmit: () => void
  emitCancel: () => void
}

const FilterFooter: React.FC<IProps> = ({
  cancelText = "取消",
  sureText = "确定",
  emitSubmit,
  emitCancel,
}) => {
  return (
    <Flex className={styles.root} align="center">
      <Flex.Item
        className={classnames(styles.btn, styles.cancel)}
        onClick={emitCancel}
      >
        {cancelText}
      </Flex.Item>
      <Flex.Item
        className={classnames(styles.btn, styles.ok)}
        onClick={emitSubmit}
      >
        {sureText}
      </Flex.Item>
    </Flex>
  )
}

export default FilterFooter
