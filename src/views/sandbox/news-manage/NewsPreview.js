import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { PageHeader, Descriptions } from 'antd'
import axios from 'axios'
import moment from 'moment'

export default function NewsPreview() {
  const [newsInfo, setNewsInfo] = useState({})
  const history = useHistory()
  const params = useParams()

  useEffect(() => {
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
      setNewsInfo(res.data)
    })
  }, [params.id])

  // 审核状态
  const auditStateArr = [
    '未审核',
    '审核中',
    '已通过审核',
    '未通过审核'
  ]
  // 发布状态
  const publishStateArr = [
    '未发布',
    '待发布',
    '已上线',
    '已下线'
  ]

  return (
    <div>
      <PageHeader
        onBack={() => history.goBack()}
        title={newsInfo.title}
        subTitle={newsInfo.category?.title}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            { moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss') }
          </Descriptions.Item>
          <Descriptions.Item label="发布时间">
            { newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : '-' }
          </Descriptions.Item>
          <Descriptions.Item label="区域">
            {newsInfo.region}
          </Descriptions.Item>
          <Descriptions.Item label="审核状态">
            <span style={{color: 'red'}}>{auditStateArr[newsInfo.auditState]}</span>
          </Descriptions.Item>
          <Descriptions.Item label="发布状态">
            <span style={{color: 'red'}}>{publishStateArr[newsInfo.publishState]}</span>
          </Descriptions.Item>
          <Descriptions.Item label="访问数量">
            <span style={{color: 'blue'}}>{newsInfo.view}</span>
          </Descriptions.Item>
          <Descriptions.Item label="点赞数量">
            <span style={{color: 'blue'}}>{newsInfo.star}</span>
          </Descriptions.Item>
          <Descriptions.Item label="评论数量">
            <span style={{color: 'blue'}}>0</span>
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div 
        style={{ 
          border: '1px solid gray',
          margin: '0 10px',
          padding: '0 15px',
          height: '360px',
          overflow: 'auto'
        }} 
        dangerouslySetInnerHTML={{__html: newsInfo.content}}
      ></div>
    </div>
  )
}
