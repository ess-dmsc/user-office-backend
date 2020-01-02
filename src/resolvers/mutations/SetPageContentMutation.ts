import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { ResolverContext } from "../../context";
import { PageName } from "../../models/Page";
import { PageResponseWrap } from "../Wrappers";
import { wrapResponse } from "../wrapResponse";

@Resolver()
export class SetPageContentMutation {
  @Mutation(() => PageResponseWrap, { nullable: true })
  setPageContent(
    @Arg("id", () => PageName) id: PageName,
    @Arg("text", () => String) text: string,
    @Ctx() context: ResolverContext
  ) {
    return wrapResponse(
      context.mutations.admin.setPageText(context.user, id, text),
      PageResponseWrap
    );
  }
}
