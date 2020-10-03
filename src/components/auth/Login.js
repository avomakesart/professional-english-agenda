import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Input, Button, Modal, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useForm } from "../../hooks/useForm";
import authService from "../../services/auth-service";
import LayoutContent from "../shared/Layout/LayoutContent";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [, setMessage] = useState("");
  const [formLoginValues, handleLoginInputChange] = useForm({
    username: "",
    password: "",
  });

  const { username, password } = formLoginValues;

  const history = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    authService
      .login(username, password)
      .then(() => {
        history.push("/");
        window.location.reload();
      })
      .catch((error) => {
        const resMessage = error.response.data.message;
        setLoading(false);
        setMessage(resMessage);
        Modal.error({ title: `Algo salio mal 😔`, content: resMessage });
      });
  };

  return (
    <LayoutContent bread="Inciar Sesión" selected="3">
      {!loading ? (
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={handleLogin}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu usuario",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              name="username"
              value={username}
              onChange={handleLoginInputChange}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu contraseña!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleLoginInputChange}
            />
          </Form.Item>

          <Form.Item>
            {username && password !== "" ? (
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={handleLogin}
              >
                Log in
              </Button>
            ) : (
              <Button
                type="ghost"
                htmlType="button"
                className="login-form-button"
                disabled
              >
                Log in
              </Button>
            )}
            Or <Link to="/registrar">registrate!</Link>
          </Form.Item>
        </Form>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "9rem",
          }}
        >
          <Spin size="large" tip="Iniciando Sesión" />
        </div>
      )}
    </LayoutContent>
  );
};
