import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  ToolOutlined,
  UsergroupDeleteOutlined,
  KeyOutlined,
  FileSearchOutlined,
  FontColorsOutlined,
  CarOutlined,
  BranchesOutlined,
  PaperClipOutlined,
  MessageOutlined,
  UnorderedListOutlined,
  NodeCollapseOutlined,
  NodeExpandOutlined,
  UploadOutlined,
  PullRequestOutlined
} from '@ant-design/icons'

// 菜单映射图标
const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <TeamOutlined />,
  "/right-manage": <ToolOutlined />,
  "/right-manage/role/list": <UsergroupDeleteOutlined />,
  "/right-manage/right/list": <KeyOutlined />,
  "/news-manage": <FileSearchOutlined />,
  "/news-manage/add": <FontColorsOutlined />,
  "/news-manage/draft": <CarOutlined />,
  "/news-manage/category": <BranchesOutlined />,
  "/audit-manage": <PaperClipOutlined />,
  "/audit-manage/audit": <MessageOutlined />,
  "/audit-manage/list": <UnorderedListOutlined />,
  "/publish-manage": <NodeCollapseOutlined />,
  "/publish-manage/unpublished": <NodeExpandOutlined />,
  "/publish-manage/published": <UploadOutlined />,
  "/publish-manage/sunset": <PullRequestOutlined />
}

export default iconList