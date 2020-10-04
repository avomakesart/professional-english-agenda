import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Form, Input, Tooltip, Checkbox, Button, Modal, Result } from "antd";
import authService from "../../services/auth-service";

const USER_API = process.env.REACT_APP_API_USER_INFO;

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

export const EditProfile = ({ profile }) => {
  const [successful, setSuccessful] = useState(false);
  const [checked, setChecked] = useState(false);
  const [formInput, handleInputChange] = useForm({
    fullname: profile.fullname,
    username: profile.username,
    email: profile.email,
    password: profile.password,
    confirmPassword: "",
  });

  const { fullname, username, email, password, confirmPassword } = formInput;

  const currentUser = authService.getCurrentUser();

  const checkBox = () => {
    return setChecked(!checked);
  };

  console.log(currentUser.id);

  const onSubmit = async () => {
    try {
      const resp = await axios.put(USER_API + currentUser.id, {
        fullname,
        username,
        email,
        password,
      });
      const dataResp = await resp.data;
      setSuccessful(dataResp);
      Modal.success({ title: dataResp });
    } catch (error) {
      Modal.error({ title: error.message });
    }
  };

  return (
    <>
      {!successful && (
        <Form
          {...formItemLayout}
          name="register"
          className="register-form"
          onSubmitCapture={onSubmit}
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
            initialValue={fullname}
          >
            <Input
              autoComplete="off"
              type="text"
              name="fullname"
              value={fullname}
              id="fullname"
              onChange={handleInputChange}
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
            initialValue={username}
          >
            <Input
              type="text"
              name="username"
              autoComplete="off"
              value={username}
              onChange={handleInputChange}
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
            initialValue={email}
          >
            <Input
              type="email"
              name="email"
              autoComplete="off"
              value={email}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
            />
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
              <Button type="primary" htmlType="submit" onSubmit={onSubmit}>
                Editar Perfil
              </Button>
            ) : (
              <Button type="ghost" htmlType="button" disabled>
                Editar Perfil
              </Button>
            )}
          </Form.Item>
        </Form>
      )}
      {successful && (
        <Result
          status="success"
          title="El usuario se actualizo correctamente"
          subTitle="Selecciona una opcion en los botones de abajo."
          extra={[
            <Button type="primary" key="session">
              <Link to="/">Ir al inicio</Link>
            </Button>,
            <Button key="home">
              <Link to="/perfil">Ir a mi perfil</Link>
            </Button>,
          ]}
        />
      )}
    </>
  );
};
