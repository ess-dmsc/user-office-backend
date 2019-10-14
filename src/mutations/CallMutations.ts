import { CallDataSource } from "../datasources/CallDataSource";
import { User } from "../models/User";
import { Call } from "../models/Call";
import { EventBus } from "../events/eventBus";
import { ApplicationEvent } from "../events/applicationEvents";
import { rejection, Rejection } from "../rejection";

export default class CallMutations {
  constructor(
    private dataSource: CallDataSource,
    private userAuth: any,
    private eventBus: EventBus<ApplicationEvent>
  ) {}

  async create(
    agent: User | null,
    shortCode: string,
    startCall: string,
    endCall: string,
    startReview: string,
    endReview: string,
    startNotify: string,
    endNotify: string,
    cycleComment: string,
    surveyComment: string
  ): Promise<Call | Rejection> {
    if (agent == null) {
      return rejection("NOT_LOGGED_IN");
    }
    if (!(await this.userAuth.isUserOfficer(agent))) {
      return rejection("NOT_USER_OFFICER");
    }
    const result = await this.dataSource.create(
      shortCode,
      startCall,
      endCall,
      startReview,
      endReview,
      startNotify,
      endNotify,
      cycleComment,
      surveyComment
    );
    return result || rejection("INTERNAL_ERROR");
  }
}