import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import EEvent from "../../entity/Event";
import User from "../../entity/User";
import { isAuth } from "../middleware";
import { CError, StatusResponse, TCtx } from "../types";

@ObjectType()
class EventResponse {
  @Field(() => EEvent, { nullable: true })
  event?: EEvent;

  @Field(() => [CError], { nullable: true })
  errors?: CError[];
}

@ObjectType()
class EventsResponse {
  @Field(() => [EEvent], { nullable: true })
  events?: EEvent[];

  @Field(() => [CError], { nullable: true })
  errors?: CError[];
}

@InputType()
class CreateEventInput {
  @Field()
  channelId: string;

  @Field()
  title: string;

  @Field()
  start: Date;

  @Field()
  end: Date;

  @Field()
  resource: string;
}

@InputType()
class EditEventInput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  start: Date;

  @Field()
  end: Date;

  @Field()
  resource: string;
}

@Resolver(EEvent)
export default class Event {
  @Mutation(() => EventResponse)
  @UseMiddleware(isAuth)
  async createEvent(
    @Arg("args") { channelId, title, start, end, resource }: CreateEventInput,
    @Ctx() { req }: TCtx
  ): Promise<EventResponse> {
    const creator = await User.findOne(req.uid);
    const event = await EEvent.create({
      title,
      start,
      end,
      resource,
      creator,
      channel: { id: channelId },
    }).save();
    return { event };
  }

  @Query(() => EventsResponse)
  @UseMiddleware(isAuth)
  async getEvents(
    @Arg("channelId") channelId: string
  ): Promise<EventsResponse> {
    const events = await EEvent.createQueryBuilder("e")
      .leftJoinAndSelect("e.channel", "ec")
      .leftJoinAndSelect("e.creator", "ecc")
      .where("ec.id = :id", { id: channelId })
      .orderBy("e.createdAt", "DESC")
      .getMany();
    return { events };
  }

  @Query(() => EventResponse)
  @UseMiddleware(isAuth)
  async getEvent(@Arg("id") id: string): Promise<EventResponse> {
    const event = await EEvent.findOne(id, { relations: ["creator"] });
    return { event };
  }

  @Mutation(() => StatusResponse)
  @UseMiddleware(isAuth)
  async deleteEvent(@Arg("id") id: string): Promise<StatusResponse> {
    await EEvent.delete(id);
    return { status: true };
  }

  @Mutation(() => EventResponse)
  @UseMiddleware(isAuth)
  async editEvent(
    @Arg("args") { id, ...values }: EditEventInput
  ): Promise<EventResponse> {
    let event = await EEvent.findOne(id, { relations: ["creator"] });
    event.title = values.title;
    event.start = values.start;
    event.end = values.end;
    event.resource = values.resource;
    event = await event.save();
    return { event };
  }
}
