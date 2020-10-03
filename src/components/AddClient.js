import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Form, Input, Button, Select, DatePicker, Modal, Result } from "antd";
import LayoutContent from "./shared/Layout/LayoutContent";
import { useForm } from "../hooks/useForm";
import authService from "../services/auth-service";
import { Link } from "react-router-dom";

const { TextArea } = Input;

const API_URL = process.env.REACT_APP_API_URL;

export const AddClient = () => {
  const [, setCurrentUser] = useState(undefined);
  const [showModContent, setShowModContent] = useState(false);
  const [showAdminContent, setShowAdminContent] = useState(false);
  const [date, setDate] = useState(moment());
  const [schedule, setSchedule] = useState("");
  const [experience, setExperience] = useState("");
  const [inputValues, handleChange] = useForm({
    name: "",
    comments: "",
  });

  const { name, comments } = inputValues;

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModContent(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminContent(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const validateMessages = {
    required: "is required!",
    types: {
      email: "is not validate email!",
      number: "is not a validate number!",
    },
    number: {
      range: "$must be between 2 and 6",
    },
  };

  const countDown = () => {
    let secondsToGo = 3;
    const modal = Modal.success({
      title: `El cliente ${name} se ah agregado`,
      content: `Se te redigira al inicio en ${secondsToGo} segundos.`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `Se te redigira al inicio en ${secondsToGo} segundos.`,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000);
  };

  const onSubmit = async () => {
    try {
      const f = new FormData();
      f.append("name", name);
      f.append("date", date);
      f.append("schedule", schedule);
      f.append("comments", comments);
      f.append("experience", experience);
      f.append("METHOD", "POST");
      const resp = await axios.post(API_URL, f);
      const dataResp = await resp.data;
      console.log(dataResp);
      countDown();
      setTimeout(() => {
        window.location.replace("/");
      }, 3000);
    } catch (error) {
      Modal.error({ title: error.message })
    }
  };

  return (
    <LayoutContent bread="Agregar Cliente" selected="2">
      {showModContent || showAdminContent ? (
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          size="large"
          onSubmitCapture={onSubmit}
          validateMessages={validateMessages}
        >
          <Form.Item label="Nombre del Cliente">
            <Input
              name={["name"]}
              value={name}
              onChange={handleChange}
              rules={[
                {
                  required: true,
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Fecha de Registro">
            <DatePicker value={date} onChange={setDate} />
          </Form.Item>
          <Form.Item label="Horario">
            <Select onChange={setSchedule}>
              <Select.Option value="Matutino">Matutino</Select.Option>
              <Select.Option value="Vespertino">Vespertino</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Comentario">
            <TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              onChange={handleChange}
              value={comments}
              name="comments"
            />
          </Form.Item>
          <Form.Item label="Sabe Ingles">
            <Select onChange={setExperience}>
              <Select.Option value="SI">SI</Select.Option>
              <Select.Option value="NO">NO</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button
              type="primary"
              htmlType="submit"
              onSubmit={onSubmit}
              disabled={
                (name < 1, date < 1, schedule < 1, comments < 1, experience < 1)
                  ? true
                  : false
              }
            >
              Agregar
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Result
          status="403"
          title="403"
          subTitle="Lo sentimos, no estas autorizado para ver esta página."
          extra={
            <Button type="primary">
              <Link to="/perfil">Mi Perfil</Link>
            </Button>
          }
        />
      )}
    </LayoutContent>
  );
};
