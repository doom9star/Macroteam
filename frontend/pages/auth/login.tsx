import { useApolloClient } from "@apollo/client";
import { Button, Input } from "antd";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { PublicRoute } from "../../components/Route";
import Wrapper from "../../components/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../../graphql/generated";
import { normalizeErrors } from "../../ts/utils";
import produce from "immer";

function Login() {
  const [login] = useLoginMutation();
  const client = useApolloClient();
  const router = useRouter();
  return (
    <PublicRoute>
      <Wrapper layout="small">
        <h1>Login</h1>
        <Formik
          initialValues={{ emailOrName: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await login({ variables: values });
            if (data?.login.errors) {
              setErrors(normalizeErrors(data.login.errors));
            } else {
              client.cache.updateQuery<MeQuery>(
                {
                  query: MeDocument,
                },
                (old) =>
                  produce(old, (draft) => {
                    if (draft?.me) {
                      draft.me.user = data?.login.user;
                    }
                  })
              );
              router.replace("/home");
            }
          }}
        >
          {({ handleSubmit, handleChange, isSubmitting, errors }) => (
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="Email/Name"
                onChange={handleChange}
                name="emailOrName"
                style={{ borderColor: errors.emailOrName && "red" }}
              />
              {errors.emailOrName && (
                <p style={{ color: "red" }}>{errors.emailOrName}</p>
              )}
              <Input
                placeholder="Password"
                onChange={handleChange}
                type="password"
                name="password"
                style={{ borderColor: errors.password && "red" }}
              />
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password}</p>
              )}
              <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                type="primary"
                htmlType="submit"
              >
                login
              </Button>
            </form>
          )}
        </Formik>
      </Wrapper>
    </PublicRoute>
  );
}

export default Login;
