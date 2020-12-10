const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../server');
const helpers = require('../../routes/helpers');
const UserModel = require('../../models/user');
const Post = require('../../models/post');

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

const basicPostData = {
  title: 'title',
  message: 'message',
  tags: 'tag',
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

  it('Create a post without file successfully', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const uploadFileStub = jest
      .spyOn(helpers, 'uploadFile')
      .mockImplementation();
    const response = await agent.post('/post/create/').send(basicPostData);
    const post = await Post.findOne({ username: userData.username });
    expect(uploadFileStub).toHaveBeenCalledTimes(0);
    expect(response.status).toEqual(200);
    expect(post.title).toEqual(basicPostData.title);
    expect(post.message).toEqual(basicPostData.message);
    expect(post.tags[0]).toEqual(basicPostData.tags);
  });

  it('Create a post with attachment successfully', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const uploadFileStub = jest
      .spyOn(helpers, 'uploadFile')
      .mockImplementation();
    const response = await agent
      .post('/post/create/')
      .type('form')
      .field('title', basicPostData.title)
      .field('message', basicPostData.message)
      .field('tags', basicPostData.tags)
      .attach(
        'attachment',
        Buffer.from('a'.repeat(10000000)),
        'attachment.txt',
      );
    const post = await Post.findOne({ username: userData.username });
    expect(uploadFileStub).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(200);
    expect(post.title).toEqual(basicPostData.title);
    expect(post.message).toEqual(basicPostData.message);
    expect(post.tags[0]).toEqual(basicPostData.tags);
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
