const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../server');
const UserModel = require('../../models/user');

const userData = {
  username: 'testuser',
  email: 'test@nuts.com',
  password: 'password',
  role: 'user',
  first_name: 'Poo',
  middle_name: 'Doggy',
  last_name: 'Dog',
  public: true,
  followed_users: [mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa')],
  pending_followers: [mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa')],
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

describe('User Endpoint Test', () => {
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

  // Test for creating a new user.
  it('Create User', async () => {
    const agent = request.agent(app);
    const response = await agent.post('/user/register/').send(userData);
    expect(response.status).toEqual(200);
  });

  // //Test for creating a user that already exist.
  it('Failed Create User', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    const response = await agent.post('/user/register/').send(userData);
    expect(response.status).toEqual(400);
  });

  // Valid user Login
  it('Login Endpoint', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    const login = await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    expect(login.status).toEqual(200);
  });

  // Testing logout endpoint
  it('Logout Endpoint', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const logout = await agent.get('/user/logout');
    expect(logout.status).toEqual(200);
  });

  it('Logout Endpoint After No Login', async () => {
    const agent = request.agent(app);
    const logout = await agent.get('/user/logout');
    expect(logout.status).toEqual(401);
  });

  it('Authenticated Endpoint', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const auth = await agent.get('/user/authenticated').send(userData);
    expect(auth.status).toEqual(200);
  });

  it('Not authenticated', async () => {
    const agent = request.agent(app);
    const auth = await agent.get('/user/authenticated');
    expect(auth.status).toEqual(401);
  });

  it('Logout No Longer Authenticated Endpoint', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    await agent.get('/user/logout');
    const auth = await agent.get('/user/authenticated').send(userData);
    expect(auth.status).toEqual(401);
  });

  it('Exists Endpoint With Existing User', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const auth = await agent.get(`/user/exists/${userData.username}`);
    expect(auth.status).toEqual(200);
  });

  it('Exists Endpoint With Existing User', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    const auth = await agent.get(`/user/exists/${userData.username}testser`);
    expect(auth.status).toEqual(401);
  });

  it('Update User Info Endpoint', async () => {
    const agent = request.agent(app);
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    savedUser.username = 'timmy12';
    const update = await agent.put('/user/update/info').send(savedUser._id);
    expect(update.status).toEqual(200);
  });

  it('Update User Info Endpoint', async () => {
    const agent = request.agent(app);
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    savedUser.username = 'timmy12';
    const update = await agent.put('/user/update/info').send(savedUser._id);
    expect(update.status).toEqual(200);
  });

  it('Update User Info Not Authorized Endpoint', async () => {
    const agent = request.agent(app);
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();
    savedUser.username = 'timmy12';
    const update = await agent.put('/user/update/info').send(savedUser._id);
    expect(update.status).toEqual(401);
  });

  it('Update User Password Endpoint', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const update = await agent.put('/user/update/password').send({
      old_password: userData.password,
      new_password: 'bryan123',
      new_password_confirmed: 'bryan123',
    });
    expect(update.status).toEqual(200);
  });

  it('Update User Password Invalid Password Endpoint', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const update = await agent.put('/user/update/password').send({
      old_password: 'HELLO WORLD',
      new_password: 'bryan123',
      new_password_confirmed: 'bryan123',
    });
    expect(update.status).toEqual(500);
  });

  it('Update User Password Invalid Duplicate Password Endpoint', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const update = await agent.put('/user/update/password').send({
      old_password: userData.password,
      new_password: userData.password,
      new_password_confirmed: userData.new_password,
    });
    expect(update.status).toEqual(500);
  });

  it('Create two users, check follow_status succeeded', async () => {
    const agent = request.agent(app);
    await new UserModel(userData1).save();
    await new UserModel(userData2).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const followStatusResponse = await agent.get('/user/follow_status/').query({
      followee_username: userData2.username,
    });
    expect(followStatusResponse.status).toEqual(200);
  });
});