import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  InfoOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { Button, Input, Modal, Spin } from "antd";
import produce from "immer";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { PrivateRoute } from "../../components/Route";
import Wrapper from "../../components/Wrapper";
import {
  FEventFragment,
  GetTeamsDocument,
  GetTeamsQuery,
  SearchType,
  useDeleteTeamMutation,
  useGetTeamsQuery,
  useSearchLazyQuery,
} from "../../graphql/generated";
import styles from "../../styles/createTeam.module.css";

const localizer = momentLocalizer(moment);
const views = Object.values(Views);

function Home() {
  const client = useApolloClient();
  const { data: myTeams, loading: teamsLoading } = useGetTeamsQuery();
  const [search, { data: user_team_search }] = useSearchLazyQuery({
    fetchPolicy: "no-cache",
  });
  const [deleteTeam, { loading: deleteTeamLoading }] = useDeleteTeamMutation();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTeamID, setDeleteTeamID] = useState("");
  const [activeTeamMenuID, setActiveTeamMenuID] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeView, setActiveView] =
    useState<typeof Views[keyof typeof Views]>("month");
  const [activeEventID, setActiveEventID] = useState<string | null>(null);

  const events = useMemo(() => {
    let _: FEventFragment[] = [];
    myTeams?.getTeams.teams?.forEach((t) => {
      t.channels.forEach((c) => {
        c.events.forEach((e) => _.push(e));
      });
    });
    return _;
  }, [myTeams]);

  useEffect(() => {
    if (activeEventID) {
      const element = document.getElementById(`${activeEventID}-event`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        element.style.backgroundColor = "lightgreen";
        setTimeout(() => {
          setActiveEventID(null);
        }, 1000 * 10);
      }
    }
  }, [activeEventID]);

  if (teamsLoading)
    return (
      <Spin
        size="large"
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );

  return (
    <PrivateRoute>
      <Modal
        title="Team Deletion"
        visible={showDeleteModal}
        confirmLoading={deleteTeamLoading}
        onOk={() => {
          deleteTeam({ variables: { id: deleteTeamID } }).then(() => {
            client.cache.updateQuery<GetTeamsQuery>(
              {
                query: GetTeamsDocument,
              },
              (data) =>
                produce(data, (draft) => {
                  if (draft?.getTeams.teams) {
                    draft.getTeams.teams = draft.getTeams.teams.filter(
                      (t) => t.id !== deleteTeamID
                    );
                  }
                })
            );
            setShowDeleteModal(false);
          });
        }}
        onCancel={() => setShowDeleteModal(false)}
      >
        <p>
          Are you sure that you want to delete team "
          {deleteTeamID &&
            myTeams?.getTeams.teams?.find((t) => t.id === deleteTeamID)?.name}
          "?
        </p>
      </Modal>
      <Wrapper
        layout="medium"
        style={{ paddingTop: "1rem", display: "flex", flexDirection: "column" }}
      >
        <div>
          <Link href={"/home/team/create"} passHref>
            <Button style={{ alignSelf: "flex-start", marginRight: "1rem" }}>
              <PlusOutlined /> Create Team
            </Button>
          </Link>
          <Link href={"/"} passHref>
            <Button style={{ alignSelf: "flex-start" }}>Main</Button>
          </Link>
        </div>
        <Input
          placeholder="Search for teams & users..."
          style={{ marginTop: "1rem" }}
          value={query}
          onChange={(e) => {
            const _query = e.target.value;
            if (_query.trim().length > 1 && !loading) {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setLoading(true);
              timeoutRef.current = setTimeout(() => {
                search({
                  variables: {
                    options: { query: _query, type: SearchType.UserTeam },
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
            ) : user_team_search?.search.users &&
              user_team_search.search.teams &&
              (user_team_search.search.users.length > 0 ||
                user_team_search.search.teams.length > 0) ? (
              <>
                {user_team_search.search.teams.map((t) => (
                  <div key={t.id}>
                    <Image
                      src={"/noThumbnail.png"}
                      alt="thumbnail"
                      width={40}
                      height={40}
                    />
                    <span>{t.name}</span>
                  </div>
                ))}
                {user_team_search.search.users.map((u) => (
                  <div key={u.id}>
                    <Image
                      src={"/noAvatar.jpg"}
                      alt="avatar"
                      width={40}
                      height={40}
                    />
                    <span>{u.name}</span>
                  </div>
                ))}
              </>
            ) : (
              <span>Not found</span>
            )}
          </div>
        )}
        <div style={{ marginTop: "3rem" }}>
          <h2>Teams</h2>
          <div style={{ padding: "1rem 1rem" }}>
            {myTeams?.getTeams.teams &&
              myTeams.getTeams.teams.map((t) => {
                return (
                  <div key={t.id}>
                    <a
                      style={{
                        marginBottom: "1rem",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Link href={`/home/team/${t.id}`} passHref>
                          <a
                            style={{
                              color: "black",
                            }}
                          >
                            {t.name}
                          </a>
                        </Link>
                        <div style={{ position: "relative" }}>
                          <EllipsisOutlined
                            style={{ fontSize: "1.5rem" }}
                            onClick={() => {
                              setActiveTeamMenuID(
                                activeTeamMenuID === t.id ? null : t.id
                              );
                            }}
                          />
                          {activeTeamMenuID === t.id && (
                            <div
                              style={{
                                backgroundColor: "rgb(240, 240, 240)",
                                padding: "1rem",
                                position: "absolute",
                                top: 20,
                                width: "150px",
                                zIndex: 100,
                              }}
                              onClick={() => {
                                setActiveTeamMenuID(null);
                              }}
                            >
                              {t.isOwner && (
                                <>
                                  <Link
                                    href={`/home/team/${t.id}/channel/create`}
                                    passHref
                                  >
                                    <p>
                                      <PlusOutlined /> New Channel
                                    </p>
                                  </Link>
                                  <Link
                                    href={`/home/team/${t.id}/edit`}
                                    passHref
                                  >
                                    <p>
                                      <EditOutlined /> Edit Team
                                    </p>
                                  </Link>
                                  <p
                                    onClick={() => {
                                      setDeleteTeamID(t.id);
                                      setShowDeleteModal(true);
                                    }}
                                  >
                                    <DeleteOutlined /> Delete Team
                                  </p>
                                </>
                              )}
                              <Link href={`/home/team/${t.id}`} passHref>
                                <p>
                                  <InfoOutlined /> Info
                                </p>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {t.channels.map((c) => (
                          <Link
                            key={c.id}
                            href={`/home/team/${t.id}/channel/${c.id}`}
                          >
                            <a
                              style={{
                                cursor: "pointer",
                                paddingLeft: "1rem",
                                paddingBottom: "1rem",
                              }}
                            >
                              {c.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                    </a>
                  </div>
                );
              })}
          </div>
        </div>
        <div style={{ margin: "3rem 0rem" }}>
          <Calendar
            events={events}
            views={views}
            style={{ height: "600px" }}
            localizer={localizer}
            view={activeView}
            onView={(v) => setActiveView(v)}
            components={{
              event: ({ event }) => (
                <div
                  style={{
                    fontFamily: "cursive",
                    fontSize: "0.7rem",
                    padding: "0.5rem",
                  }}
                  id={`${event.id}-event`}
                  onClick={() => {
                    setActiveView("agenda");
                    setActiveEventID(event.id);
                  }}
                >
                  {event.title}
                </div>
              ),
            }}
          />
        </div>
      </Wrapper>
    </PrivateRoute>
  );
}

export default Home;
