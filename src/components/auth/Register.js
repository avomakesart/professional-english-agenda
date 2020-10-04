import React, { useState } from "react";
import { Link } from "react-router-dom";
import LayoutContent from "../shared/Layout/LayoutContent";
import { useForm } from "../../hooks/useForm";
import authService from "../../services/auth-service";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Tooltip,
  Row,
  Col,
  Checkbox,
  Button,
  Modal,
  Tag,
  Result,
} from "antd";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export const Register = () => {
  const [successful, setSuccessful] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [checked, setChecked] = useState(false);
  const [formLoginValues, handleRegisterInput] = useForm({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    fullname,
    username,
    email,
    password,
    confirmPassword,
  } = formLoginValues;

  const handleRegister = (e) => {
    e.preventDefault();
    setSuccessful(false);
    authService
      .register(fullname, username, email, password)
      .then((response) => {
        setSuccessful(true);
        Modal.success({ title: response.data.message });
        console.log(response.data.message);
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setSuccessful(false);
        Modal.error({
          title: "Algo salio mal, mensaje:",
          content: resMessage,
        });
      });
  };

  const createCatcha = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleCaptcha = () => {
    return setShowCaptcha(true);
  };

  const checkBox = () => {
    return setChecked(!checked);
  };

  return (
    <LayoutContent bread="Registrarse" selected="3">
      {!successful && (
        <Form
          {...formItemLayout}
          name="register"
          className="register-form"
          onSubmit={handleRegister}
          scrollToFirstError
        >
          <Form.Item
            name="fullname"
            label="Nombre Completo"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu nombre completo!",
              },
            ]}
          >
            <Input
              autoComplete="off"
              type="text"
              name="fullname"
              value={fullname}
              id="fullname"
              onChange={handleRegisterInput}
            />
          </Form.Item>

          <Form.Item
            name="username"
            label={
              <span>
                Usuario&nbsp;
                <Tooltip title="Este sera con el que inicies sesion">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Porfavor ingresa tu usuario!",
                whitespace: false,
              },
            ]}
          >
            <Input
              type="text"
              name="username"
              autoComplete="off"
              value={username}
              onChange={handleRegisterInput}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "El campo email no es valido!",
              },
              {
                required: true,
                message: "Por favor ingresa tu email!",
              },
            ]}
          >
            <Input
              type="email"
              name="email"
              autoComplete="off"
              value={email}
              onChange={handleRegisterInput}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu contraseña!",
                min: 6,
              },
            ]}
            help="Tiene que ser una contraseña de 6 caracteres."
            hasFeedback
          >
            <Input.Password
              type="password"
              name="password"
              value={password}
              onChange={handleRegisterInput}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Contraseña"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Por favor confirma tu contraseña!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    "Las dos contraseñas que ingresaste no coinciden!"
                  );
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleRegisterInput}
            />
          </Form.Item>

          <Form.Item
            label="Captcha"
            extra="Tenemos que asegurarnos que eres un humano."
          >
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="captcha"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Ingrese el captcha que obtuviste!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                {showCaptcha && (
                  <Tag style={{ margin: "1rem 0" }} color="blue">
                    {createCatcha(5)}
                  </Tag>
                )}
              </Col>
              <Col span={12}>
                <Button onClick={handleCaptcha}>Get captcha</Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        "Debes de aceptar los terminos y condiciones"
                      ),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox
              name="checked"
              value={checked}
              checked={false}
              onClick={checkBox}
            >
              He leido los{" "}
              <a href="https://professionalenglishgdl.com/terms-and-conditions">
                terminos y condiciones
              </a>
            </Checkbox>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {fullname.length > 0 &&
            username.length > 2 &&
            email.length > 0 &&
            password.length > 5 &&
            confirmPassword === password &&
            checked ? (
              <Button type="primary" htmlType="submit" onClick={handleRegister}>
                Registrar
              </Button>
            ) : (
              <Button type="ghost" htmlType="button" disabled>
                Registrar
              </Button>
            )}
          </Form.Item>
        </Form>
      )}
      {successful && (
        <Result
          status="success"
          title="El usuario se registro correctamente"
          subTitle="Selecciona una opcion en los botones de abajo."
          extra={[
            <Button type="primary" key="session">
              <Link to="/iniciar-sesion">Iniciar Sesión</Link>
            </Button>,
            <Button key="home">
              <Link to="/">Ir al Inicio</Link>
            </Button>,
          ]}
        />
      )}
    </LayoutContent>
  );
};
