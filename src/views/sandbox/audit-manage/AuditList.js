import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, Tag, notification } from 'antd'

export default function AuditList(props) {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    // _ne是不等于；_lte是小于等于(json-server服务器独有的语法)
    axios.get(`news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username])

  // 发布
  const publish = (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.patch(`/news/${record.id}`, { publishState: 2 }).then(res => {
      notification.info({
        message: '通知',
        description: '您可以去发布管理/已发布中查看您的新闻',
        placement: 'topRight',
      })
    })
  }

  // 撤销
  const cancel = (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.patch(`/news/${record.id}`, { auditState: 0 }).then(res => {
      notification.info({
        message: '通知',
        description: '您可以去草稿箱中查看您的新闻',
        placement: 'topRight',
      })
    })
  }

  // 更新
  const update = (record) => {
    props.history.push(`/news-manage/update/${record.id}`)
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['', 'orange', 'green', 'red']
        const stateList = ['', '审核中', '已通过', '未通过']
        return (
          <Tag color={colorList[auditState]}>{stateList[auditState]}</Tag>
        )
      }
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <>
            { record.auditState === 1 && <Button danger onClick={() => cancel(record)}>撤销</Button> }
            { record.auditState === 2 && <Button type="primary" ghost onClick={() => publish(record)}>发布</Button> }
            { record.auditState === 3 && <Button type="primary" onClick={() => update(record)}>更新</Button> }
          </>
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
