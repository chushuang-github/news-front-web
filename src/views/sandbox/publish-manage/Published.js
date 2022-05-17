import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { usePublish } from '../../../utils/hooks'
import { Button } from 'antd'

export default function Published(props) {
  const { dataSource, handleSunset } = usePublish(2)

  const button = record => (
    <Button danger onClick={() => handleSunset(record)}>下线</Button>
  )
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={button} />
    </div>
  )
}