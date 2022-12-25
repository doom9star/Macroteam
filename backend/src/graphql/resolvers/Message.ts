import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  PubSub,
  PubSubEngine,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql";
import Channel from "../../entity/Channel";
import EMessage from "../../entity/Message";
import User from "../../entity/User";
import { NEW_MESSAGE } from "../constants";
import { isAuth } from "../middleware";
import { CError, TCtx } from "../types";

@ObjectType()
class MessageResponse {
  @Field(() => EMessage, { nullable: true })
  message?: EMessage;

  @Field(() => [CError], { nullable: true })
  errors?: CError[];
}

@ArgsType()
class CreateMessageArgs {
  @Field()
  body: string;

  @Field()
  channelId: string;
}

@ObjectType()
export class NEW_MESSAGE_PAYLOAD {
  @Field(() => EMessage)
  message: EMessage;

  @Field()
  channelId: string;

  @Field(() => [String])
  recievers: string[];
}

@Resolver(EMessage)
export default class Message {
  @Mutation(() => MessageResponse)
  @UseMiddleware(isAuth)
  async createMessage(
    @Args() { body, channelId }: CreateMessageArgs,
    @Ctx() { req }: TCtx,
    @PubSub() pubsub: PubSubEngine
  ): Promise<MessageResponse> {
    const sender = await User.findOne(req.uid);
    let message = new EMessage();
    message.body = body;
    message.sender = sender;
    message = await message.save();
    await Channel.createQueryBuilder()
      .relation("messages")
      .of(channelId)
      .add(message);
    const channel = await Channel.findOne(channelId, {
      relations: ["members"],
    });
    await pubsub.publish(NEW_MESSAGE, {
      message,
      channelId,
      recievers: channel.members
        .filter((m) => m.id !== sender.id)
        .map((m) => m.id),
    });
    return { message };
  }

  @Subscription(() => NEW_MESSAGE_PAYLOAD, {
    topics: NEW_MESSAGE,
    filter: ({ payload, context }) => payload.recievers.includes(context.uid),
  })
  newMessage(@Root() payload: NEW_MESSAGE_PAYLOAD): NEW_MESSAGE_PAYLOAD {
    return payload;
  }
}
