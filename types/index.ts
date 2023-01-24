export interface NewProposal {
  title: string;
  description: string;
  email?: string;
  userId?: string;
  userName?: string;
}

export interface Proposal extends NewProposal {
  id: string;
  createdAt: string;
  updatedAt: string;
}
