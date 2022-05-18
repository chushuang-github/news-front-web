import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageHeader, Row, Col, Card, List } from 'antd'
import _ from 'lodash'

export default function News(props) {
  const [list, setList] = useState([])

  useEffect(() => {
    axios.get('/news?_expand=category&publishState=2').then(res => {
      setList(Object.entries(_.groupBy(res.data, 'category.title')))
    })
  }, [])

  const renderItem = (item) => (
    <List.Item 
      style={{color: 'rgb(24, 144, 255)', cursor: 'pointer'}}
      onClick={() => props.history.push(`/detail/${item.id}`)}
    >{item.title}</List.Item>
  )

  return (
    <div style={{ width: '95%', margin: '0 auto' }}>
      <PageHeader
        onBack={() => props.history.goBack()}
        title="全球大新闻"
        subTitle="查看新闻"
      />

      <Row gutter={[16, 16]}>
        {
          list.map(item => (
            <Col span={8} key={item}>
              <Card title={item[0]} hoverable={true}>
                <List
                  size="small"
                  pagination={{
                    pageSize: 2
                  }}
                  dataSource={item[1]}
                  renderItem={renderItem}
                />
              </Card>
            </Col>
          ))
        }
      </Row>
    </div>
  )
}
