const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../server');
const UserModel = require('../../models/user');

const basicUserData = {
  username: 'user',
  email: 'email@email.com',
  password: 'password',
};

const userData = {
  username: 'testuser',
  email: 'test@nuts.com',
  password: 'password',
  role: 'user',
  first_name: 'Poo',
  middle_name: 'Doggy',
  last_name: 'Dog',
  public: true,
  followed_users: [],
  pending_followers: [],
};

const userData1 = {
  username: 'user1',
  email: 'one@gmail.com',
  password: 'password',
  role: 'user',
  first_name: 'Poo',
  middle_name: 'Doggy',
  last_name: 'Dog',
  public: true,
  followed_users: [],
  pending_followers: [],
};

const userData2 = {
  username: 'user2',
  email: 'two@gmail.com',
  password: 'password',
  role: 'user',
  first_name: 'Grant',
  middle_name: 'Luke',
  last_name: 'McDonald',
  public: true,
  followed_users: [],
  pending_followers: [],
};

describe('User Route Test', () => {
  beforeAll(async () => {
    mongoose.set('useNewUrlParser', true);
    await mongoose.connect(
      process.env.MONGO_URL,
      {
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      },
    );
  });

  afterEach(async () => {
    // Clear all mock calls after every test
    jest.clearAllMocks();

    // Clear all database data after every test
    const { collections } = mongoose.connection;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('Register with new user succeeds', async () => {
    const agent = request.agent(app);
    const response = await agent.post('/user/register/').send(basicUserData);
    expect(response.status).toEqual(200);
    const user = await UserModel.findOne({ username: basicUserData.username });
    expect(user.email).toEqual(basicUserData.email);
    user.comparePassword(basicUserData.password, (err, isMatch) => {
      expect(err).toBeFalsy();
      expect(isMatch).toBeTruthy();
    });
  });

  it('Register with pre-existing user fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    const response = await agent.post('/user/register/').send(userData);
    expect(response.status).toEqual(400);
  });

  it('Login with user succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    const response = await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    expect(response.status).toEqual(200);
  });

  it('Login with user providing wrong password fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    const response = await agent.post('/user/login').send({
      email: userData.email,
      password: 'mismatch',
    });
    expect(response.status).toEqual(401);
  });

  it('Login with non-existent user fails', async () => {
    const agent = request.agent(app);
    const response = await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    expect(response.status).toEqual(401);
  });

  it('Logout with logged in user succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent.get('/user/logout');
    expect(response.status).toEqual(200);
  });

  it('Logout with logged out user fails', async () => {
    const agent = request.agent(app);
    const response = await agent.get('/user/logout');
    expect(response.status).toEqual(401);
  });

  it('Authenticated with logged in user succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent.get('/user/authenticated').send(userData);
    expect(response.status).toEqual(200);
  });

  it('Authenticated with logged out user fails', async () => {
    const agent = request.agent(app);
    const response = await agent.get('/user/authenticated');
    expect(response.status).toEqual(401);
  });

  it('Authenticated after logout fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    await agent.get('/user/logout');
    const response = await agent.get('/user/authenticated').send(userData);
    expect(response.status).toEqual(401);
  });

  it('Exists with existing user succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent.get(`/user/exists/${userData.username}`);
    expect(response.status).toEqual(200);
    expect(response.body.exists).toEqual(true);
  });

  it('Exists with non-existent user succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent.get('/user/exists/nonexistent');
    expect(response.status).toEqual(200);
    expect(response.body.exists).toEqual(false);
  });

  it('Update user info endpoint succeeds', async () => {
    const agent = request.agent(app);
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent
      .put('/user/update/info')
      .send({ first_name: 'first', middle_name: 'middle', last_name: 'last' });
    const user = await UserModel.findById(savedUser._id);
    expect(response.status).toEqual(200);
    expect(user.first_name).toEqual('first');
    expect(user.middle_name).toEqual('middle');
    expect(user.last_name).toEqual('last');
  });

  it('Update user info endpoint empty request fails', async () => {
    const agent = request.agent(app);
    const validUser = new UserModel(userData);
    await validUser.save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent.put('/user/update/info').send({});
    expect(response.status).toEqual(400);
  });

  it('Update user info endpoint ignores unsupported fields and succeeds', async () => {
    const agent = request.agent(app);
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent
      .put('/user/update/info')
      .send({ first_name: 'first', username: 'username' });
    const user = await UserModel.findById(savedUser._id);
    expect(response.status).toEqual(200);
    expect(user.first_name).toEqual('first');
    expect(user.username).toEqual(userData.username);
  });

  it('Update user info not authorized fails', async () => {
    const agent = request.agent(app);
    const validUser = new UserModel(userData);
    await validUser.save();
    const response = await agent
      .put('/user/update/info')
      .send({ first_name: 'first', middle_name: 'middle', last_name: 'last' });
    expect(response.status).toEqual(401);
  });

  it('Update user password endpoint succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent.put('/user/update/password').send({
      old_password: userData.password,
      new_password: 'bryan123',
    });
    expect(response.status).toEqual(200);
  });

  it('Update user password invalid password fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent.put('/user/update/password').send({
      old_password: 'INVALID',
      new_password: 'bryan123',
    });
    expect(response.status).toEqual(400);
  });

  it('Update user password empty request fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent.put('/user/update/password').send({});
    expect(response.status).toEqual(400);
  });

  it('Update user password duplicate password fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent.put('/user/update/password').send({
      old_password: userData.password,
      new_password: userData.password,
    });
    expect(response.status).toEqual(400);
  });

  it('Follow succeeds with public users', async () => {
    const agent = request.agent(app);
    const savedUser1 = await new UserModel(userData1).save();
    const savedUser2 = await new UserModel(userData2).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.put('/user/follow/').send({
      followee_username: userData2.username,
    });
    const user = await UserModel.findById(savedUser1._id);
    expect(response.status).toEqual(200);
    expect(response.body.follow_status).toEqual('followed');
    expect(user.followed_users).toEqual(
      expect.arrayContaining([savedUser2._id]),
    );
  });

  it('Follow unfollow succeeds with public users', async () => {
    const agent = request.agent(app);
    const savedUser2 = await new UserModel(userData2).save();
    const validUser1 = new UserModel(userData1);
    validUser1.followed_users = [savedUser2._id];
    const savedUser1 = await validUser1.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.put('/user/follow/').send({
      followee_username: userData2.username,
    });
    const user = await UserModel.findById(savedUser1._id);
    expect(response.status).toEqual(200);
    expect(response.body.follow_status).toEqual('unfollowed');
    expect(user.followed_users).toHaveLength(0);
  });

  it('Follow pending follow succeeds with private user', async () => {
    const agent = request.agent(app);
    const savedUser1 = await new UserModel(userData1).save();
    const validUser2 = new UserModel(userData2);
    validUser2.public = false;
    const savedUser2 = await validUser2.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.put('/user/follow/').send({
      followee_username: userData2.username,
    });
    const user1 = await UserModel.findById(savedUser1._id);
    const user2 = await UserModel.findById(savedUser2._id);
    expect(response.status).toEqual(200);
    expect(response.body.follow_status).toEqual('pending');
    expect(user1.followed_users).toHaveLength(0);
    expect(user2.pending_followers).toEqual(
      expect.arrayContaining([savedUser1._id]),
    );
  });

  it('Follow canceling pending follow succeeds with private user', async () => {
    const agent = request.agent(app);
    const savedUser1 = await new UserModel(userData1).save();
    const validUser2 = new UserModel(userData2);
    validUser2.public = false;
    validUser2.pending_followers = [savedUser1._id];
    const savedUser2 = await validUser2.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.put('/user/follow/').send({
      followee_username: userData2.username,
    });
    const user1 = await UserModel.findById(savedUser1._id);
    const user2 = await UserModel.findById(savedUser2._id);
    expect(response.status).toEqual(200);
    expect(response.body.follow_status).toEqual('unfollowed');
    expect(user1.followed_users).toHaveLength(0);
    expect(user2.pending_followers).toHaveLength(0);
  });

  it('Follow with empty request fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData1).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.put('/user/follow/').send({});
    expect(response.status).toEqual(400);
  });

  it('Follow with non-existent user fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData1).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.put('/user/follow/').send({
      followee_username: userData2.username,
    });
    expect(response.status).toEqual(400);
  });

  it('Handle_follower_request accept pending follow succeeds with private user', async () => {
    const agent = request.agent(app);
    const savedUser2 = await new UserModel(userData2).save();
    const validUser1 = new UserModel(userData1);
    validUser1.public = false;
    validUser1.pending_followers = [savedUser2._id];
    const savedUser1 = await validUser1.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.post('/user/handle_follower_request/').send({
      follower_username: userData2.username,
      request_status: true,
    });
    const user1 = await UserModel.findById(savedUser1._id);
    const user2 = await UserModel.findById(savedUser2._id);
    expect(response.status).toEqual(200);
    expect(user1.pending_followers).toHaveLength(0);
    expect(user2.followed_users).toEqual(
      expect.arrayContaining([savedUser1._id]),
    );
  });

  it('Handle_follower_request decline pending follow succeeds with private user', async () => {
    const agent = request.agent(app);
    const savedUser2 = await new UserModel(userData2).save();
    const validUser1 = new UserModel(userData1);
    validUser1.public = false;
    validUser1.pending_followers = [savedUser2._id];
    const savedUser1 = await validUser1.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.post('/user/handle_follower_request/').send({
      follower_username: userData2.username,
      request_status: false,
    });
    const user1 = await UserModel.findById(savedUser1._id);
    const user2 = await UserModel.findById(savedUser2._id);
    expect(response.status).toEqual(200);
    expect(user1.pending_followers).toHaveLength(0);
    expect(user2.followed_users).toHaveLength(0);
  });

  it('Handle_follower_request user not a pending follower fails', async () => {
    const agent = request.agent(app);
    const validUser1 = new UserModel(userData1);
    validUser1.public = false;
    await validUser1.save();
    await new UserModel(userData2).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.post('/user/handle_follower_request/').send({
      follower_username: userData2.username,
      request_status: false,
    });
    expect(response.status).toEqual(400);
  });

  it('Handle_follower_request user does not exist fails', async () => {
    const agent = request.agent(app);
    const validUser1 = new UserModel(userData1);
    validUser1.public = false;
    await validUser1.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.post('/user/handle_follower_request/').send({
      follower_username: userData2.username,
      request_status: false,
    });
    expect(response.status).toEqual(400);
  });

  it('Handle_follower_request empty request fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData1).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent
      .post('/user/handle_follower_request/')
      .send({});
    expect(response.status).toEqual(400);
  });

  it('Follow_status with followed user succeeds', async () => {
    const agent = request.agent(app);
    const savedUser2 = await new UserModel(userData2).save();
    const validUser1 = new UserModel(userData1);
    validUser1.followed_users = [savedUser2._id];
    await validUser1.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.get('/user/follow_status/').query({
      followee_username: userData2.username,
    });
    expect(response.status).toEqual(200);
    expect(response.body.follow_status).toEqual('followed');
  });

  it('Follow_status with pending user succeeds', async () => {
    const agent = request.agent(app);
    const savedUser1 = await new UserModel(userData1).save();
    const validUser2 = new UserModel(userData2);
    validUser2.public = false;
    validUser2.pending_followers = [savedUser1._id];
    await validUser2.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.get('/user/follow_status/').query({
      followee_username: userData2.username,
    });
    expect(response.status).toEqual(200);
    expect(response.body.follow_status).toEqual('pending');
  });

  it('Follow_status with same user public succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData1).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.get('/user/follow_status/').query({
      followee_username: userData1.username,
    });
    expect(response.status).toEqual(200);
    expect(response.body.visibility).toEqual(true);
  });

  it('Follow_status with same user private succeeds', async () => {
    const agent = request.agent(app);
    const validUser1 = new UserModel(userData1);
    validUser1.public = false;
    await validUser1.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.get('/user/follow_status/').query({
      followee_username: userData1.username,
    });
    expect(response.status).toEqual(200);
    expect(response.body.visibility).toEqual(false);
  });

  it('Follow_status with unfollowed user succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData1).save();
    await new UserModel(userData2).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.get('/user/follow_status/').query({
      followee_username: userData2.username,
    });
    expect(response.status).toEqual(200);
    expect(response.body.follow_status).toEqual('unfollowed');
  });

  it('Follow_status with empty request fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData1).save();
    await new UserModel(userData2).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.get('/user/follow_status/');
    expect(response.status).toEqual(400);
  });

  it('Pending_followers with no pending succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData1).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.get('/user/pending_followers/');
    expect(response.status).toEqual(200);
    expect(response.body.pending_followers).toHaveLength(0);
  });

  it('Pending_followers with pending succeeds', async () => {
    const agent = request.agent(app);
    const savedUser2 = await new UserModel(userData2).save();
    const validUser1 = new UserModel(userData1);
    validUser1.pending_followers = [savedUser2._id];
    await validUser1.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.get('/user/pending_followers/');
    expect(response.status).toEqual(200);
    expect(response.body.pending_followers).toHaveLength(1);
  });

  it('Visibility with public user succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData1).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.get('/user/visibility/');
    expect(response.status).toEqual(200);
    expect(response.body.visibility).toEqual(false);
  });

  it('Visibility with private user succeeds', async () => {
    const agent = request.agent(app);
    const validUser1 = new UserModel(userData1);
    validUser1.public = false;
    await validUser1.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.get('/user/visibility/');
    expect(response.status).toEqual(200);
    expect(response.body.visibility).toEqual(true);
  });

  it('Visibility with private user with pending users succeeds', async () => {
    const agent = request.agent(app);
    const savedUser2 = await new UserModel(userData2).save();
    const validUser1 = new UserModel(userData1);
    validUser1.public = false;
    validUser1.pending_followers = [savedUser2._id];
    const savedUser1 = await validUser1.save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const response = await agent.get('/user/visibility/');
    const user1 = await UserModel.findById(savedUser1._id);
    const user2 = await UserModel.findById(savedUser2._id);
    expect(response.status).toEqual(200);
    expect(response.body.visibility).toEqual(true);
    expect(user1.pending_followers).toHaveLength(0);
    expect(user2.followed_users).toEqual(
      expect.arrayContaining([savedUser1._id]),
    );
  });
});
