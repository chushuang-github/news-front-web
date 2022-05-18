import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { PageHeader, Descriptions, message } from 'antd'
import { HeartTwoTone } from '@ant-design/icons'
import axios from 'axios'
import moment from 'moment'

export default function Detail() {
  const [newsInfo, setNewsInfo] = useState({})
  const params = useParams()
  const history = useHistory()

  useEffect(() => {
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
      setNewsInfo({
        ...res.data,
        view: res.data.view + 1
      })
      return res.data
    }).then(res => {
      axios.patch(`/news/${params.id}`, { view: res.view + 1 })
    })
  }, [params.id])

  // 点赞
  const handleStar = () => {
    setNewsInfo({
      ...newsInfo,
      star: newsInfo.star + 1
    })
    axios.patch(`/news/${params.id}`, { star: newsInfo.star + 1 }).then(res => {
      message.success('点赞成功')
    })
  }

  return (
    <div>
      <PageHeader
        onBack={() => history.goBack()}
        title={newsInfo.title}
        subTitle={(
          <div>
            <span style={{ marginRight: '10px' }}>{newsInfo.category?.title}</span>
            <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar} />
          </div>
        )}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
          <Descriptions.Item label="发布时间">
            { newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : '-' }
          </Descriptions.Item>
          <Descriptions.Item label="区域">
            {newsInfo.region}
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
        style={{ padding: '0px 20px' }}
        dangerouslySetInnerHTML={{__html: newsInfo.content}}
      ></div>
    </div>
  )
}
