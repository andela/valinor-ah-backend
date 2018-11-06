import chai from 'chai';
import chaiHttp from 'chai-http';

import {
  profile,
  accessToken,
  tokenSecret
} from '../../../mockdata/twitterMockData';
import twitterCallback from '../../../server/helpers/twitterCallback';

chai.use(chaiHttp);

const should = chai.should();

// eslint-disable-next-line max-len
const twitterCallbackResult = twitterCallback(accessToken, tokenSecret, profile);

describe('test twitter callback', () => {
  it('should return undefined if successful', () => {
    should.equal(twitterCallbackResult, undefined);
  });
});
