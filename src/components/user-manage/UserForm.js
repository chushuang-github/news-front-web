import React from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select

export default React.forwardRef((props, ref) => {
  return (
    <Form
      ref={ref}
      layout="vertical"
      name="form_in_modal"
      initialValues={{ modifier: 'public' }}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          { required: true, message: '请输入用户名' }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          { required: true, message: '请输入密码' }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={props.isDisabled ? [] : [
          { required: true, message: '请选择区域' }
        ]}
      >
        <Select disabled={props.isDisabled}>
          {
            props.regions.map(item => {
              return <Option key={item.id} value={item.value}>{item.title}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          { required: true, message: '请选择角色' }
        ]}
      >
        <Select onChange={(value) => {
          if (value === 1) {
            ref.current.setFieldsValue({'region': ''})
            props.changeDisabledState(true)
          } else {
            props.changeDisabledState(false)
          }
        }}>
          {
            props.roles.map(item => {
              return <Option key={item.id} value={item.id}>{item.roleName}</Option>
            })
          }
        </Select>
      </Form.Item>
    </Form>
  )
})