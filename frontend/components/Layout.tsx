import { Spin } from "antd";
import Head from "next/head";
import { Fragment } from "react";
import { useMeQuery } from "../graphql/generated";
import Drawer from "./Drawer";

const Layout: React.FC = ({ children }) => {
  const { loading, data } = useMeQuery();
  return (
    <Fragment>
      <Head>
        <title>Macroteam</title>
      </Head>
      {loading ? (
        <Spin
          size="large"
          style={{ position: "absolute", left: "50%", top: "50%" }}
        />
      ) : (
        <>
          {data?.me.user && <Drawer user={data.me.user as any} />}
          {children}
        </>
      )}
    </Fragment>
  );
};

export default Layout;
