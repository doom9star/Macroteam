import type { NextPage } from "next";
import Link from "next/link";
import Wrapper from "../components/Wrapper";
import { useMe } from "../hooks/useMe";

const Landing: NextPage = () => {
  const user = useMe();
  return (
    <Wrapper layout="large">
      {user ? (
        <Link href={"/home"}>
          <a>Home</a>
        </Link>
      ) : (
        <>
          <Link href={"/auth/login"}>
            <a style={{ marginRight: "1rem" }}>Login</a>
          </Link>
          <Link href={"/auth/register"}>
            <a>Register</a>
          </Link>
        </>
      )}
    </Wrapper>
  );
};

export default Landing;
