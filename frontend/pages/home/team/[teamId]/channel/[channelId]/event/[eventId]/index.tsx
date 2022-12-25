import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Modal, Spin } from "antd";
import produce from "immer";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { PrivateRoute } from "../../../../../../../../components/Route";
import Wrapper from "../../../../../../../../components/Wrapper";
import { client } from "../../../../../../../../graphql";
import {
  GetChannelDocument,
  GetChannelQuery,
  GetTeamsDocument,
  GetTeamsQuery,
  useDeleteEventMutation,
  useGetEventQuery,
} from "../../../../../../../../graphql/generated";
import { useMe } from "../../../../../../../../hooks/useMe";
import { getDate, getTime } from "../../../../../../../../ts/utils";

function Event() {
  const router = useRouter();
  const teamId = router.query.teamId as string;
  const channelId = router.query.channelId as string;
  const eventId = router.query.eventId as string;
  const { data, loading: eventLoading } = useGetEventQuery({
    variables: { id: eventId },
  });
  const user = useMe();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEvent, { loading: deleteEventLoading }] =
    useDeleteEventMutation();

  const isCreator = useMemo(
    () => data?.getEvent.event?.creator.id === user?.id,
    [data, user]
  );

  if (eventLoading)
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
        title="Event Deletion"
        visible={showDeleteModal}
        confirmLoading={deleteEventLoading}
        onOk={() => {
          deleteEvent({ variables: { id: eventId } }).then(() => {
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
                    const cidx = draft.getTeams.teams[tidx].channels.findIndex(
                      (c) => c.id === channelId
                    );
                    draft.getTeams.teams[tidx].channels[cidx].events =
                      draft.getTeams.teams[tidx].channels[cidx].events.filter(
                        (e) => e.id !== eventId
                      );
                  }
                })
            );
            client.cache.updateQuery<GetChannelQuery>(
              {
                query: GetChannelDocument,
                variables: {
                  id: channelId,
                },
              },
              (data) =>
                produce(data, (draft) => {
                  if (draft?.getChannel.channel) {
                    draft.getChannel.channel.events =
                      draft.getChannel.channel.events.filter(
                        (e) => e.id !== eventId
                      );
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
          Are you sure that you want to delete event "
          {data.getEvent.event?.title}
          "?
        </p>
      </Modal>
      <Wrapper layout="medium" style={{ paddingTop: "1rem" }}>
        <h1>{data.getEvent.event?.title}</h1>
        <p style={{ textAlign: "right" }}>
          ~ @{data.getEvent.event?.creator.name}
        </p>
        <h3>On:</h3>
        <p style={{ paddingLeft: "1rem" }}>
          {getDate(data.getEvent.event?.start)}
        </p>
        <h3>Timings</h3>
        <p style={{ paddingLeft: "1rem" }}>
          {getTime(data.getEvent.event?.start)} {"<-->"}
          {getTime(data.getEvent.event?.end)}
        </p>
        <h3>Resource</h3>
        <p>{data.getEvent.event?.resource}</p>
        <p style={{ margin: "2rem 0rem", cursor: "pointer" }}>
          <ArrowLeftOutlined onClick={router.back} />
          &nbsp;&nbsp;
          {isCreator && (
            <>
              <EditOutlined
                onClick={() => router.push(`${router.asPath}/edit`)}
              />{" "}
              &nbsp;&nbsp;
              <DeleteOutlined onClick={() => setShowDeleteModal(true)} />
            </>
          )}
        </p>
      </Wrapper>
    </PrivateRoute>
  );
}

export default Event;
