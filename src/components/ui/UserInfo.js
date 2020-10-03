import React, { useEffect, useState } from "react";
import authService from "../../services/auth-service";
import axios from "axios";
import { EditRoles } from "./EditRoles";
import { fetchData } from "../../helpers/fetchAdmin";
import { Table } from "antd";

const API_URL = process.env.REACT_APP_API_USER_INFO;

export const UserInfo = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [showAdminContent, setShowAdminContent] = useState(false);
  const [, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [, setRole] = useState([]);

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminContent(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  useEffect(() => {
    const allUserInfo = async () => {
      try {
        const resp = await axios.get(API_URL);
        const response = await resp.data;
        setAllUsers(response);
      } catch (error) {
        console.log(error.message);
        setLoading(loading);
      }
    };

    allUserInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getRoles = async () => {
      try {
        const resp = await fetchData("user_roles", {
          signal: signal,
        });
        const roles = await resp.json();
        setRole(roles);
      } catch (error) {
        console.log(error.message);
      }
    };

    getRoles();

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Nombre", dataIndex: "fullname", key: "fullname" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Usuario", dataIndex: "username", key: "username" },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const data = allUsers.map((user) => ({
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    username: user.username,
    actions: <EditRoles userId={user.id} />,
  }));

  return (
    <>{showAdminContent && <Table columns={columns} dataSource={data} />}</>
  );
};
