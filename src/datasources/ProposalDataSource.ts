import { Proposal } from '../models/Proposal';
import { Questionary } from '../models/ProposalModel';

export interface ProposalDataSource {
  // Read
  get(id: number): Promise<Proposal | null>;
  checkActiveCall(): Promise<boolean>;
  getProposals(
    filter?: string,
    first?: number,
    offset?: number
  ): Promise<{ totalCount: number; proposals: Proposal[] }>;
  getUserProposals(id: number): Promise<Proposal[]>;
  getQuestionary(proposalId: number): Promise<Questionary>;

  // Write
  create(id: number): Promise<Proposal>;
  update(proposal: Proposal): Promise<Proposal>;
  setProposalUsers(id: number, users: number[]): Promise<void>;
  submitProposal(id: number): Promise<Proposal>;
  deleteProposal(id: number): Promise<Proposal>;
  updateAnswer(
    proposal_id: number,
    question_id: string,
    answer: string
  ): Promise<string>;
  insertFiles(
    proposal_id: number,
    question_id: string,
    files: string[]
  ): Promise<string[]>;
  deleteFiles(proposal_id: number, question_id: string): Promise<string[]>;
  updateTopicCompletenesses(
    id: number,
    topicsCompleted: number[]
  ): Promise<void>;
}
