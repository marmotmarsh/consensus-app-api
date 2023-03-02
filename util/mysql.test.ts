import { describe, expect, test } from '@jest/globals';
import _ from 'lodash';

import { DBOProposal, DBOProposalResponse, ThumbEnum } from '../types';
import { QueryOptions, buildQueryString, MethodEnum } from './mysql';

describe('MySql Util Module', () => {
  describe('Build query for create-proposal', () => {
    test('Build query with standard field values', () => {
      const proposal: Partial<DBOProposal> = {
        ID: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Title: 'Test Proposal Title',
        Description: '<p>Test Description</p>',
        Email: 'TestEmail@test.com',
        UserId: '4b857ddb-2723-42bb-8f71-c4ae94f7b817',
        UserName: 'Des Toozer',
      };

      const options: QueryOptions<DBOProposal> = {
        method: MethodEnum.INSERT,
        tableName: 'proposals',
        fieldValues: proposal,
        where: {},
      };

      const queryString = buildQueryString<DBOProposal>(options);

      const expectedQueryString =
        `INSERT INTO proposals (ID, Title, Description, Email, UserId, UserName) VALUES ` +
        `('ba8ad3e7-e494-4395-9326-1fd5fdd17dd7', 'Test Proposal Title', '<p>Test Description</p>', ` +
        `'TestEmail@test.com', '4b857ddb-2723-42bb-8f71-c4ae94f7b817', 'Des Toozer');`;

      expect(queryString).toEqual(expectedQueryString);
    });

    test('Build query with some null field values', () => {
      const proposal: Partial<DBOProposal> = {
        ID: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Title: 'Test Proposal Title',
        Description: '<p>Test Description</p>',
        Email: null,
        UserId: null,
        UserName: null,
      };

      const options: QueryOptions<DBOProposal> = {
        method: MethodEnum.INSERT,
        tableName: 'proposals',
        fieldValues: proposal,
        where: {},
      };

      const queryString = buildQueryString<DBOProposal>(options);

      const expectedQueryString =
        `INSERT INTO proposals (ID, Title, Description, Email, UserId, UserName) VALUES ` +
        `('ba8ad3e7-e494-4395-9326-1fd5fdd17dd7', 'Test Proposal Title', '<p>Test Description</p>', ` +
        `NULL, NULL, NULL);`;

      expect(queryString).toEqual(expectedQueryString);
    });

    test('Build query with some undefined field values', () => {
      const proposal: Partial<DBOProposal> = {
        ID: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Title: 'Test Proposal Title',
        Description: '<p>Test Description</p>',
        Email: undefined,
        UserId: undefined,
      };

      const options: QueryOptions<DBOProposal> = {
        method: MethodEnum.INSERT,
        tableName: 'proposals',
        fieldValues: proposal,
        where: {},
      };

      const queryString = buildQueryString<DBOProposal>(options);

      const expectedQueryString =
        `INSERT INTO proposals (ID, Title, Description) VALUES ` +
        `('ba8ad3e7-e494-4395-9326-1fd5fdd17dd7', 'Test Proposal Title', '<p>Test Description</p>');`;

      expect(queryString).toEqual(expectedQueryString);
    });

    test('Build query with other random characters', () => {
      const proposal: Partial<DBOProposal> = {
        ID: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Title: 'Test Proposal Title',
        Description: `<p>Test Description. You'll work right?</p>`,
        Email: 'TestEmail@test.com',
        UserId: '4b857ddb-2723-42bb-8f71-c4ae94f7b817',
        UserName: 'Des Toozer',
      };

      const options: QueryOptions<DBOProposal> = {
        method: MethodEnum.INSERT,
        tableName: 'proposals',
        fieldValues: proposal,
        where: {},
      };

      const queryString = buildQueryString<DBOProposal>(options);

      const expectedQueryString =
        `INSERT INTO proposals (ID, Title, Description, Email, UserId, UserName) VALUES ` +
        `('ba8ad3e7-e494-4395-9326-1fd5fdd17dd7', 'Test Proposal Title', ` +
        `'<p>Test Description. You\'ll work right?</p>', 'TestEmail@test.com', ` +
        `'4b857ddb-2723-42bb-8f71-c4ae94f7b817', 'Des Toozer');`;

      expect(queryString).toEqual(expectedQueryString);
    });
  });

  describe('Build query for update-proposal', () => {
    test('Build query with standard field values', () => {
      const proposal: Partial<DBOProposal> = {
        ID: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Title: 'Test Proposal Title',
        Description: `<p>Test Description. You'll work right?</p>`,
        Email: 'TestEmail@test.com',
        UserId: '4b857ddb-2723-42bb-8f71-c4ae94f7b817',
        UserName: 'Des Toozer',
      };

      const options: QueryOptions<DBOProposal> = {
        method: MethodEnum.UPDATE,
        tableName: 'proposals',
        fieldValues: _.omit(proposal, 'ID', 'UserId'),
        where: _.pick(proposal, 'ID'),
      };

      const queryString = buildQueryString<DBOProposal>(options);

      const expectedQueryString =
        `UPDATE proposals SET Title = 'Test Proposal Title', ` +
        `Description = '<p>Test Description. You'll work right?</p>', Email = 'TestEmail@test.com', ` +
        `UserName = 'Des Toozer' WHERE ID = 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7';`;

      expect(queryString).toEqual(expectedQueryString);
    });

    test('Build query with some null values', () => {
      const proposal: Partial<DBOProposal> = {
        ID: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Title: 'Test Proposal Title',
        Description: `<p>Test Description. You'll work right?</p>`,
        Email: null,
        UserId: null,
        UserName: null,
      };

      const options: QueryOptions<DBOProposal> = {
        method: MethodEnum.UPDATE,
        tableName: 'proposals',
        fieldValues: _.omit(proposal, 'ID', 'UserId'),
        where: _.pick(proposal, 'ID'),
      };

      const queryString = buildQueryString<DBOProposal>(options);

      const expectedQueryString =
        `UPDATE proposals SET Title = 'Test Proposal Title', ` +
        `Description = '<p>Test Description. You'll work right?</p>', Email = NULL, ` +
        `UserName = NULL WHERE ID = 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7';`;

      expect(queryString).toEqual(expectedQueryString);
    });
  });

  describe('Build query for get-proposal', () => {
    test('Build query with standard field values', () => {
      const proposal: Partial<DBOProposal> = {
        ID: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Title: 'Test Proposal Title',
        Description: `<p>Test Description. You'll work right?</p>`,
        Email: 'TestEmail@test.com',
        UserId: '4b857ddb-2723-42bb-8f71-c4ae94f7b817',
        UserName: 'Des Toozer',
      };

      const options: QueryOptions<DBOProposal> = {
        method: MethodEnum.SELECT,
        tableName: 'proposals',
        fieldValues: {},
        where: _.pick(proposal, 'ID'),
      };

      const queryString = buildQueryString<DBOProposal>(options);

      const expectedQueryString = `SELECT * FROM proposals WHERE ID = 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7';`;

      expect(queryString).toEqual(expectedQueryString);
    });
  });

  describe('Build query for create-proposal-response', () => {
    test('Build query with standard field values', () => {
      const proposalResponse: Partial<DBOProposalResponse> = {
        ID: '7611dc5f-2692-4c6c-8dd0-96cb4e046dbc',
        UserName: 'Des Toozer',
        ProposalId: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Thumb: ThumbEnum.Yes,
        Comment: 'I agree',
      };

      const options: QueryOptions<DBOProposalResponse> = {
        method: MethodEnum.INSERT,
        tableName: 'proposal-responses',
        fieldValues: proposalResponse,
        where: {},
      };

      const queryString = buildQueryString<DBOProposalResponse>(options);

      const expectedQueryString =
        `INSERT INTO proposal-responses (ID, UserName, ProposalId, Thumb, Comment) VALUES ` +
        `('7611dc5f-2692-4c6c-8dd0-96cb4e046dbc', 'Des Toozer', 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7', ` +
        `'Yes', 'I agree');`;

      expect(queryString).toEqual(expectedQueryString);
    });

    test('Build query with some null field values', () => {
      const proposalResponse: Partial<DBOProposalResponse> = {
        ID: '7611dc5f-2692-4c6c-8dd0-96cb4e046dbc',
        UserName: 'Des Toozer',
        ProposalId: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Thumb: ThumbEnum.NoReply,
        Comment: null,
      };

      const options: QueryOptions<DBOProposalResponse> = {
        method: MethodEnum.INSERT,
        tableName: 'proposal-responses',
        fieldValues: proposalResponse,
        where: {},
      };

      const queryString = buildQueryString<DBOProposalResponse>(options);

      const expectedQueryString =
        `INSERT INTO proposal-responses (ID, UserName, ProposalId, Thumb, Comment) VALUES ` +
        `('7611dc5f-2692-4c6c-8dd0-96cb4e046dbc', 'Des Toozer', 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7', ` +
        `'No Reply', NULL);`;

      expect(queryString).toEqual(expectedQueryString);
    });

    test('Build query with other random characters', () => {
      const proposalResponse: Partial<DBOProposalResponse> = {
        ID: '7611dc5f-2692-4c6c-8dd0-96cb4e046dbc',
        UserName: 'Des Toozer',
        ProposalId: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Thumb: ThumbEnum.Sideways,
        Comment: `I'm freeeeeeee, free-faaaaaaallin\'`,
      };

      const options: QueryOptions<DBOProposalResponse> = {
        method: MethodEnum.INSERT,
        tableName: 'proposal-responses',
        fieldValues: proposalResponse,
        where: {},
      };

      const queryString = buildQueryString<DBOProposalResponse>(options);

      const expectedQueryString =
        `INSERT INTO proposal-responses (ID, UserName, ProposalId, Thumb, Comment) VALUES ` +
        `('7611dc5f-2692-4c6c-8dd0-96cb4e046dbc', 'Des Toozer', 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7', ` +
        `'Sideways', 'I\'m freeeeeeee, free-faaaaaaallin\'');`;

      expect(queryString).toEqual(expectedQueryString);
    });
  });

  describe('Build query for update-proposal-response', () => {
    test('Build query with standard field values', () => {
      const proposalResponse: Partial<DBOProposalResponse> = {
        ID: '7611dc5f-2692-4c6c-8dd0-96cb4e046dbc',
        UserName: 'Des Toozer',
        ProposalId: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Thumb: ThumbEnum.Yes,
        Comment: 'I agree',
      };

      const options: QueryOptions<DBOProposalResponse> = {
        method: MethodEnum.UPDATE,
        tableName: 'proposal-responses',
        fieldValues: _.omit(proposalResponse, 'ID', 'ProposalId'),
        where: _.pick(proposalResponse, 'ID'),
      };

      const queryString = buildQueryString<DBOProposalResponse>(options);

      const expectedQueryString =
        `UPDATE proposal-responses SET UserName = 'Des Toozer', Thumb = 'Yes', Comment = 'I agree' ` +
        `WHERE ID = '7611dc5f-2692-4c6c-8dd0-96cb4e046dbc';`;

      expect(queryString).toEqual(expectedQueryString);
    });

    test('Build query with some null values', () => {
      const proposalResponse: Partial<DBOProposalResponse> = {
        ID: '7611dc5f-2692-4c6c-8dd0-96cb4e046dbc',
        UserName: 'Des Toozer',
        ProposalId: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Thumb: ThumbEnum.NoReply,
        Comment: null,
      };

      const options: QueryOptions<DBOProposalResponse> = {
        method: MethodEnum.UPDATE,
        tableName: 'proposal-responses',
        fieldValues: _.omit(proposalResponse, 'ID', 'ProposalId'),
        where: _.pick(proposalResponse, 'ID'),
      };

      const queryString = buildQueryString<DBOProposalResponse>(options);

      const expectedQueryString =
        `UPDATE proposal-responses SET UserName = 'Des Toozer', Thumb = 'No Reply', Comment = NULL ` +
        `WHERE ID = '7611dc5f-2692-4c6c-8dd0-96cb4e046dbc';`;

      expect(queryString).toEqual(expectedQueryString);
    });
  });

  describe('Build query for get-proposal-responses-by-proposal-id', () => {
    test('Build query with standard field values', () => {
      const proposalResponse: Partial<DBOProposalResponse> = {
        ID: '7611dc5f-2692-4c6c-8dd0-96cb4e046dbc',
        UserName: 'Des Toozer',
        ProposalId: 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7',
        Thumb: ThumbEnum.Yes,
        Comment: 'I agree',
      };

      const options: QueryOptions<DBOProposalResponse> = {
        method: MethodEnum.SELECT,
        tableName: 'proposal-responses',
        fieldValues: {},
        where: _.pick(proposalResponse, 'ProposalId'),
      };

      const queryString = buildQueryString<DBOProposalResponse>(options);

      const expectedQueryString = `SELECT * FROM proposal-responses WHERE ProposalId = 'ba8ad3e7-e494-4395-9326-1fd5fdd17dd7';`;

      expect(queryString).toEqual(expectedQueryString);
    });
  });
});
