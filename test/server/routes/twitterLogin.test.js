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


describe('test twitter callback', (done) => {
  it('should return undefined if successful', () => {
    // eslint-disable-next-line max-len
    const twitterCallbackResult = twitterCallback(accessToken, tokenSecret, profile, done);
    should.equal(twitterCallbackResult, undefined);
  });
});
