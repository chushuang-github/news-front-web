import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Space, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      res.data.forEach(item => {
        if(item.children?.length === 0) {
          item.children = null
        }
      })
      setDataSource(res.data)
    })
  }, [])
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
    if(record.grade === 2) {
      axios.delete(`/children/${record.id}`).then(res => {
        let list = dataSource.filter(item => item.id === record.rightId)
        list[0].children = list[0].children.filter(item => item.id !== record.id)
        setDataSource([...dataSource])
      })
    }else {
      axios.delete(`/rights/${record.id}`).then(res => {
        setDataSource(dataSource.filter(item => item.id !== record.id))
      })
    }
  }
  // Switch发生变化
  const changeSwitch = (checked, record) => {
    record.pagepermisson = checked ? 1 : 0
    setDataSource([...dataSource])
    if(record.grade === 1) {
      axios.patch(`/rights/${record.id}`, { pagepermisson: checked ? 1 : 0 })
    }else {
      axios.patch(`/children/${record.id}`, { pagepermisson: checked ? 1 : 0 })
    }
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
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (text) => {
        return <Tag color="orange">{text}</Tag>
      }
    },
    {
      title: '操作',
      render: (text, record, index) => {
        return (
          <Space>
            <Button 
              danger 
              shape="circle" 
              icon={<DeleteOutlined />}
              onClick={() => {confirm(record)}}
            />
            <Popover 
              content={(
                <div style={{textAlign: "center"}}>
                  <Switch 
                    checked={record.pagepermisson === 1} 
                    onChange={(checked) => changeSwitch(checked, record)}
                  />
                </div>
              )} 
              title="页面配置项" 
              trigger={record.pagepermisson === undefined ? "" : "click"}
            >
              <Button 
                type="primary" 
                shape="circle" 
                icon={<EditOutlined />}
                disabled={record.pagepermisson === undefined}
              />
            </Popover>   
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
      />
    </div>
  )
}
