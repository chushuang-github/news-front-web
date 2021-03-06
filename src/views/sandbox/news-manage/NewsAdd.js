import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import NewsEditor from '../../../components/new-message/NewsEditor'
import axios from 'axios'

const { Step } = Steps
const { Option } = Select

export default function NewsAdd(props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')
  const newsRef = useRef()

  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data)
    })
  }, [])

  // 上一步
  const prev = () => {
    setCurrentStep(currentStep - 1)
  }
  // 下一步
  const next = () => {
    if(currentStep === 0) {
      newsRef.current.validateFields().then(res => {
        setFormInfo(res)
        setCurrentStep(currentStep + 1)
      }).catch(() => {})
    }else {
      if(content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空")
      }else {
        setCurrentStep(currentStep + 1)
      }
    }
  }
  // 获取富文本编辑器内容
  const getContent = (value) => {
    setContent(value)
  }
  // 保存草稿箱和提交审核
  const { region, username, roleId } = JSON.parse(localStorage.getItem('token'))
  // auditState：0草稿箱；1待审核；2审核通过；3审核被驳回
  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      content,
      region: region ? region : '全球',
      author: username,
      roleId,
      auditState,
      publishState: 0,
      createTime: Date.now(),
      star: 0,
      view: 0,
      // publishTime: 0
    }).then(res => {
      notification.info({
        message: '通知',
        description:`您可以去${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: 'topRight',
      })
      props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
    })
  }

  return (
    <div>
      <PageHeader title="撰写新闻" />

      <Steps current={currentStep}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div style={{ marginTop: "40px" }}>
        <div className={currentStep === 0 ? '' : 'hidden'}>
          <Form
            name="basic"
            autoComplete="off"
            ref={newsRef}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '请输入新闻标题' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择新闻分类' }]}
            >
              <Select>
                {
                  categoryList.map(item => {
                    return <Option value={item.id} key={item.id}>{item.title}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className={currentStep === 1 ? '' : 'hidden'}>
          <NewsEditor getContent={getContent} />
        </div>

        <div className={currentStep === 2 ? '' : 'hidden'}>
          
        </div>
      </div>

      <div style={{position: "fixed", bottom: 50}}>
        <Button 
          style={{ display: currentStep > 0 ? '' : 'none' }}
          onClick={() => prev()}
        >上一步</Button>
        <Button
          type="primary"
          style={{ display: currentStep < 2 ? '' : 'none' }}
          onClick={() => next()}
        >下一步</Button>
        <Button
          danger
          style={{ display: currentStep === 2 ? '' : 'none' }}
          onClick={() => {handleSave(0)}}
        >保存草稿箱</Button>
        <Button
          danger
          style={{ display: currentStep === 2 ? '' : 'none' }}
          onClick={() => {handleSave(1)}}
        >提交审核</Button>
      </div>
    </div>
  )
}
