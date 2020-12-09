const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../server');
const UserModel = require('../../models/user');

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

  afterAll(async () => {
    mongoose.connection.close();
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

  it('Create two users, check follow_status succeeded', async () => {
    const agent = request.agent(app);
    await new UserModel(userData1).save();
    await new UserModel(userData2).save();
    await agent.post('/user/login').send({
      email: userData1.email,
      password: userData1.password,
    });
    const followStatusResponse = await agent
    .get('/user/follow_status/')
    .query({
      followee_username: userData2.username,
    });
    expect(followStatusResponse.status).toEqual(200);
  });
});
