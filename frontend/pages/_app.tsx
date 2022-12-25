import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import { client } from "../graphql";
import Layout from "../components/Layout";
import "antd/dist/antd.css";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />;
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
