export interface DBFields {
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
export interface Proposal extends NewProposal, DBFields {}

export enum ThumbEnum {
  Yes = 'Yes',
  No = 'No',
  Sideways = 'Sideways',
  NoReply = 'No Reply',
}

export interface NewProposalResponse {
  proposalId: string;
  userName: string;
  thumb: ThumbEnum;
  comment?: string;
}
export interface ProposalResponse extends NewProposalResponse, DBFields {}

export interface User extends DBFields {
  name: string;
  email: string;
  isPremium: boolean;
}

export interface Team extends DBFields {
  id: string;
  name: string;
  users: string[];
}
