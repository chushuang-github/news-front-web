import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [treeData, setTreeData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
  useEffect(() => {
    axios.get('/roles').then(res => {
      setDataSource(res.data)
    })
    axios.get('/rights?_embed=children').then(res => {
      setTreeData(res.data)
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
  // 删除
  const deleteMethod = (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.delete(`/roles/${record.id}`)
  }

  // 弹窗确认
  const handleOk = () => {
    setIsModalVisible(false)
    setDataSource(dataSource.map(item => {
      if(item.id === currentId) {
        item.rights = currentRights
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`, { rights: currentRights })
  }
  // 弹窗取消
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  // 树形框选择
  const onCheck = (keys, checked) => {
    setCurrentRights(checked.checkedNodes.map(item => item.key))
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
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <Space>
            <Button 
              danger 
              shape="circle" 
              icon={<DeleteOutlined />}
              onClick={() => {confirm(record)}}
            />
            <Button 
              type="primary" 
              shape="circle" 
              icon={<UnorderedListOutlined />}
              onClick={() => {
                setCurrentId(record.id)
                setCurrentRights(record.rights)
                setIsModalVisible(true)
              }}
            />
          </Space>
        )
      }
    },
  ]

  return (
    <div>
      <Table rowKey="id" dataSource={dataSource} columns={columns} />
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRights}
          treeData={treeData}
          onCheck={onCheck}
        />
      </Modal>
    </div>
  )
}
