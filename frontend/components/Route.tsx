import { useRouter } from "next/router";
import { useMe } from "../hooks/useMe";

export const PrivateRoute: React.FC = ({ children }) => {
  const router = useRouter();
  const user = useMe();
  if (!user) {
    router.replace("/auth/login");
    return null;
  }
  return <>{children}</>;
};

export const PublicRoute: React.FC = ({ children }) => {
  const router = useRouter();
  const user = useMe();
  if (user) {
    router.replace("/home");
    return null;
  }
  return <>{children}</>;
};
