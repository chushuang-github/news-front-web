import React, { useEffect } from 'react'
import axios from 'axios'
import styles from './App.module.scss'

export default function App() {
  useEffect(() => {
    axios({
      url: "/ajax/filterCinemas?ci=45&optimus_uuid=AAE63AF0C42211EC9556B19FB19558B1282865F2AB454B268F457AB208AE1180&optimus_risk_level=71&optimus_code=10",
      method: "GET"
    }).then(res => {
      console.log(res)
    })
  }, [])

  return (
    <div className={styles.title}>App</div>
  )
}
