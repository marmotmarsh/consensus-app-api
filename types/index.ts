export interface DBO {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewProposal {
  title: string;
  description: string;
  email?: string;
  userId?: string;
  userName?: string;
}
export interface Proposal extends NewProposal, DBO {}

export enum ThumbEnum {
  Yes = 'Yes',
  No = 'No',
  Sideways = 'Sideways',
  NoReply = 'No Reply',
}

export interface NewProposalResponse {
  proposalId: string;
  userName: string;
  thumb?: ThumbEnum;
  comment?: string;
}
export interface ProposalResponse extends NewProposalResponse, DBO {}

export * from './netlify';
