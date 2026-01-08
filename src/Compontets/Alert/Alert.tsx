import type { ReactNode } from "react";
import styles from "./Alert.module.css"

export default function alert({children} : {children : ReactNode}) {
  return (
    <div className={styles.alert}>{children}</div>
  )
}
