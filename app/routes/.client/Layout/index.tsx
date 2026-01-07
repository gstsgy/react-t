import type { Route } from "./+types/index";
import { Outlet } from "react-router";
import { redirect } from "react-router";
import { userInfo } from "@/utils/userInfo";
import { useNavigate } from "react-router";
import { Layout, Button, theme, Tooltip, Dropdown, Space } from "antd";
import { http } from "@/utils/request";
import MyMenu from "@/components/menu";
import styles from "./index.module.less"; //
import {
  CodeSandboxOutlined,
  SyncOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
const { Header, Footer, Sider, Content } = Layout;
export function meta({}: Route.MetaArgs) {
  return [{ title: "dao" }, { name: "description", content: "Login" }];
}
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!userInfo.token) {
    return redirect("/login");
  }
  const data = {
    menu: null,
    user: null,
  };
  let res = await http.get("auth/menus?type=1");
  if (res.code === 200) {
    data.menu = res.data;
  }
  res = await http.get("user/self");
  if (res.code === 200) {
    userInfo.code = res.data.code;
    userInfo.nickName = res.data.nickName;
    userInfo.userId = res.data.id;
    data.user = res.data;
  }
  return data;
}

export default function MyLayout({ loaderData }: Route.ComponentProps) {
  let navigate = useNavigate();
  const {
    token: { headerBg, colorBgBase, colorBgContainer },
  } = theme.useToken();

  // function goto() {
  //   userInfo.token = "";
  //   navigate("/login");
  // }

  return (
    <Layout style={{ height: "100vh" }}>
      <Header className={styles.header}>
        {/* <Button type="primary" onClick={goto}>
        登出
      </Button> */}
        <MyHeader user={loaderData.user} />
      </Header>
      <Layout style={{ flex: 1 }}>
        <Sider
          style={{
            height: "100%",
            width: "240px",
            borderInlineEnd: 0,
            backgroundColor: colorBgContainer,
          }}
        >
          <MyMenu menus={loaderData.menu} />
        </Sider>
        <Content style={{ backgroundColor: colorBgBase }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

function MyHeader({ user }) {
  let navigate = useNavigate();
  const clearCache = () => {
    // 获取当前URL
    let currentUrl = new URL(window.location.href);

    // 添加或更新时间戳参数
    currentUrl.searchParams.set("t", new Date().getTime().toString());

    // 使用replace方法进行刷新并移除旧的历史记录
    window.location.replace(currentUrl.toString());
  };
  const logout: MenuProps["onClick"] = ({ key }) => {
    if (key === "2") {
      userInfo.token = "";
      navigate("/login");
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "欢迎您，" + user.nickName,
      icon: <UserOutlined />,
      key: "1",
    },
    {
      label: "退出登录",
      icon: <LogoutOutlined />,
      key: "2",
    },
  ];

  return (
    <>
      <div className={styles["header-left"]}>
        <CodeSandboxOutlined className={styles["header-left-logo"]} />
        <div className={styles["header-left-title"]}>万物生低代码平台</div>
      </div>

      <div className={styles["header-user-info"]}>
        <Tooltip title="清空缓存">
          <Button
            type="primary"
            shape="circle"
            onClick={clearCache}
            icon={<SyncOutlined />}
            className={styles["header-btn"]}
          />
        </Tooltip>
        <Dropdown menu={{ items, onClick: logout }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <UserOutlined className={styles["header-user-info-actions"]} />
            </Space>
          </a>
        </Dropdown>
      </div>
    </>
  );
}
