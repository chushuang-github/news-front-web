import React from 'react'
import { Table } from 'antd'
import { withRouter } from 'react-router-dom'

function NewsPublish(props) {
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      width: '30%',
      render: (title, record) => {
        return (
          <span 
            style={{color: 'rgb(24, 144, 255)', cursor: 'pointer'}}
            onClick={() => props.history.push(`/news-manage/preview/${record.id}`)}
          >{title}</span>
        )
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <span>{category.title}</span>
      }
    },
    {
      title: '操作',
      render: (text, record) => {
        return props.button(record)
      }
    }
  ]
  return (
    <div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={props.dataSource}
        pagination={{ pageSize: 5 }}
      />
    </div>
  )
}
export default withRouter(NewsPublish)