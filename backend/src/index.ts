import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import dotenv from "dotenv";
import Auth from "./graphql/resolvers/Auth";
import path from "path";
import { createConnection } from "typeorm";
import { TCtx } from "./graphql/types";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import cookie from "cookie";
import http from "http";
import jwt from "jsonwebtoken";
import User from "./graphql/resolvers/User";
import Team from "./graphql/resolvers/Team";
import Channel from "./graphql/resolvers/Channel";
import Misc from "./graphql/resolvers/Misc";
import Message from "./graphql/resolvers/Message";
import Event from "./graphql/resolvers/Event";

(async () => {
  dotenv.config({ path: path.join(__dirname, "../.env") });
  await createConnection();

  const app = express();
  const corsOptions: CorsOptions = {
    credentials: true,
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
  };
  app.use(cors(corsOptions));
  app.use(cookieParser());

  const schema = await buildSchema({
    resolvers: [Auth, User, Team, Channel, Misc, Message, Event],
  });

  const httpServer = http.createServer(app);

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (_: any, ws: any) => {
        const token = cookie.parse(ws.upgradeReq.headers.cookie).token;
        if (!token) return false;
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET) as {
            uid: string;
          };
          return payload;
        } catch {
          return false;
        }
      },
    },
    {
      server: httpServer,
      path: "/graphql",
    }
  );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): TCtx => ({ req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: corsOptions,
  });

  httpServer.listen(process.env.PORT, () => {
    console.log(`\nServer started at http://localhost:${process.env.PORT}`);
  });
})();
