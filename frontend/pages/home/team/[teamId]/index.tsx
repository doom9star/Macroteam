import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { PrivateRoute } from "../../../../components/Route";
import Wrapper from "../../../../components/Wrapper";
import { useGetTeamQuery, User } from "../../../../graphql/generated";
import { useMe } from "../../../../hooks/useMe";

function Info() {
  const router = useRouter();
  const teamId = router.query.teamId as string;
  const { data, loading } = useGetTeamQuery({ variables: { id: teamId } });
  const user = useMe();

  const date = useMemo(() => {
    if (data?.getTeam.team) {
      const date = new Date(data.getTeam.team.createdAt);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    return "";
  }, [data]);

  const members = useMemo(() => {
    if (data?.getTeam.team) {
      const users: User[] = [];
      data.getTeam.team.channels.forEach((c) => {
        c.members.forEach((m) => {
          if (
            !c.owners.includes(m.id) &&
            users.findIndex((u) => u.id === m.id) === -1
          )
            users.push(m as any);
        });
      });
      return users;
    }
    return [];
  }, [data]);

  const owners = useMemo(() => {
    if (data?.getTeam.team) {
      const users: User[] = [];
      data.getTeam.team.channels.forEach((c) => {
        c.owners.forEach((oid) => {
          if (users.findIndex((u) => u.id === oid) === -1)
            users.push(c.members.find((m) => m.id === oid) as any);
        });
      });
      return users;
    }
    return [];
  }, [data]);

  const isOwner = useMemo(() => {
    return owners.findIndex((o) => o.id === user?.id) !== -1;
  }, [owners, user]);

  if (loading)
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
      <Wrapper layout="medium" style={{ paddingTop: "1rem" }}>
        <ArrowLeftOutlined onClick={() => router.back()} />
        <h1>
          {data.getTeam.team?.name}{" "}
          {isOwner && (
            <Link href={`/home/team/${teamId}/edit`} passHref>
              <EditOutlined />
            </Link>
          )}
        </h1>
        <span style={{ opacity: "0.5" }}>{date}</span>
        <div style={{ margin: "2rem" }}>
          <h3>Channels</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {data.getTeam.team?.channels.map((c) => (
              <Link key={c.id} href={`/home/team/${teamId}/channel/${c.id}`}>
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
        </div>
        <div style={{ margin: "2rem", display: "flex" }}>
          <div style={{ width: "50%" }}>
            <h3>Members</h3>
            <div>
              {members.map((u) => (
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
            </div>
          </div>
          <div style={{ width: "50%" }}>
            <h3>Owners</h3>
            <div>
              {owners.map((u) => (
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
            </div>
          </div>
        </div>
      </Wrapper>
    </PrivateRoute>
  );
}

export default Info;
