import {
  EditOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { Button, Drawer as ADrawer } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useState } from "react";
import { useLogoutMutation, User } from "../graphql/generated";
import styles from "../styles/layout.module.css";

type Props = {
  user?: User | null;
};

const Drawer: FC<Props> = ({ user }) => {
  const client = useApolloClient();
  const [showDrawer, setShowDrawer] = useState(false);
  const [logout, { loading }] = useLogoutMutation();
  return (
    <Fragment>
      <MenuOutlined
        style={{
          margin: "1.5rem",
          fontSize: "1.5rem",
          float: "right",
        }}
        onClick={() => setShowDrawer(true)}
      />
      <ADrawer
        placement="right"
        size="default"
        onClose={() => setShowDrawer(false)}
        visible={showDrawer}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            src={"/noAvatar.jpg"}
            alt="avatar"
            width={100}
            height={100}
            className={styles.drawerAvatar}
          />
          <span style={{ fontWeight: "bold" }}>@{user?.name}</span>
          <span
            style={{ fontWeight: "bold", opacity: "0.5", marginBottom: "1rem" }}
          >
            @{user?.email}
          </span>
          <Link href={"/home/user/edit"}>
            <Button
              style={{ marginBottom: "0.5rem" }}
              onClick={() => setShowDrawer(false)}
            >
              <EditOutlined />
              Edit
            </Button>
          </Link>
          <Button
            loading={loading}
            style={{ marginBottom: "0.5rem" }}
            onClick={() =>
              logout().then(() => {
                client.clearStore().then(() => {
                  setShowDrawer(false);
                  window.location.href = "/";
                });
              })
            }
          >
            <LogoutOutlined /> Logout
          </Button>
          <Link href={"/home/user/settings"}>
            <Button loading={loading} onClick={() => setShowDrawer(false)}>
              <SettingOutlined /> Settings
            </Button>
          </Link>
        </div>
      </ADrawer>
    </Fragment>
  );
};

export default Drawer;
