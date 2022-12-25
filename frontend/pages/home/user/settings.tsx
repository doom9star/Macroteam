import { SettingOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import { PrivateRoute } from "../../../components/Route";
import Wrapper from "../../../components/Wrapper";
import { useDeleteUserMutation } from "../../../graphql/generated";

function Settings() {
  const [deleteUser, { loading: deleteUserLoading }] = useDeleteUserMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  return (
    <PrivateRoute>
      <Modal
        title="Channel Deletion"
        visible={showDeleteModal}
        confirmLoading={deleteUserLoading}
        onOk={() => {
          deleteUser().then(() => {
            setShowDeleteModal(false);
            window.location.href = "/";
          });
        }}
        onCancel={() => setShowDeleteModal(false)}
      >
        <p>Are you sure that you want to delete your account?</p>
      </Modal>
      <Wrapper layout="medium" style={{ paddingTop: "1rem" }}>
        <h1>
          <SettingOutlined /> Settings
        </h1>
        <h3>Delete your account permanently!</h3>
        <Button onClick={() => setShowDeleteModal(true)}>Delete</Button>
      </Wrapper>
    </PrivateRoute>
  );
}

export default Settings;
