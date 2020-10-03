import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Modal, Result, Skeleton } from "antd";
import { EditClient } from "./EditClient";
import moment from "moment";
import axios from "axios";
import LayoutContent from "./shared/Layout/LayoutContent";
import authService from "../services/auth-service";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Nombre del cliente",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Fecha de registro",
    dataIndex: "date",
    key: "date",
    align: "center",
    responsive: ["md"],
  },
  {
    title: "Horario",
    dataIndex: "schedule",
    key: "schedule",
    align: "center",
    responsive: ["lg"],
  },
  {
    title: "Comentarios",
    dataIndex: "comments",
    key: "comments",
    align: "center",
    responsive: ["lg"],
  },
  {
    title: "Sabe Ingles?",
    dataIndex: "experience",
    key: "experience",
    align: "center",
    responsive: ["lg"],
  },
  {
    title: "Acciones",
    dataIndex: "actions",
    key: "actions",
    align: "center",
    responsive: ["lg"],
  },
];

const API_URL = process.env.REACT_APP_API_URL;

export const Home = () => {
  const [data, setData] = useState([]);
  const [openComment, setOpenComment] = useState(false);
  const [, setCurrentUser] = useState(undefined);
  const [showModContent, setShowModContent] = useState(false);
  const [showAdminContent, setShowAdminContent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModContent(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminContent(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  useEffect(() => {
    const tableData = async () => {
      try {
        const resp = await axios.get(API_URL);
        const dataResp = await resp.data;

        setData(dataResp);
        setLoading(true);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    tableData();
  }, []);

  const handleOpen = () => {
    return setOpenComment(true);
  };

  const handleClose = () => {
    return setOpenComment(false);
  };

  const clientName = data.map((info) => info.name);

  const confirm = Modal.confirm;

  const destroy = Modal.destroyAll;

  const showConfirm = (id) => {
    confirm({
      title: `Estas seguro de borrar ${clientName}?`,
      content: "Ya no podras revertir los cambios,",
      okText: "Borrar",
      okType: "danger",
      onOk() {
        const f = new FormData();
        f.append("METHOD", "DELETE");
        axios
          .post(API_URL, f, {
            params: { id: id },
          })
          .then((response) => {
            const filtered = data.filter((p) => p.id !== id);
            setData(filtered);
            Modal.success({
              title: "Borrado",
              content: `El cliente ${clientName} ha sido borrado.`,
            });
          })
          .catch((error) => {
            Modal.error({
              title: "Algo sucedio",
              content: `El cliente ${clientName} no pudo ser borrado, razon: ${error.message}`,
            });
          });
      },
      onCancel() {
        return (
          Modal.info({
            title: `Cancelado`,
            content: `El ciente ${clientName} no fue borrado.`,
          }),
          setTimeout(() => {
            return destroy();
          }, 2000)
        );
      },
    });
  };

  const handleDelete = async (id) => {
    showConfirm(id);
  };

  const dataInfo = data.map((info) => ({
    key: info.id,
    name: (
      <p>
        <b>{info.name}</b>
      </p>
    ),
    date: moment(info.date).format("DD/MM/YYYY"),
    schedule: (
      <Tag color={info.schedule === "Matutino" ? "green" : "orange"}>
        {info.schedule}
      </Tag>
    ),
    comments: (
      <>
        <Button onClick={handleOpen}>Ver Comentario</Button>
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
            <p>{info.comments}</p>
          </Modal>
        )}
      </>
    ),
    experience: (
      <Tag color={info.experience === "SI" ? "blue" : "magenta"}>
        {info.experience}
      </Tag>
    ),
    actions: (
      <>
        <EditClient info={info} />
        <Button type="primary" onClick={() => handleDelete(info.id)} danger>
          Eliminar
        </Button>
      </>
    ),
  }));

  return (
    <LayoutContent selected="1">
      {showModContent || showAdminContent ? (
        loading ? (
          <Table columns={columns} dataSource={dataInfo} />
        ) : (
          <Skeleton loading={!loading} active />
        )
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
