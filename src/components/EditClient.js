import React, { useState } from "react";
import Axios from "axios";
import moment from "moment";
import { Form, Input, Button, Select, DatePicker, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useForm } from "../hooks/useForm";

const API_URL = process.env.REACT_APP_API_URL;

export const EditClient = ({ info }) => {
  const [openComment, setOpenComment] = useState(false);
  const [date, setDate] = useState(info.date);
  const [schedule, setSchedule] = useState(info.schedule);
  const [experience, setExperience] = useState(info.experience);
  const [inputValues, handleChange] = useForm({
    name: info.name,
    comments: info.comments,
  });

  const { name, comments } = inputValues;

  const handleOpen = () => {
    return setOpenComment(true);
  };

  const handleClose = () => {
    return setOpenComment(false);
  };

  const countDown = () => {
    let secondsToGo = 3;
    const modal = Modal.success({
      title: `El cliente ${name} ha sido actualizado`,
      content: `La pagina se refrescara en ${secondsToGo} segundos.`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `La pagina se refrescara en ${secondsToGo} segundos.`,
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
      f.append("METHOD", "PUT");
      const resp = await Axios.post(API_URL, f, {
        params: { id: info.id },
      });
      const dataResp = await resp.data;
      console.log(dataResp);
      countDown();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      Modal.error({ title: error.message });
    }
  };

  const dateFormat = "DD/MM/YYYY";

  return (
    <>
      <Button onClick={handleOpen} type="primary">
        Editar
      </Button>
      {openComment && (
        <Modal
          visible={openComment}
          onOk={handleClose}
          onCancel={handleClose}
          footer={[
            <Button key="submit" type="primary" onClick={handleClose}>
              Ok
            </Button>,
          ]}
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            size="large"
            onSubmitCapture={onSubmit}
          >
            <Form.Item label="Nombre del Cliente">
              <Input name="name" value={name} onChange={handleChange} />
            </Form.Item>
            <Form.Item label="Fecha de Registro">
              <DatePicker
                defaultValue={moment(date)}
                format={dateFormat}
                onChange={setDate}
              />
            </Form.Item>
            <Form.Item label="Horario">
              <Select onChange={setSchedule} value={schedule}>
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
              <Select onChange={setExperience} value={experience}>
                <Select.Option value="SI">SI</Select.Option>
                <Select.Option value="NO">NO</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" onSubmit={onSubmit}>
                Editar
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};
