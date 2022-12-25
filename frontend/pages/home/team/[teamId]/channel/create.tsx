import { CloseOutlined } from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { Button, Input, Spin } from "antd";
import { Formik } from "formik";
import produce from "immer";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { PrivateRoute } from "../../../../../components/Route";
import Wrapper from "../../../../../components/Wrapper";
import {
  GetTeamsDocument,
  GetTeamsQuery,
  SearchType,
  useCreateChannelMutation,
  User,
  useSearchLazyQuery,
} from "../../../../../graphql/generated";
import styles from "../../../../../styles/createTeam.module.css";
import { normalizeErrors } from "../../../../../ts/utils";

function CreateChannel() {
  const [createChannel] = useCreateChannelMutation();
  const [search, { data }] = useSearchLazyQuery({
    fetchPolicy: "no-cache",
  });
  const client = useApolloClient();
  const router = useRouter();

  const teamId = router.query.teamId as string;

  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<Pick<User, "id" | "name">[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <PrivateRoute>
      <Wrapper layout="small">
        <h1>Create Channel</h1>
        <Formik
          initialValues={{
            name: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await createChannel({
              variables: {
                ...values,
                members: members.map((m) => m.id),
                teamId,
              },
            });
            if (data?.createChannel.errors) {
              setErrors(normalizeErrors(data.createChannel.errors));
            } else {
              client.cache.updateQuery<GetTeamsQuery>(
                {
                  query: GetTeamsDocument,
                },
                (old) =>
                  produce(old, (draft) => {
                    if (draft?.getTeams.teams) {
                      const teamIdx = draft.getTeams.teams.findIndex(
                        (t) => t.id === teamId
                      );

                      draft.getTeams.teams[teamIdx].channels.push(
                        data?.createChannel.channel as any
                      );
                    }
                  })
              );

              router.push("/home");
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
                  onClick={() => router.push("/home")}
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

export default CreateChannel;
