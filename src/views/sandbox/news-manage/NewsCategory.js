import React, { useEffect, useState, useRef, useContext } from 'react'
import { Table, Button, Modal, Form, Input } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const EditableContext = React.createContext(null)

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    })
  };

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          { required: true,  message: `${title} is required.`}
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>
}

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('categories').then(res => {
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
    setDataSource(dataSource.filter(item => item.id !== record.id))
    axios.delete(`/categories/${record.id}`)
  }

  const handleSave = (row) => {
    setDataSource(dataSource.map(item => {
      if(item.id === row.id) {
        return {
          id: item.id,
          title: row.title,
          value: row.title
        }
      }
      return item
    }))
    axios.patch(`/categories/${row.id}`, { title: row.title, value: row.title })
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
      title: '分类名称',
      dataIndex: 'title',
      width: '60%',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '分类名称',
        handleSave
      })
    },
    {
      title: '操作',
      render: (text, record, index) => {
        return (
          <Button 
            danger 
            shape="circle" 
            icon={<DeleteOutlined />}
            onClick={() => {confirm(record)}}
          />
        )
      }
    }
  ]

  return (
    <div>
      <Table
        rowKey='id'
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          }
        }}
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
      />
    </div>
  )
}

