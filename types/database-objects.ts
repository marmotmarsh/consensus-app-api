import { type ThumbEnum } from '.';

export interface DBOFields {
  ID: string;
  UpdatedAt: string;
  CreatedAt: string;
}

export interface DBOProposal extends DBOFields {
  Title: string;
  Description: string;
  Email: string | null;
  UserId: string | null;
  UserName: string | null;
}

export interface DBOUser extends DBOFields {
  Name: string;
  Email: string;
  IsPremium: boolean;
}

export interface DBOProposalResponse extends DBOFields {
  UserName: string;
  ProposalId: string;
  Thumb: ThumbEnum;
  Comment: string | null;
}

export interface DBOTeam extends DBOFields {
  Name: string;
  Users: string[];
}

export interface QueryResponseObject {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
}
