import 'reflect-metadata';
import {
  reviewDataSource,
  dummyReview,
} from '../datasources/mockups/ReviewDataSource';
import {
  userDataSource,
  dummyUser,
  dummyUserNotOnProposal,
  dummyUserOfficer,
} from '../datasources/mockups/UserDataSource';
import { ApplicationEvent } from '../events/applicationEvents';
import { EventBus } from '../events/eventBus';
import { UserAuthorization } from '../utils/UserAuthorization';
import ReviewQueries from './ReviewQueries';

const dummyEventBus = new EventBus<ApplicationEvent>();
const userAuthorization = new UserAuthorization(
  new userDataSource(),
  new reviewDataSource()
);
const reviewQueries = new ReviewQueries(
  new reviewDataSource(),
  userAuthorization
);

//Update

test('A userofficer can get a review', () => {
  return expect(reviewQueries.get(dummyUserOfficer, 10)).resolves.toBe(
    dummyReview
  );
});

test("A user can't get a review", () => {
  return expect(reviewQueries.get(dummyUser, 1)).resolves.toBe(null);
});

test('A userofficer can get reviews for a proposal', () => {
  return expect(
    reviewQueries.reviewsForProposal(dummyUserOfficer, 10)
  ).resolves.toStrictEqual([dummyReview]);
});

test("A user can't reviews for a proposal", () => {
  return expect(
    reviewQueries.reviewsForProposal(dummyUser, 10)
  ).resolves.toStrictEqual([]);
});
