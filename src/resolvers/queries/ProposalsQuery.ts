import {
  Args,
  ArgsType,
  Ctx,
  Field,
  InputType,
  Int,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import { Proposal } from '../types/Proposal';

@InputType()
export class ProposalsFilter {
  @Field(() => String, { nullable: true })
  public text?: string;

  @Field(() => [Int], { nullable: true })
  public templateIds?: number[];

  @Field(() => [Int], { nullable: true })
  public questionaryIds?: number[];

  @Field(() => Int, { nullable: true })
  public callId?: number;

  @Field(() => Int, { nullable: true })
  public instrumentId?: number;
}

@ArgsType()
class ProposalsArgs {
  @Field(() => ProposalsFilter, { nullable: true })
  public filter?: ProposalsFilter;

  @Field(() => Int, { nullable: true })
  public first?: number;

  @Field(() => Int, { nullable: true })
  public offset?: number;
}

@ObjectType()
class ProposalsQueryResult {
  @Field(() => Int)
  public totalCount: number;

  @Field(() => [Proposal])
  public proposals: Proposal[];
}

@Resolver()
export class ProposalsQuery {
  @Query(() => ProposalsQueryResult, { nullable: true })
  async proposals(
    @Args() args: ProposalsArgs,
    @Ctx() context: ResolverContext
  ): Promise<ProposalsQueryResult | null> {
    return context.queries.proposal.getAll(
      context.user,
      args.filter,
      args.first,
      args.offset
    );
  }
}
