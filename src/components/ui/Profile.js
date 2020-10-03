import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Tabs, Skeleton, Descriptions, DatePicker, Tag } from "antd";
import LayoutContent from "../shared/Layout/LayoutContent";
import authService from "../../services/auth-service";

import { EditProfile } from "./EditProfile";
import { UserInfo } from "./UserInfo";

const { TabPane } = Tabs;

const API_URL = process.env.REACT_APP_API_USER_INFO;

export const Profile = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [showAdminContent, setShowAdminContent] = useState(false);
  const [, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminContent(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  useEffect(() => {
    const userData = async () => {
      try {
        const resp = await axios.get(API_URL + currentUser.id);
        const dataResp = await resp.data;
        setUserInfo(dataResp);
        setLoading(true);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    userData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const contentList = userInfo.map((info) => (
    <Descriptions title="Mi Información" key={info.id} layout="vertical">
      {loading ? (
        <>
          <Descriptions.Item label="Nombre">
            <Tag>{info.fullname}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Usuario">
            <Tag color="blue">{info.username}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Tag color="geekblue">{info.email}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Registrado el">
            <DatePicker defaultValue={moment(info.createdAt)} disabled />
          </Descriptions.Item>
        </>
      ) : (
        <Skeleton loading={!loading} active />
      )}
    </Descriptions>
  ));

  return (
    <LayoutContent bread="Mi Perfil">
      {userInfo.map((user) => (
        <Tabs defaultActiveKey="1" type="card" key={user.id}>
          <TabPane tab="Mi perfil" key="1">
            {contentList}
          </TabPane>
          <TabPane tab="Editar perfil" key="2">
            <EditProfile profile={user} />
          </TabPane>

          {showAdminContent && (
            <TabPane tab="Editar rol de usuarios" key="3">
              <UserInfo />
            </TabPane>
          )}
        </Tabs>
      ))}
    </LayoutContent>
  );
};
