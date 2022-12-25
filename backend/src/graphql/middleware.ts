import { MiddlewareFn } from "type-graphql";
import { TCtx, UserResponse } from "./types";
import jwt from "jsonwebtoken";

export const isAuth: MiddlewareFn<TCtx> = ({ context }, next) => {
  const token = context.req.cookies.token;
  if (!token)
    return new Promise<UserResponse>((res) =>
      res({ errors: [{ property: "token", message: "Token is missing!" }] })
    );
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    context.req.uid = (<any>payload).uid;
    return next();
  } catch {
    return new Promise<UserResponse>((res) =>
      res({
        errors: [{ property: "token", message: "Token corrupted/expired!" }],
      })
    );
  }
};

export const isNotAuth: MiddlewareFn<TCtx> = ({ context }, next) => {
  const token = context.req.cookies.token;
  if (token)
    return new Promise<UserResponse>((res) =>
      res({ errors: [{ property: "token", message: "Token is present!" }] })
    );
  return next();
};
