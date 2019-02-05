import chai, { assert } from 'chai';
import app from '../../../../app';
import statusCodes from '../../helpers/status';

chai.use(require('chai-http'));

// eslint-disable-next-line no-unused-vars
const should = chai.should();

describe('POST /api/v1/questions', () => {
  // Sample valid question request data
  const questionRecord = {
    meetupID: 2,
    title: 'Transportation',
    body: 'I would like to know if there would provisions for transportation',
  };

  // sample invalid question request data
  const invalidQuestionRecord = {
    meetupID: 2,
    title: '',
    body: 'I would like to know if there would provisions for transportation',
  };

  it('should return error if token is not provided', (done) => {
    chai.request(app)
      .post('/api/v1/questions')
      .set('x-access-token', '')
      .send(questionRecord)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return error if token is invalid', (done) => {
    const sampleFakeToken = 'oioad980902.23klaewqwef';
    chai.request(app)
      .post('/api/v1/questions')
      .set('x-access-token', sampleFakeToken)
      .send(questionRecord)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  // login user
  // user to obtain user with/without admin rights - users created by DB Seeder
  const regularUser = {
    email: 'e.genius@gmail.com',
    password: 'questioner40',
  };
  let loginResponse;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(regularUser)
      .end((err, res) => {
        [loginResponse] = res.body.data;
        done();
      });
  });

  it('should respond with error if request is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/questions')
      .set('x-access-token', loginResponse.token)
      .send(invalidQuestionRecord)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  it('should response with error if meetup does not exist', (done) => {
    const questionRecordWithInvalidMeetup = {
      meetupID: 8,
      title: 'Transportation',
      body: 'I would like to know if there would provisions for transportation',
    };
    chai.request(app)
      .post('/api/v1/questions')
      .set('x-access-token', loginResponse.token)
      .send(questionRecordWithInvalidMeetup)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  describe('response', () => {
    it('should respond with newly created question record if request is valid', (done) => {
      chai.request(app)
        .post('/api/v1/questions')
        .set('x-access-token', loginResponse.token)
        .send(questionRecord)
        .end((err, res) => {
          res.should.have.status(statusCodes.created);
          res.body.data[0].should.have.property('user_id').eql(2);
          res.body.data[0].should.have.property('title').eql('Transportation');
          done();
        });
    });
  });
});

describe('PATCH /api/v1/questions/:id/upvote', () => {
  it('should return error if token is not provided', (done) => {
    chai.request(app)
      .patch('/api/v1/questions/1/upvote')
      .set('x-access-token', '')
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return error if token is invalid', (done) => {
    const sampleFakeToken = 'oioad980902.23klaewqwef';
    chai.request(app)
      .patch('/api/v1/questions/1/upvote')
      .set('x-access-token', sampleFakeToken)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  // user to obtain user with/without admin rights - users created by DB Seeder
  const regularUser = {
    email: 'e.genius@gmail.com',
    password: 'questioner40',
  };
  let loginResponse;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(regularUser)
      .end((err, res) => {
        [loginResponse] = res.body.data;
        done();
      });
  });

  it('should respond with error if param is invalid', (done) => {
    const invalidParameter = 'string';
    chai.request(app)
      .patch(`/api/v1/questions/${invalidParameter}/upvote`)
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  it('should respond with error if question does not exist', (done) => {
    const fakeQuestionID = 982;
    chai.request(app)
      .patch(`/api/v1/questions/${fakeQuestionID}/upvote`)
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  // Make a upvote request using another user
  // user to obtain user with/without admin rights - users created by DB Seeder
  const anotherRegularUser = {
    email: 'c.guy@gmail.com',
    password: 'questioner40',
  };
  let secondLoginResponse;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(anotherRegularUser)
      .end((err, res) => {
        [secondLoginResponse] = res.body.data;
        done();
      });
  });

  const questionID = 3; // Set by DB seeder
  let firstQuestionUpvoteResponse;

  before((done) => {
    chai.request(app)
      .patch(`/api/v1/questions/${questionID}/upvote`)
      .set('x-access-token', secondLoginResponse.token)
      .end((err, res) => {
        [firstQuestionUpvoteResponse] = res.body.data;
        done();
      });
  });

  let secondQuestionUpvoteResponse;
  before((done) => {
    chai.request(app)
      .patch(`/api/v1/questions/${questionID}/upvote`)
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        [secondQuestionUpvoteResponse] = res.body.data;
        done();
      });
  });
  it('should increase votes by 1 after hitting upvote endpoint', () => {
    assert.equal(firstQuestionUpvoteResponse.votes + 1, secondQuestionUpvoteResponse.votes);
  });
});

describe('PATCH /api/v1/questions/:id/downvote', () => {
  it('should return error if token is not provided', (done) => {
    chai.request(app)
      .patch('/api/v1/questions/1/downvote')
      .set('x-access-token', '')
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  it('should return error if token is invalid', (done) => {
    const sampleFakeToken = 'oioad980902.23klaewqwef';
    chai.request(app)
      .patch('/api/v1/questions/1/downvote')
      .set('x-access-token', sampleFakeToken)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  // user to obtain user with/without admin rights - users created by DB Seeder
  const regularUser = {
    email: 'e.genius@gmail.com',
    password: 'questioner40',
  };
  let loginResponse;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(regularUser)
      .end((err, res) => {
        [loginResponse] = res.body.data;
        done();
      });
  });

  it('should respond with error if param is invalid', (done) => {
    const invalidParameter = 'string';
    chai.request(app)
      .patch(`/api/v1/questions/${invalidParameter}/downvote`)
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.badRequest);
        done();
      });
  });

  it('should respond with error if question does not exist', (done) => {
    const fakeQuestionID = 982;
    chai.request(app)
      .patch(`/api/v1/questions/${fakeQuestionID}/downvote`)
      .set('x-access-token', loginResponse.token)
      .end((err, res) => {
        res.should.have.status(statusCodes.forbidden);
        done();
      });
  });

  // Make a downvote request using another user
  const anotherRegularUser = {
    email: 'c.guy@gmail.com',
    password: 'questioner40',
  };
  let secondLoginResponse;
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(anotherRegularUser)
      .end((err, res) => {
        [secondLoginResponse] = res.body.data;
        done();
      });
  });

  const questionID = 4; // As already created by the database seeder

  // Make upvote request
  let upvoteResponse;
  before((done) => {
    chai.request(app)
      .patch(`/api/v1/questions/${questionID}/upvote`)
      .set('x-access-token', secondLoginResponse.token)
      .end((err, res) => {
        [upvoteResponse] = res.body.data;
        done();
      });
  });

  // Now make downvote request
  let downvoteResponse;
  before((done) => {
    chai.request(app)
      .patch(`/api/v1/questions/${questionID}/downvote`)
      .set('x-access-token', secondLoginResponse.token)
      .end((err, res) => {
        [downvoteResponse] = res.body.data;
        done();
      });
  });

  it('should return votes reduced by 1 after hitting the downvote endpoint', () => {
    assert.equal(upvoteResponse.votes - 1, downvoteResponse.votes);
  });
});
