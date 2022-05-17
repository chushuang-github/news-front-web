import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, notification } from 'antd'
import { 
  DeleteOutlined, 
  EditOutlined, 
  ExclamationCircleOutlined, 
  VerticalAlignTopOutlined 
} from '@ant-design/icons'
import axios from 'axios'

export default function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username])

  // 删除确认
  const confirm = (record) => {
    Modal.confirm({
      title: '您确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(record)
      }
    })
  }
  const deleteMethod = (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.delete(`/news/${record.id}`)
  }
  // 提交审核
  const submitCheck = (record) => {
    axios.patch(`/news/${record.id}`, { auditState: 1 }).then(res => {
      notification.info({
        message: '通知',
        description: '您可以去审核列表中查看您的新闻',
        placement: 'topRight',
      })
      props.history.push('/audit-manage/list')
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text) => {
        return <b>{text}</b>
      }
    },
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
        return category.title
      }
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <Space size={15}>
            <Button 
              danger 
              shape="circle" 
              icon={<DeleteOutlined />}
              onClick={() => {confirm(record)}}
            />
            <Button 
              shape="circle" 
              icon={<EditOutlined />}
              onClick={() => props.history.push(`/news-manage/update/${record.id}`)}
            />
            <Button 
              type="primary" 
              shape="circle" 
              icon={<VerticalAlignTopOutlined />}
              onClick={() => submitCheck(record)}
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

