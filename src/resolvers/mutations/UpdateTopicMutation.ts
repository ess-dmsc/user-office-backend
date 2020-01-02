import {
  Args,
  ArgsType,
  Ctx,
  Field,
  Int,
  Mutation,
  Resolver
} from "type-graphql";
import { ResolverContext } from "../../context";
import { TopicResponseWrap } from "../Wrappers";
import { wrapResponse } from "../wrapResponse";

@ArgsType()
class UpdateTopicArgs {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => Boolean, { nullable: true })
  isEnabled: boolean;
}

@Resolver()
export class UpdateTopicMutation {
  @Mutation(() => TopicResponseWrap)
  updateTopic(
    @Args() { id, title, isEnabled }: UpdateTopicArgs,
    @Ctx() context: ResolverContext
  ) {
    return wrapResponse(
      context.mutations.template.updateTopic(
        context.user,
        id,
        title,
        isEnabled
      ),
      TopicResponseWrap
    );
  }
}
