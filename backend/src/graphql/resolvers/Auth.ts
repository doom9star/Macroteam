import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import User from "../../entity/User";
import { isNotAuth } from "../middleware";
import { TCtx, UserResponse } from "../types";

@ArgsType()
class RegisterArgs {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@ArgsType()
class LoginArgs {
  @Field()
  emailOrName: string;

  @Field()
  password: string;
}

@Resolver(User)
export default class RUser {
  @Mutation(() => UserResponse)
  @UseMiddleware(isNotAuth)
  async register(
    @Args() { name, email, password }: RegisterArgs,
    @Ctx() { res }: TCtx
  ): Promise<UserResponse> {
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return {
        errors: [{ property: "email", message: "Email already exists!" }],
      };
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
    }).save();

    const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return { user };
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isNotAuth)
  async login(
    @Args() { emailOrName, password }: LoginArgs,
    @Ctx() { res }: TCtx
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: { [emailOrName.includes("@") ? "email" : "name"]: emailOrName },
    });
    if (!user)
      return {
        errors: [
          {
            property: "emailOrName",
            message: "Email Or Name doesn't exist!",
          },
        ],
      };
    if (!(await bcrypt.compare(password, user.password)))
      return {
        errors: [
          {
            property: "password",
            message: "Wrong password!",
          },
        ],
      };

    const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: TCtx) {
    res.clearCookie("token");
    return true;
  }
}
