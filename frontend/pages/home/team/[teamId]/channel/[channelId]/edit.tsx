import { CloseOutlined } from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { Button, Input, Spin } from "antd";
import { Formik } from "formik";
import produce from "immer";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { PrivateRoute } from "../../../../../../components/Route";
import Wrapper from "../../../../../../components/Wrapper";
import {
  GetChannelDocument,
  GetChannelQuery,
  GetTeamsDocument,
  GetTeamsQuery,
  SearchType,
  useEditChannelMutation,
  useGetChannelQuery,
  User,
  useSearchLazyQuery,
} from "../../../../../../graphql/generated";
import { useMe } from "../../../../../../hooks/useMe";
import styles from "../../../../../../styles/createTeam.module.css";
import { normalizeErrors } from "../../../../../../ts/utils";

function EditChannel() {
  const client = useApolloClient();
  const router = useRouter();

  const teamId = router.query.teamId as string;
  const channelId = router.query.channelId as string;

  const user = useMe();

  const [editChannel] = useEditChannelMutation();
  const [search, { data: search_results }] = useSearchLazyQuery({
    fetchPolicy: "no-cache",
  });
  const { data: channel, loading: channelLoading } = useGetChannelQuery({
    variables: { id: channelId },
  });
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<Pick<User, "id" | "name">[]>(
    channel?.getChannel.channel?.members.filter((m) => m.id !== user?.id) || []
  );
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (channelLoading)
    return (
      <Spin
        size="large"
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );

  if (!channel) {
    router.back();
    return null;
  }

  return (
    <PrivateRoute>
      <Wrapper layout="small">
        <h1>Edit Channel</h1>
        <Formik
          initialValues={{
            name: channel.getChannel.channel?.name || "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await editChannel({
              variables: {
                ...values,
                members: members.map((m) => m.id),
                channelId,
              },
            });
            if (data?.editChannel.errors) {
              setErrors(normalizeErrors(data.editChannel.errors));
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
                      const channelIdx = draft.getTeams.teams[
                        teamIdx
                      ].channels.findIndex((c) => c.id === channelId);
                      draft.getTeams.teams[teamIdx].channels[channelIdx] = data
                        ?.editChannel.channel as any;
                    }
                  })
              );
              client.cache.updateQuery<GetChannelQuery>(
                {
                  query: GetChannelDocument,
                  variables: { id: channelId },
                },
                (old) =>
                  produce(old, (draft) => {
                    if (draft?.getChannel.channel) {
                      draft.getChannel.channel = data?.editChannel
                        .channel as any;
                    }
                  })
              );

              router.back();
            }
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
                disabled={values.name === "General"}
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
                    ) : (search_results?.search.users?.length || 0) > 0 ? (
                      search_results?.search.users?.map((u) => (
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
                  Save
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

export default EditChannel;
