import { Args, ArgsType, Ctx, Field, Mutation, Resolver } from "type-graphql";
import { ResolverContext } from "../../context";
import { BasicUserDetailsResponseWrap } from "../Wrappers";
import { wrapResponse } from "../wrapResponse";

@ArgsType()
class ResetPasswordArgs {
  @Field()
  public token: string;

  @Field()
  public password: string;
}

@Resolver()
export class ResetPasswordMutation {
  @Mutation(() => BasicUserDetailsResponseWrap, { nullable: true })
  resetPassword(
    @Args() args: ResetPasswordArgs,
    @Ctx() context: ResolverContext
  ) {
    wrapResponse(
      context.mutations.user.resetPassword(args.token, args.password),
      BasicUserDetailsResponseWrap
    );
  }
}
