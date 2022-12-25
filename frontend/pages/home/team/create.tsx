import { CloseOutlined } from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { Button, Input, Spin } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Field, Formik } from "formik";
import produce from "immer";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { PrivateRoute } from "../../../components/Route";
import Wrapper from "../../../components/Wrapper";
import {
  GetTeamsDocument,
  GetTeamsQuery,
  SearchType,
  TeamType,
  useCreateTeamMutation,
  User,
  useSearchLazyQuery,
} from "../../../graphql/generated";
import styles from "../../../styles/createTeam.module.css";
import { normalizeErrors } from "../../../ts/utils";

function CreateTeam() {
  const [createTeam] = useCreateTeamMutation();
  const [search, { data }] = useSearchLazyQuery({
    fetchPolicy: "no-cache",
  });
  const client = useApolloClient();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<Pick<User, "id" | "name">[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <PrivateRoute>
      <Wrapper layout="small">
        <h1>Create Team</h1>
        <Formik
          initialValues={{
            name: "",
            description: "",
            type: TeamType.Public,
          }}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await createTeam({
              variables: { ...values, members: members.map((m) => m.id) },
            });
            if (data?.createTeam.errors) {
              setErrors(normalizeErrors(data.createTeam.errors));
            } else {
              client.cache.updateQuery<GetTeamsQuery>(
                {
                  query: GetTeamsDocument,
                },
                (old) =>
                  produce(old, (draft) => {
                    if (draft?.getTeams.teams) {
                      draft.getTeams.teams.unshift(
                        data?.createTeam.team as any
                      );
                    }
                  })
              );
              router.back();
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
              <TextArea
                rows={4}
                placeholder="Description..."
                onChange={handleChange}
                name="description"
              />
              <div>
                <p>Type</p>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <label>
                    <Field
                      type="radio"
                      name="type"
                      value={TeamType.Public}
                      checked="checked"
                    />
                    Public
                  </label>
                  <label>
                    <Field type="radio" name="type" value={TeamType.Private} />
                    Private
                  </label>
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <Input
                  placeholder="Search for users..."
                  value={query}
                  onChange={(e) => {
                    const _query = e.target.value;
                    if (_query.trim().length > 1 && !loading) {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      setLoading(true);
                      timeoutRef.current = setTimeout(() => {
                        search({
                          variables: {
                            options: { query: _query, type: SearchType.User },
                          },
                        }).then(() => setLoading(false));
                      }, 2000);
                    }
                    setQuery(_query);
                  }}
                />
                {query.trim().length > 1 && (
                  <div className={styles.search_container}>
                    {loading ? (
                      <p style={{ textAlign: "center" }}>
                        <Spin size="small" />
                      </p>
                    ) : (data?.search.users?.length || 0) > 0 ? (
                      data?.search.users?.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            if (!members.find((m) => m.id === u.id))
                              setMembers(members.concat(u));
                            setQuery("");
                          }}
                        >
                          <Image
                            src={"/noAvatar.jpg"}
                            alt="avatar"
                            width={40}
                            height={40}
                          />
                          <span>{u.name}</span>
                        </div>
                      ))
                    ) : (
                      <span>Not found</span>
                    )}
                  </div>
                )}
              </div>
              {members.map((m) => (
                <div key={`${m.id}-member`}>
                  <Image
                    src={"/noAvatar.jpg"}
                    alt="avatar"
                    width={40}
                    height={40}
                  />
                  <span>{m.name}</span>
                  <CloseOutlined
                    style={{ margin: "1rem", cursor: "pointer" }}
                    onClick={() => {
                      setMembers(members.filter((_) => _.id !== m.id));
                    }}
                  />
                </div>
              ))}
              <div style={{ marginTop: "1rem" }}>
                <Button
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  type="primary"
                  htmlType="submit"
                >
                  Create
                </Button>
                <Button
                  type="ghost"
                  style={{ marginLeft: "1rem" }}
                  onClick={() => router.back()}
                >
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

export default CreateTeam;
