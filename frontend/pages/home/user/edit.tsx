import { Input, Button } from "antd";
import { Formik } from "formik";
import router from "next/router";
import { PrivateRoute } from "../../../components/Route";
import Wrapper from "../../../components/Wrapper";
import { client } from "../../../graphql";
import {
  MeQuery,
  MeDocument,
  useEditUserMutation,
} from "../../../graphql/generated";
import { normalizeErrors } from "../../../ts/utils";
import produce from "immer";
import { useMe } from "../../../hooks/useMe";

function Edit() {
  const [editUser] = useEditUserMutation();
  const user = useMe();
  return (
    <PrivateRoute>
      <Wrapper
        layout="medium"
        style={{
          paddingTop: "1rem",
        }}
      >
        <h1>Edit Profile</h1>
        <Formik
          initialValues={{ name: user?.name || "" }}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await editUser({ variables: { values } });
            if (data?.editUser.errors) {
              setErrors(normalizeErrors(data.editUser.errors));
            } else {
              client.cache.updateQuery<MeQuery>(
                {
                  query: MeDocument,
                },
                (old) =>
                  produce(old, (draft) => {
                    if (draft?.me.user) {
                      draft.me.user.name = values.name;
                    }
                  })
              );
              router.back();
            }
          }}
          validate={({ name }) => {
            const errors: any = {};
            if (name.length < 3) errors.name = "Length must be greater than 2";
            return errors;
          }}
        >
          {({ handleSubmit, handleChange, isSubmitting, errors, values }) => (
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="Name"
                onChange={handleChange}
                name="name"
                style={{ borderColor: errors.name && "red" }}
                value={values.name}
              />
              {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
              <div>
                <Button
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "1rem" }}
                >
                  Save
                </Button>
                <Button type="ghost" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Wrapper>
    </PrivateRoute>
  );
}

export default Edit;
