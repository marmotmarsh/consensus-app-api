import { DBOProposal, DBOProposalResponse, Proposal, ProposalResponse } from '../types';
import { GLOBAL_HEADERS } from './mysql';

export function checkIfValidUUID4(str: string): boolean {
  // Regular expression to check if string is a valid UUID
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return regexExp.test(str);
}

export function handleError(error: Error) {
  console.error(error);

  return {
    statusCode: 400,
    headers: GLOBAL_HEADERS,
    body: JSON.stringify(error),
  };
}

export function transformToDBOProposal(o: Proposal): DBOProposal {
  return {
    ID: o.id,
    CreatedAt: o.createdAt,
    UpdatedAt: o.updatedAt,
    Title: o.title,
    Description: o.description,
    Email: o.email,
    UserId: o.userId,
    UserName: o.userName,
  };
}
export function transformFromDBOProposal(o: DBOProposal): Proposal {
  return {
    id: o.ID,
    createdAt: o.CreatedAt,
    updatedAt: o.UpdatedAt,
    title: o.Title,
    description: o.Description,
    email: o.Email,
    userId: o.UserId,
    userName: o.UserName,
  };
}

export function transformToDBOProposalResponse(o: ProposalResponse): DBOProposalResponse {
  return {
    ID: o.id,
    CreatedAt: o.createdAt,
    UpdatedAt: o.updatedAt,
    UserName: o.userName,
    ProposalId: o.proposalId,
    Thumb: o.thumb,
    Comment: o.comment,
  };
}

export function transformFromDBOProposalResponse(o: DBOProposalResponse): ProposalResponse {
  return {
    id: o.ID,
    createdAt: o.CreatedAt,
    updatedAt: o.UpdatedAt,
    userName: o.UserName,
    proposalId: o.ProposalId,
    thumb: o.Thumb,
    comment: o.Comment,
  };
}
