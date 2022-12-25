import { useApolloClient } from "@apollo/client";
import { Button, DatePicker, Input, Spin, TimePicker } from "antd";
import { Formik } from "formik";
import produce from "immer";
import moment, { Moment } from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PrivateRoute } from "../../../../../../../../components/Route";
import Wrapper from "../../../../../../../../components/Wrapper";
import {
  GetChannelDocument,
  GetChannelQuery,
  GetTeamsDocument,
  GetTeamsQuery,
  useCreateEventMutation,
  useEditEventMutation,
  useGetEventQuery,
} from "../../../../../../../../graphql/generated";
import { normalizeErrors } from "../../../../../../../../ts/utils";

function EditEvent() {
  const router = useRouter();
  const teamId = router.query.teamId as string;
  const channelId = router.query.channelId as string;
  const eventId = router.query.eventId as string;
  const [editEvent] = useEditEventMutation();
  const { data, loading: eventLoading } = useGetEventQuery({
    variables: {
      id: eventId,
    },
  });
  const client = useApolloClient();

  const [date, setDate] = useState(moment());
  const [timing, setTiming] = useState<{ start: Moment; end: Moment }>({
    start: moment("00:00:00", "HH:mm:ss"),
    end: moment("00:00:00", "HH:mm:ss"),
  });

  useEffect(() => {
    if (data?.getEvent.event) {
      setDate(moment(data.getEvent.event.start));
      setTiming({
        start: moment(data.getEvent.event.start),
        end: moment(data.getEvent.event.end),
      });
    }
  }, [data]);

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
      <Wrapper layout="small">
        <h1>Edit Event</h1>
        <Formik
          initialValues={{
            title: data.getEvent.event?.title || "",
            resource: data.getEvent.event?.resource || "",
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
            const { data } = await editEvent({
              variables: {
                args: {
                  ...values,
                  start: start.toISOString(true),
                  end: end.toISOString(true),
                  id: eventId,
                },
              },
            });
            if (data?.editEvent.errors) {
              setErrors(normalizeErrors(data.editEvent.errors));
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
                        data?.editEvent.event!
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
                        data?.editEvent.event as any
                      );
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
                placeholder="Title"
                onChange={handleChange}
                name="title"
                style={{ borderColor: errors.title && "red" }}
                value={values.title}
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
                value={values.resource}
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
                  Save
                </Button>
                <Button
                  type="ghost"
                  style={{ marginLeft: "1rem" }}
                  onClick={router.back}
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

export default EditEvent;
