import { useApolloClient } from "@apollo/client";
import { Button, DatePicker, Input, TimePicker } from "antd";
import { Formik } from "formik";
import produce from "immer";
import moment, { Moment } from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { PrivateRoute } from "../../../../../../../components/Route";
import Wrapper from "../../../../../../../components/Wrapper";
import {
  GetChannelDocument,
  GetChannelQuery,
  GetTeamsDocument,
  GetTeamsQuery,
  useCreateEventMutation,
} from "../../../../../../../graphql/generated";
import { normalizeErrors } from "../../../../../../../ts/utils";

function CreateEvent() {
  const [createEvent] = useCreateEventMutation();
  const client = useApolloClient();
  const router = useRouter();
  const teamId = router.query.teamId as string;
  const channelId = router.query.channelId as string;

  const [date, setDate] = useState(moment());
  const [timing, setTiming] = useState<{ start: Moment; end: Moment }>({
    start: moment("00:00:00", "HH:mm:ss"),
    end: moment("00:00:00", "HH:mm:ss"),
  });

  return (
    <PrivateRoute>
      <Wrapper layout="small">
        <h1>Create Event</h1>
        <Formik
          initialValues={{
            title: "",
            resource: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const start = timing.start;
            start.set({
              year: date.year(),
              month: date.month(),
              date: date.date(),
            });
            const end = timing.end;
            end.set({
              year: date.year(),
              month: date.month(),
              date: date.date(),
            });
            const { data } = await createEvent({
              variables: {
                args: {
                  ...values,
                  start: start.toISOString(true),
                  end: end.toISOString(true),
                  channelId,
                },
              },
            });
            if (data?.createEvent.errors) {
              setErrors(normalizeErrors(data.createEvent.errors));
            } else {
              client.cache.updateQuery<GetTeamsQuery>(
                {
                  query: GetTeamsDocument,
                },
                (old) =>
                  produce(old, (draft) => {
                    if (draft?.getTeams.teams) {
                      const tidx = draft.getTeams.teams.findIndex(
                        (t) => t.id === teamId
                      );
                      const cidx = draft.getTeams.teams[
                        tidx
                      ].channels.findIndex((c) => c.id === channelId);
                      draft.getTeams.teams[tidx].channels[cidx].events.unshift(
                        data?.createEvent.event!
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
                (old) =>
                  produce(old, (draft) => {
                    if (draft?.getChannel.channel) {
                      draft.getChannel.channel.events.unshift(
                        data?.createEvent.event!
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
                placeholder="Title"
                onChange={handleChange}
                name="title"
                style={{ borderColor: errors.title && "red" }}
              />
              <div>
                <DatePicker onChange={(m) => m && setDate(m)} value={date} />
              </div>
              <TimePicker.RangePicker
                showSecond={false}
                onChange={(e) => {
                  if (e) {
                    e[0];
                    setTiming({
                      start: e[0] ? e[0] : timing.start,
                      end: e[1] ? e[1] : timing.end,
                    });
                  }
                }}
                value={[timing.start, timing.end]}
              />
              <Input
                placeholder="Resource"
                onChange={handleChange}
                name="resource"
                style={{ borderColor: errors.resource && "red" }}
              />
              {errors.resource && (
                <p style={{ color: "red" }}>{errors.resource}</p>
              )}
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

export default CreateEvent;
