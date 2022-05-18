import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Card, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import * as echarts from 'echarts'
import axios from 'axios'
import _ from 'lodash'
const { Meta } = Card

export default function Home(props) {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [visible, setVisible] = useState(false)
  const [allList, setAllList] = useState([])
  const [pieChart, setPieChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    // 查询：根据vuew自动倒序，限制5条数据
    axios.get('/news?publishState=2&_sort=view&_order=desc&_limit=6&_expand=category').then(res => {
      setViewList(res.data)
    })
    axios.get('/news?publishState=2&_sort=star&_order=desc&_limit=6&_expand=category').then(res => {
      setStarList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      setAllList(res.data)
      renderBarView(_.groupBy(res.data, 'category.title'))
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = (obj) => {
    let myChart = echarts.init(barRef.current)
    // 指定图表的配置项和数据
    let option = {
      title: {
        text: '所有新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    window.onresize =  () => {
      myChart.resize()
    }
  }

  const renderPieView = (obj) => {
    // 数据处理
    const currentList = allList.filter(item => item.author === username)
    const groupObj = _.groupBy(currentList, 'category.title')
    const list = []
    for(let i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }

    let myChart
    if(!pieChart) {
      myChart = echarts.init(pieRef.current)
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }
    // 配置项
    let option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    myChart.setOption(option)
  }

  const renderItem = (item) => (
    <List.Item 
      style={{color: 'rgb(24, 144, 255)', cursor: 'pointer'}}
      onClick={() => props.history.push(`/news-manage/preview/${item.id}`)}
    >{item.title}</List.Item>
  )

  const showDrawer = () => {
    setVisible(true)
  }
  // useEffect执行的时候，dom元素已经更新了
  useEffect(() => {
    if(visible) {
      renderPieView()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览">
            <List
              size="small"
              dataSource={viewList}
              renderItem={renderItem}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="用户最多点赞">
            <List
              size="small"
              dataSource={starList}
              renderItem={renderItem}
            />
          </Card>
        </Col>

        <Col span={8}>
        <Card
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <SettingOutlined key="setting" onClick={showDrawer} />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={username}
            description={
              <div>
                <b style={{ marginRight: '30px' }}>{region ? region : '全球'}</b>
                {roleName}
              </div>
            }
          />
        </Card>
        </Col>
      </Row>

      <Drawer 
        title="个人新闻分类"
        placement="right"
        width="500px"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <div ref={pieRef} style={{width: '100%', height: '400px', marginTop: '30px'}}></div>
      </Drawer>
      <div ref={barRef} style={{width: '100%', height: '450px', marginTop: '30px'}}></div>
    </div>
  )
}
