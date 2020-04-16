import 'reflect-metadata';
import { ReviewDataSourceMock } from '../datasources/mockups/ReviewDataSource';
import { TemplateDataSourceMock } from '../datasources/mockups/TemplateDataSource';
import {
  dummyUserOfficer,
  dummyUser,
  UserDataSourceMock,
} from '../datasources/mockups/UserDataSource';
import {
  Topic,
  ProposalTemplate,
  DataType,
  ProposalTemplateField,
} from '../models/ProposalModel';
import { isRejection } from '../rejection';
import { MutedLogger } from '../utils/Logger';
import { UserAuthorization } from '../utils/UserAuthorization';
import TemplateMutations from './TemplateMutations';

// TODO: it is here much of the logic reside

const dummyLogger = new MutedLogger();
const dummyTemplateDataSource = new TemplateDataSourceMock();
const userAuthorization = new UserAuthorization(
  new UserDataSourceMock(),
  new ReviewDataSourceMock()
);
const templateMutations = new TemplateMutations(
  dummyTemplateDataSource,
  userAuthorization,
  dummyLogger
);

beforeEach(() => {
  dummyTemplateDataSource.init();
});

test('A userofficer can update topic', async () => {
  const newTopicTitle = 'new topic title';
  const topicEnabled = false;
  const topic = await templateMutations.updateTopic(dummyUserOfficer, {
    id: 1,
    title: newTopicTitle,
    isEnabled: topicEnabled,
  });
  expect(topic instanceof Topic).toBe(true);
  expect((topic as Topic).topic_title).toEqual(newTopicTitle);
  expect((topic as Topic).is_enabled).toEqual(topicEnabled);
});

test('A user can not update topic', async () => {
  const topic = await templateMutations.updateTopic(dummyUser, {
    id: 1,
    title: 'New topic title',
    isEnabled: false,
  });

  expect(topic instanceof Topic).toBe(false);
});

test('A user-officer can create topic', async () => {
  let template = await templateMutations.createTopic(dummyUserOfficer, 0);
  expect(template instanceof ProposalTemplate).toBe(true); // getting back new template
  const numberOfTopics = (template as ProposalTemplate).steps.length;

  template = await templateMutations.createTopic(dummyUserOfficer, 1);
  expect((template as ProposalTemplate).steps.length).toEqual(
    numberOfTopics + 1
  ); // added new one
});

test('A user can not create topic', async () => {
  const topic = await templateMutations.createTopic(dummyUser, 0);
  expect(topic instanceof ProposalTemplate).toBe(false);
});

test('A user-officer can update fieltTopicRel', async () => {
  const response = await templateMutations.updateFieldTopicRel(
    dummyUserOfficer,
    {
      topicId: 1,
      fieldIds: ['has_links_with_industry', 'enable_crystallization'],
    }
  );
  expect(isRejection(response)).toEqual(false);
});

test('A user can not update fieltTopicRel', async () => {
  const response = await templateMutations.updateFieldTopicRel(dummyUser, {
    topicId: 1,
    fieldIds: ['has_links_with_industry', 'enable_crystallization'],
  });
  expect(isRejection(response)).toEqual(true);
});

test('User can not create field', async () => {
  const response = await templateMutations.createTemplateField(dummyUser, {
    topicId: 1,
    dataType: DataType.EMBELLISHMENT,
  });
  expect(response).not.toBeInstanceOf(ProposalTemplate);
});

test('User officer can create field', async () => {
  const response = await templateMutations.createTemplateField(
    dummyUserOfficer,
    { topicId: 1, dataType: DataType.EMBELLISHMENT }
  );
  expect(response).toBeInstanceOf(ProposalTemplateField);

  const newField = response as ProposalTemplateField;
  expect(newField.topic_id).toEqual(1);
  expect(newField.data_type).toEqual(DataType.EMBELLISHMENT);
});

test('User can not delete field', async () => {
  await expect(
    templateMutations.deleteTemplateField(dummyUser, 'field_id')
  ).resolves.not.toBeInstanceOf(ProposalTemplate);
});

test('User officer can delete field', async () => {
  await expect(
    templateMutations.deleteTemplateField(dummyUserOfficer, 'field_id')
  ).resolves.toBeInstanceOf(ProposalTemplate);
});

test('Officer can update topic order', async () => {
  return expect(
    templateMutations.updateTopicOrder(dummyUserOfficer, [1, 3, 2])
  ).resolves.toBeTruthy();
});

test('User can not update topic order', async () => {
  const result = await templateMutations.updateTopicOrder(dummyUser, [1, 3, 2]);

  return expect(isRejection(result)).toBeTruthy();
});

test('Officer can delete a topic', async () => {
  const topic = await templateMutations.deleteTopic(dummyUserOfficer, 1);
  expect(topic instanceof Topic).toBe(true);
});

test('Dummy user can not delete a topic', async () => {
  const topic = await templateMutations.deleteTopic(dummyUser, 1);
  expect(topic instanceof Topic).toBe(false);
});
