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

describe('Post Route Test', () => {
  let server;
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
    server = app.listen(3001);
  });

  afterAll(async () => {
    mongoose.connection.close();
    server.close();
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

  it('Get all posts successfully', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent.get(`/post/view/${userData.username}`);
    expect(response.status).toEqual(200);
  });
});
