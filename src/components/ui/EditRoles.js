import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Select, Modal } from "antd";

const ROLE_API = process.env.REACT_APP_API_USER_ROLES;

export const EditRoles = ({ userId }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [id] = useState(userId);
  const [roleId, setRoleId] = useState([]);

  const handleOpen = () => {
    return setOpenMenu(true);
  };

  const handleClose = () => {
    return setOpenMenu(false);
  };

  const countDown = () => {
    let secondsToGo = 3;
    const modal = Modal.success({
      title: `El rol ha sido actualizado`,
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
      handleClose();
    }, secondsToGo * 1000);
  };

  const onSubmit = async () => {
    try {
      const resp = await axios.put(ROLE_API + `user_roles/${id}`, { roleId });
      const roles = await resp.data;
      countDown();
      setRoleId(roles);
    } catch (error) {
      Modal.error({ title: error.message });
    }
  };

  return (
    <>
      <Button onClick={handleOpen} type="primary">
        Editar
      </Button>
      {openMenu && (
        <Modal
          visible={openMenu}
          onOk={handleClose}
          onCancel={handleClose}
          title="Actualiza el rol de usuario"
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="vertical"
            size="large"
            onSubmitCapture={onSubmit}
          >
            <Form.Item>
              <Select onChange={setRoleId} value={roleId}>
                <Select.Option value={1}>Usuario</Select.Option>
                <Select.Option value={2}>Moderador</Select.Option>
                <Select.Option value={3}>Administrador</Select.Option>
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit" onSubmit={onSubmit}>
              Editar
            </Button>
          </Form>
        </Modal>
      )}
    </>
  );
};
