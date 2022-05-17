import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { usePublish } from '../../../utils/hooks'
import { Button } from 'antd'

export default function Unpublished(props) {
  const { dataSource, handlePublish } = usePublish(1)

  const button = record => (
    <Button type="primary" onClick={() => handlePublish(record)}>发布</Button>
  )
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={button} />
    </div>
  )
}