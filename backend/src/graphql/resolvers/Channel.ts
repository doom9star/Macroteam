import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import EChannel from "../../entity/Channel";
import Team from "../../entity/Team";
import User from "../../entity/User";
import { isAuth } from "../middleware";
import { CError, TCtx } from "../types";

@ObjectType()
class ChannelResponse {
  @Field(() => EChannel, { nullable: true })
  channel?: EChannel;

  @Field(() => [CError], { nullable: true })
  errors?: CError[];
}

@ArgsType()
class CreateChannelArgs {
  @Field()
  name: string;

  @Field(() => [String])
  members: string[];

  @Field()
  teamId: string;
}

@ArgsType()
class EditChannelArgs {
  @Field()
  name: string;

  @Field(() => [String])
  members: string[];

  @Field()
  channelId: string;
}

@Resolver(EChannel)
export default class Channel {
  @Mutation(() => ChannelResponse)
  @UseMiddleware(isAuth)
  async createChannel(
    @Args() { teamId, name, members }: CreateChannelArgs,
    @Ctx() { req }: TCtx
  ) {
    const creator = await User.findOne(req.uid);

    let channel = new EChannel();
    channel.name = name;
    channel.owners = [creator.id];
    channel.members = [creator].concat(await User.findByIds(members));
    channel = await channel.save();

    await Team.createQueryBuilder()
      .relation("channels")
      .of(teamId)
      .add(channel);

    return { channel };
  }

  @Query(() => ChannelResponse)
  @UseMiddleware(isAuth)
  async getChannel(@Arg("id") id: string): Promise<ChannelResponse> {
    const channel = await EChannel.createQueryBuilder("c")
      .leftJoinAndSelect("c.team", "ct")
      .leftJoinAndSelect("c.members", "cm")
      .leftJoinAndSelect("c.messages", "cms")
      .leftJoinAndSelect("cms.sender", "cmss")
      .leftJoinAndSelect("c.events", "ce")
      .leftJoinAndSelect("ce.creator", "cec")
      .where("c.id = :id", { id })
      .orderBy("cms.createdAt", "DESC")
      .addOrderBy("ce.start", "ASC")
      .getOne();
    return { channel };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteChannel(@Arg("id") id: string) {
    await EChannel.delete(id);
    return true;
  }

  @Mutation(() => ChannelResponse)
  @UseMiddleware(isAuth)
  async editChannel(
    @Args() { name, channelId, members }: EditChannelArgs,
    @Ctx() { req }: TCtx
  ): Promise<ChannelResponse> {
    let channel = await EChannel.findOne({
      where: { id: channelId },
      relations: ["members"],
    });
    channel.name = name;
    channel.members = [channel.members.find((m) => m.id === req.uid)].concat(
      await User.findByIds(members)
    );
    channel = await channel.save();
    return { channel };
  }
}
