import { useEffect, useState } from 'react'
import axios from "axios";
import { notification } from 'antd'

// publishState：1未发布，2发布，3下线
export function usePublish(publishState) {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`news?publishState=${publishState}&author=${username}&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [publishState, username])

  // 发布
  const handlePublish = (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.patch(`/news/${record.id}`, { publishState: 2, publishTime: Date.now() }).then(res => {
      notification.info({
        message: '通知',
        description: '您可以去已发布中查看您的新闻',
        placement: 'topRight',
      })
    })
  }

  // 下线
  const handleSunset = (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.patch(`/news/${record.id}`, { publishState: 3 }).then(res => {
      notification.info({
        message: '通知',
        description: '您可以去已下线中查看您的新闻',
        placement: 'topRight',
      })
    })
  }

  // 删除
  const handleDelete = (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.delete(`/news/${record.id}`).then(res => {
      notification.info({
        message: '通知',
        description: '该新闻已经删除',
        placement: 'topRight',
      })
    })
  }

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete
  }
}