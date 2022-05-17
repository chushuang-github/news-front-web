import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { usePublish } from '../../../utils/hooks'
import { Button } from 'antd'

export default function Sunset(props) {
  const { dataSource, handleDelete } = usePublish(3)

  const button = record => (
    <Button type="danger" onClick={() => handleDelete(record)}>删除</Button>
  )
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={button} />
    </div>
  )
}
