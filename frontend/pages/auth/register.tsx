import { useApolloClient } from "@apollo/client";
import { Button, Input } from "antd";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { PublicRoute } from "../../components/Route";
import Wrapper from "../../components/Wrapper";
import {
  MeDocument,
  MeQuery,
  useRegisterMutation,
} from "../../graphql/generated";
import { normalizeErrors } from "../../ts/utils";
import produce from "immer";

function Register() {
  const [register] = useRegisterMutation();
  const client = useApolloClient();
  const router = useRouter();
  return (
    <PublicRoute>
      <Wrapper layout="small">
        <h1>Register</h1>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await register({ variables: values });
            if (data?.register.errors)
              setErrors(normalizeErrors(data.register.errors));
            else {
              client.cache.updateQuery<MeQuery>(
                {
                  query: MeDocument,
                },
                (old) =>
                  produce(old, (draft) => {
                    if (draft?.me) {
                      draft.me.user = data?.register.user;
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
                placeholder="Name"
                onChange={handleChange}
                name="name"
                style={{ borderColor: errors.name && "red" }}
              />
              {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
              <Input
                placeholder="Email"
                onChange={handleChange}
                type="email"
                name="email"
                style={{ borderColor: errors.email && "red" }}
              />
              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
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
                register
              </Button>
            </form>
          )}
        </Formik>
      </Wrapper>
    </PublicRoute>
  );
}

export default Register;
