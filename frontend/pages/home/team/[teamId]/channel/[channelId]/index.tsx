import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  CaretDownFilled,
  CaretUpFilled,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SlackOutlined,
} from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { Badge, Button, Card, Input, Modal, Spin } from "antd";
import produce from "immer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { PrivateRoute } from "../../../../../../components/Route";
import Wrapper from "../../../../../../components/Wrapper";
import {
  GetChannelDocument,
  GetChannelQuery,
  GetTeamsDocument,
  GetTeamsQuery,
  useCreateMessageMutation,
  useDeleteChannelMutation,
  useGetChannelQuery,
  useNewMessageSubscription,
} from "../../../../../../graphql/generated";
import { useMe } from "../../../../../../hooks/useMe";
import moment from "moment";
import { getDate, getTime } from "../../../../../../ts/utils";

function Channel() {
  const router = useRouter();
  const client = useApolloClient();
  const channelId = router.query.channelId as string;
  const teamId = router.query.teamId as string;
  const { data, loading: channelLoading } = useGetChannelQuery({
    variables: { id: channelId },
  });
  const { data: newMessageSub } = useNewMessageSubscription();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteChannel, { loading: deleteChannelLoading }] =
    useDeleteChannelMutation();
  const [createMessage, { loading: createMessageLoading }] =
    useCreateMessageMutation();
  const user = useMe();

  const [message, setMessage] = useState("");
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const unreadMessagesTimoutRef = useRef<NodeJS.Timeout | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [findQuery, setFindQuery] = useState("");
  const [findResults, setFindResults] = useState<string[]>([]);
  const findResultsRef = useRef<string[]>([]);
  const [findPoint, setFindPoint] = useState(0);

  const isOwner = useMemo(() => {
    return user?.id && data?.getChannel.channel?.owners.includes(user?.id);
  }, [user, data]);

  const sendMessage = () => {
    createMessage({ variables: { body: message, channelId } }).then(
      ({ data }) => {
        setMessage("");
        client.cache.updateQuery<GetChannelQuery>(
          { query: GetChannelDocument, variables: { id: channelId } },
          (old) =>
            produce(old, (draft) => {
              if (draft?.getChannel.channel) {
                draft.getChannel.channel.messages.unshift(
                  data?.createMessage.message!
                );
              }
            })
        );
      }
    );
  };

  useEffect(() => {
    findResultsRef.current = findResults;
    setFindPoint(findResults.length > 0 ? 1 : 0);
  }, [findResults]);

  useEffect(() => {
    if (newMessageSub?.newMessage) {
      client.cache.updateQuery<GetChannelQuery>(
        {
          query: GetChannelDocument,
          variables: { id: newMessageSub.newMessage.channelId },
        },
        (old) =>
          produce(old, (draft) => {
            if (draft?.getChannel.channel) {
              draft.getChannel.channel.messages.unshift(
                newMessageSub.newMessage.message
              );
              setUnreadMessages(unreadMessages + 1);
              if (unreadMessagesTimoutRef.current)
                clearTimeout(unreadMessagesTimoutRef.current);
              unreadMessagesTimoutRef.current = setTimeout(() => {
                setUnreadMessages(0);
              }, 1000 * 60);
            }
          })
      );
    }
  }, [newMessageSub]);

  useEffect(() => {
    messageContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [data]);

  useEffect(() => {
    const query = findQuery.trim().toLowerCase();
    if (query.length > 2) {
      const results: string[] = [];
      Array.from(document.getElementsByClassName("message")).forEach((m) => {
        if ((m as any).dataset.body.toLowerCase().includes(query))
          results.push(m.id);
      });
      setFindResults(results);
    } else setFindResults([]);
  }, [findQuery]);

  useEffect(() => {
    if (findResultsRef.current.length > 0) {
      document
        .getElementById(`${findResultsRef.current[findPoint - 1]}`)
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }
  }, [findPoint]);

  if (channelLoading)
    return (
      <Spin
        size="large"
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );

  if (!data) {
    router.back();
    return null;
  }

  return (
    <PrivateRoute>
      <Modal
        title="Channel Deletion"
        visible={showDeleteModal}
        confirmLoading={deleteChannelLoading}
        onOk={() => {
          deleteChannel({ variables: { id: channelId } }).then(() => {
            client.cache.updateQuery<GetTeamsQuery>(
              {
                query: GetTeamsDocument,
              },
              (data) =>
                produce(data, (draft) => {
                  if (draft?.getTeams.teams) {
                    const tidx = draft.getTeams.teams.findIndex(
                      (t) => t.id === teamId
                    );
                    draft.getTeams.teams[tidx].channels = draft.getTeams.teams[
                      tidx
                    ].channels.filter((c) => c.id !== channelId);
                  }
                })
            );
            setShowDeleteModal(false);
            router.replace("/home");
          });
        }}
        onCancel={() => setShowDeleteModal(false)}
      >
        <p>
          Are you sure that you want to delete channel "
          {data.getChannel.channel?.name}
          "?
        </p>
      </Modal>
      <Wrapper
        layout="large"
        style={{
          height: "96vh",
          padding: "1rem",
          display: "flex",
        }}
      >
        <div style={{ width: "20%", padding: "2rem" }}>
          <div
            style={{
              height: "300px",
              overflowY: "scroll",
            }}
          >
            <h3>Events</h3>
            <div>
              {data.getChannel.channel?.events.map((e) => {
                return (
                  <Link
                    href={`/home/team/${teamId}/channel/${channelId}/event/${e.id}`}
                    passHref
                  >
                    <Card title={e.title} style={{ cursor: "pointer" }}>
                      <p>{getDate(e.start)}</p>
                      <p>
                        {getTime(e.start)}-{getTime(e.end)}
                      </p>
                      <p style={{ textAlign: "right" }}>~ @{e.creator.name}</p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
          <div>
            <h3>Members</h3>
            <div>
              {data.getChannel.channel?.members.map((u) => (
                <Badge.Ribbon
                  key={`${u.id}-member`}
                  style={{
                    opacity: data.getChannel.channel?.owners.includes(u.id)
                      ? 1
                      : 0,
                  }}
                  color="yellow"
                  text="owner"
                >
                  <div key={u.id}>
                    <Image
                      src={"/noAvatar.jpg"}
                      alt="avatar"
                      width={40}
                      height={40}
                    />
                    <span>{u.id === user?.id ? "You" : u.name}</span>
                  </div>
                </Badge.Ribbon>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: "100%", width: "80%" }}>
          <div style={{ height: "30%" }}>
            <h1>{data.getChannel.channel?.team.name}</h1>
            <div style={{ display: "flex" }}>
              <span style={{ cursor: "pointer" }}>
                <ArrowLeftOutlined
                  style={{ marginRight: "1rem" }}
                  onClick={() => router.back()}
                />
                {isOwner && (
                  <>
                    <Link
                      href={`/home/team/${teamId}/channel/${channelId}/edit`}
                    >
                      <EditOutlined style={{ marginRight: "1rem" }} />
                    </Link>
                    <Link
                      href={`/home/team/${teamId}/channel/${channelId}/event/create`}
                    >
                      <SlackOutlined style={{ marginRight: "1rem" }} />
                    </Link>
                  </>
                )}
                {data.getChannel.channel?.name !== "General" && isOwner && (
                  <DeleteOutlined
                    style={{ color: "red" }}
                    onClick={() => setShowDeleteModal(true)}
                  />
                )}
              </span>
              <div
                style={{ width: "60%", display: "flex", alignItems: "center" }}
              >
                <Input
                  style={{ width: "80%" }}
                  placeholder="Search for messages..."
                  value={findQuery}
                  onChange={(e) => setFindQuery(e.target.value)}
                />
                {findResults.length > 0 && (
                  <Fragment>
                    <span>
                      ({findPoint}/{findResults.length})
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        disabled={findPoint === findResults.length}
                        onClick={() => {
                          if (findPoint < findResults.length)
                            setFindPoint(findPoint + 1);
                        }}
                      >
                        <CaretUpFilled />
                      </Button>
                      <Button
                        disabled={findPoint <= 1}
                        onClick={() => {
                          if (findPoint > 0) setFindPoint(findPoint - 1);
                        }}
                      >
                        <CaretDownFilled />
                      </Button>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
            <h3 style={{ marginTop: "1rem" }}>
              {data.getChannel.channel?.name}
            </h3>
          </div>
          <div
            style={{
              height: "65%",
              padding: "1rem",
              display: "flex",
              flexDirection: "column-reverse",
              overflowY: "scroll",
            }}
            className="no-scrollbar"
            ref={messageContainerRef}
          >
            {data.getChannel.channel?.messages.map((m, idx) => (
              <Fragment key={m.id}>
                <Card
                  data-body={m.body}
                  id={`${m.id}-message`}
                  className="message"
                >
                  <div>
                    <Image
                      src={"/noAvatar.jpg"}
                      alt="avatar"
                      width={40}
                      height={40}
                    />
                    <span>
                      {m.sender.name === user?.name ? "You" : m.sender.name}
                    </span>
                  </div>
                  <p>{m.body}</p>
                  <p style={{ opacity: "0.5" }}>{m.createdAt}</p>
                </Card>
                {idx === unreadMessages - 1 && (
                  <Card style={{ display: "flex", justifyContent: "center" }}>
                    <ArrowDownOutlined /> New Messages
                  </Card>
                )}
              </Fragment>
            ))}
          </div>
          <div style={{ height: "10%", display: "flex", alignItems: "center" }}>
            <Input
              placeholder="Enter a message!"
              style={{ marginRight: "1rem" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              type="primary"
              loading={createMessageLoading}
              disabled={createMessageLoading}
              onClick={sendMessage}
            >
              Send
            </Button>
          </div>
        </div>
      </Wrapper>
    </PrivateRoute>
  );
}

export default Channel;
