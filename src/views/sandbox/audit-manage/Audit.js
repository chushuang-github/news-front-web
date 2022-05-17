import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Space, Button, notification } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

export default function Audit(props) {
  const [dataSource, setDataSource] = useState([])

  // 超级管理员有审核所有数据的权限
  // 区域管理员审核自己和同一个区域下面的区域编辑数据
  let { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      console.log(list)
      const filterList = [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === (region ? region : '全球') && item.roleId === 3)
      ]
      setDataSource(roleId === 1 ? list : filterList)
    })
  }, [roleId, region, username])

  const handleAudit = (record, auditState, publishState) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.patch(`/news/${record.id}`, { auditState, publishState }).then(() => {
      notification.info({
        message: '通知',
        description: '审核完成，请去审核列表中查看',
        placement: 'topRight',
      })
    })
  }

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
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
        return (
          <Space>
            <Button 
              type="primary"
              shape="circle" 
              icon={<CheckOutlined />}
              onClick={() => handleAudit(record, 2, 1)}
            />
            <Button 
              type="danger" 
              shape="circle" 
              icon={<CloseOutlined />}
              onClick={() => handleAudit(record, 3, 0)}
            />
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
      />
    </div>
  )
}
