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
import { DataType } from "../../models/ProposalModel";
import { TemplateFieldResponseWrap } from "../Wrappers";
import { wrapResponse } from "../wrapResponse";

@ArgsType()
class CreateTemplateFieldArgs {
  @Field(() => Int)
  topicId: number;

  @Field(() => DataType)
  dataType: DataType;
}

@Resolver()
export class CreateTemplateFieldMutation {
  @Mutation(() => TemplateFieldResponseWrap, { nullable: true })
  createTemplateField(
    @Args() args: CreateTemplateFieldArgs,
    @Ctx() context: ResolverContext
  ) {
    return wrapResponse(
      context.mutations.template.createTemplateField(
        context.user,
        args.topicId,
        args.dataType
      ),
      TemplateFieldResponseWrap
    );
  }
}
