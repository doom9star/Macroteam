import { useApolloClient } from "@apollo/client";
import { MeDocument, MeQuery } from "../graphql/generated";

export const useMe = () => {
  const client = useApolloClient();
  const user = client.readQuery<MeQuery>({ query: MeDocument })?.me.user;
  return user;
};
