import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Space, Modal, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
import axios from 'axios'

export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [regions, setRegions] = useState([])
  const [roles, setRoles] = useState([])
  const [updateRecord, setUpdateRecord] = useState({})
  const [isDisabled, setIsDisabled] = useState(false)
  const addFormRef = useRef(null)
  const updateFormRef = useRef(null)

  useEffect(() => {
    getData()
    axios.get('http://localhost:5000/regions').then(res => {
      setRegions(res.data)
    })
    axios.get('http://localhost:5000/roles').then(res => {
      setRoles(res.data)
    })
  }, [])
  useEffect(() => {
    if (isUpdateVisible) {
      updateFormRef.current.setFieldsValue(updateRecord)
    }
  }, [isUpdateVisible, updateRecord])

  // 是否禁用
  const changeDisabledState = (type) => {
    setIsDisabled(type)
  }

  // 获取表格数据
  const getData = () => {
    axios.get('http://localhost:5000/users?_expand=role').then(res => {
      setDataSource(res.data)
    })
  }

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
    axios.delete(`http://localhost:5000/users/${record.id}`)
  }
  // Switch发生变化
  const changeSwitch = (record) => {
    record.roleState = !record.roleState
    setDataSource([...dataSource])
    axios.patch(`http://localhost:5000/users/${record.id}`, { roleState: record.roleState })
  }

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        { value: "全球", text: "全球" },
        ...regions.map(item => ({ value: item.value, text: item.title }))
      ],
      onFilter: (value, record) => {
        if(value === "全球") {
          return record.region === ""
        }
        return record.region === value
      },
      render: (text) => {
        return <b>{text ? text : '全球'}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return <span>{role.roleName}</span>
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (state, record) => {
        return <Switch checked={state} disabled={record.default} onChange={() => changeSwitch(record)} />
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
              disabled={record.default}
              onClick={() => {confirm(record)}}
            />
            <Button 
              type="primary" 
              shape="circle" 
              icon={<EditOutlined />}
              disabled={record.default}
              onClick={() => {
                setIsUpdateVisible(true)
                setUpdateRecord(record)
                if(record.roleId === 1) {
                  setIsDisabled(true)
                }else {
                  setIsDisabled(false)
                }
              }}
            /> 
          </Space>
        )
      }
    }
  ]

  // 添加用户确认
  const addUserFn = () => {
    addFormRef.current.validateFields().then(res => {
      const value = {
        ...res,
        roleState: true,
        default: false
      }
      axios.post('http://localhost:5000/users', value).then(res => {
        getData()
        setIsAddVisible(false)
      })
    }).catch(err => {
      console.log(err)
    })
  }
  // 更新用户信息
  const updateUserFn = () => {
    updateFormRef.current.validateFields().then(res => {
      axios.patch(`http://localhost:5000/users/${updateRecord.id}`, res).then(res => {
        getData()
        setIsUpdateVisible(false)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div>
      <Button type='primary' onClick={() => setIsAddVisible(true)}>添加用户</Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          addFormRef.current.resetFields()
          setIsAddVisible(false)
          setIsDisabled(false)
        }}
        onOk={() => { addUserFn() }}
      >
        <UserForm 
          isDisabled={isDisabled}
          changeDisabledState={changeDisabledState}
          ref={addFormRef} 
          regions={regions}
          roles={roles}
        />
      </Modal>
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => setIsUpdateVisible(false)}
        onOk={() => { updateUserFn() }}
      >
        <UserForm
          isDisabled={isDisabled}
          changeDisabledState={changeDisabledState}
          ref={updateFormRef} 
          regions={regions} 
          roles={roles} 
        />
      </Modal>
    </div>
  )
}
