import { useApolloClient } from "@apollo/client";
import { Button, Input, Spin } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Field, Formik } from "formik";
import produce from "immer";
import { useRouter } from "next/router";
import { PrivateRoute } from "../../../../components/Route";
import Wrapper from "../../../../components/Wrapper";
import {
  GetTeamDocument,
  GetTeamQuery,
  GetTeamsDocument,
  GetTeamsQuery,
  TeamType,
  useEditTeamMutation,
  useGetTeamQuery,
} from "../../../../graphql/generated";
import { normalizeErrors } from "../../../../ts/utils";

function EditTeam() {
  const [editTeam] = useEditTeamMutation();
  const client = useApolloClient();
  const router = useRouter();
  const teamId = router.query.teamId as string;
  const { data: team, loading: teamLoading } = useGetTeamQuery({
    variables: { id: teamId },
  });

  if (teamLoading)
    return (
      <Spin
        size="large"
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );

  if (!team) {
    router.back();
    return null;
  }

  return (
    <PrivateRoute>
      <Wrapper layout="small">
        <h1>Edit Team</h1>
        <Formik
          initialValues={{
            name: team.getTeam.team?.name || "",
            description: team.getTeam.team?.description || "",
            type: team.getTeam.team?.type || TeamType.Public,
          }}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await editTeam({
              variables: { ...values, teamId },
            });
            if (data?.editTeam.errors) {
              setErrors(normalizeErrors(data.editTeam.errors));
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
                      draft.getTeams.teams[tidx].name = values.name;
                    }
                  })
              );
              client.cache.updateQuery<GetTeamQuery>(
                { query: GetTeamDocument, variables: { id: teamId } },
                (old) =>
                  produce(old, (draft) => {
                    if (draft?.getTeam.team) {
                      draft.getTeam.team.name = values.name;
                      draft.getTeam.team.description = values.description;
                      draft.getTeam.team.type = values.type;
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
              />
              {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
              <TextArea
                rows={4}
                placeholder="Description..."
                onChange={handleChange}
                name="description"
                value={values.description}
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
                      checked={values.type === TeamType.Public && "checked"}
                    />
                    Public
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="type"
                      value={TeamType.Private}
                      checked={values.type === TeamType.Private && "checked"}
                    />
                    Private
                  </label>
                </div>
              </div>
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

export default EditTeam;
