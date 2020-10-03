import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import authService from "../../../services/auth-service";

const { Header, Content, Footer } = Layout;

export default function LayoutContent({ children, bread, selected }) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showModContent, setShowModContent] = useState(false);
  const [showAdminContent, setShowAdminContent] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModContent(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminContent(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logOut = () => {
    authService.logout();
    history.push("/");
    window.location.reload();
  };
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[selected]}>
          {currentUser ? (
            <>
              <Menu.Item key="1">
                <Link to="/">
                  <HomeOutlined />
                  Inicio
                </Link>
              </Menu.Item>
              {showModContent || showAdminContent ? (
                <Menu.Item key="2">
                  <Link to="/agregar-cliente">Agregar Cliente</Link>
                </Menu.Item>
              ) : null}
              <Menu.Item key="3">
                <Link to="/perfil">Mi Perfil</Link>
              </Menu.Item>
              <Menu.Item key="4" onClick={logOut}>
                Cerrar Sesión
              </Menu.Item>
            </>
          ) : (
            <Menu.Item key="3">
              <Link to="/iniciar-sesion">Iniciar Sesión</Link>
            </Menu.Item>
          )}
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{bread}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Professional English ©{new Date().getFullYear()} Created by{" "}
        <a href="https://bluecatencode.com">Bluecatencode</a>
      </Footer>
    </Layout>
  );
}
