import { JSDict } from '@esss-swap/duo-localisation';

import {
  proposalDataSource,
  questionaryDataSource,
  templateDataSource,
} from '../datasources';
import { ProposalDataSource } from '../datasources/ProposalDataSource';
import { QuestionaryDataSource } from '../datasources/QuestionaryDataSource';
import { TemplateDataSource } from '../datasources/TemplateDataSource';
import { TemplateCategoryId } from '../models/ProposalModel';
import { User } from '../models/User';
import { userAuthorization } from '../utils/UserAuthorization';

interface QuestionaryAuthorizer {
  hasReadRights(agent: User | null, questionaryId: number): Promise<boolean>;
  hasWriteRights(agent: User | null, questionaryId: number): Promise<boolean>;
}

class ProposalQuestionaryAuthorizer implements QuestionaryAuthorizer {
  constructor(private proposalDataSource: ProposalDataSource) {}
  async hasReadRights(agent: User | null, questionaryId: number) {
    return this.hasRights(agent, questionaryId);
  }
  async hasWriteRights(agent: User | null, questionaryId: number) {
    return this.hasRights(agent, questionaryId);
  }

  private async hasRights(agent: User | null, questionaryId: number) {
    if (!agent) {
      return false;
    }

    const proposal = (
      await this.proposalDataSource.getProposals({
        questionaryIds: [questionaryId],
      })
    ).proposals[0];

    return userAuthorization.hasAccessRights(agent, proposal);
  }
}

class SampleDeclarationQuestionaryAuthorizer implements QuestionaryAuthorizer {
  constructor(
    private proposalDataSource: ProposalDataSource,
    private questionaryDataSource: QuestionaryDataSource
  ) {}
  async hasReadRights(agent: User | null, questionaryId: number) {
    return this.hasRights(agent, questionaryId);
  }
  async hasWriteRights(agent: User | null, questionaryId: number) {
    return this.hasRights(agent, questionaryId);
  }

  private async hasRights(agent: User | null, questionaryId: number) {
    if (!agent) {
      return false;
    }

    const sampleDeclarationQuestionary = await this.questionaryDataSource.getQuestionary(
      questionaryId
    );
    if (sampleDeclarationQuestionary?.creator_id === agent.id) {
      return true;
    }

    const proposalQuestionary = await this.questionaryDataSource.getParentQuestionary(
      questionaryId
    );
    if (!proposalQuestionary?.questionaryId) return false;
    const proposal = (
      await this.proposalDataSource.getProposals({
        questionaryIds: [proposalQuestionary.questionaryId],
      })
    ).proposals[0];

    return userAuthorization.hasAccessRights(agent, proposal);
  }
}

export class QuestionaryAuthorization {
  private authorizers: JSDict<number, QuestionaryAuthorizer> = JSDict.Create();
  constructor(
    private proposalDataSource: ProposalDataSource,
    private questionaryDataSource: QuestionaryDataSource,
    private templateDataSource: TemplateDataSource
  ) {
    this.authorizers = JSDict.Create();
    this.authorizers.put(
      TemplateCategoryId.PROPOSAL_QUESTIONARY,
      new ProposalQuestionaryAuthorizer(this.proposalDataSource)
    );
    this.authorizers.put(
      TemplateCategoryId.SAMPLE_DECLARATION,
      new SampleDeclarationQuestionaryAuthorizer(
        proposalDataSource,
        questionaryDataSource
      )
    );
  }

  private async getTemplateCategoryIdForQuestionary(questionaryId: number) {
    const templateId = (
      await this.questionaryDataSource.getQuestionary(questionaryId)
    )?.templateId;
    if (!templateId) return null;

    const categoryId = (await this.templateDataSource.getTemplate(templateId))
      ?.categoryId;
    if (!categoryId) return null;

    return categoryId;
  }

  private async getAuthorizer(questionaryId: number) {
    const categoryId = await this.getTemplateCategoryIdForQuestionary(
      questionaryId
    );
    if (!categoryId) return null;

    return this.authorizers.get(categoryId);
  }

  async hasReadRights(agent: User | null, questionaryId: number) {
    return (
      (await this.getAuthorizer(questionaryId))?.hasReadRights(
        agent,
        questionaryId
      ) || false
    );
  }

  async hasWriteRights(agent: User | null, questionaryId: number) {
    return (
      (await this.getAuthorizer(questionaryId))?.hasWriteRights(
        agent,
        questionaryId
      ) || false
    );
  }
}

export const questionaryAuthorization = new QuestionaryAuthorization(
  proposalDataSource,
  questionaryDataSource,
  templateDataSource
);
