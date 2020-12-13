const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../server');
const routeHelpers = require('../../routes/helpers');
const modelHelpers = require('../../models/helpers');
const UserModel = require('../../models/user');
const Post = require('../../models/post');

const userData = {
  username: 'username',
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

const postData = {
  title: 'title',
  message: 'message',
  attachments: ['attachment.txt'],
  user: mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
  tags: ['tag'],
  timestamp: new Date(),
  username: 'username',
};

describe('Post Route Test', () => {
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

  it('Create a post without file successfully', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const uploadFileStub = jest
      .spyOn(routeHelpers, 'uploadFile')
      .mockImplementation();
    const response = await agent.post('/post/create/').send(basicPostData);
    const post = await Post.findOne({ username: userData.username });
    expect(uploadFileStub).toHaveBeenCalledTimes(0);
    expect(response.status).toEqual(200);
    expect(post.title).toEqual(basicPostData.title);
    expect(post.message).toEqual(basicPostData.message);
    expect(post.tags).toEqual(expect.objectContaining([basicPostData.tags]));
  });

  it('Create a post with attachment successfully', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const uploadFileStub = jest
      .spyOn(routeHelpers, 'uploadFile')
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
    expect(post.tags).toEqual(expect.objectContaining([basicPostData.tags]));
  });

  it('Create an empty post fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const uploadFileStub = jest
      .spyOn(routeHelpers, 'uploadFile')
      .mockImplementation();
    const response = await agent.post('/post/create/').send({});
    const post = await Post.findOne({ username: userData.username });
    expect(uploadFileStub).toHaveBeenCalledTimes(0);
    expect(response.status).toEqual(400);
    expect(post).toBeNull();
  });

  it('Create an invalid post fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const uploadFileStub = jest
      .spyOn(routeHelpers, 'uploadFile')
      .mockImplementation();
    const invalidPostData = basicPostData;
    invalidPostData.title = ['invalid', 'title'];
    const response = await agent.post('/post/create/').send(invalidPostData);
    const post = await Post.findOne({ username: userData.username });
    expect(uploadFileStub).toHaveBeenCalledTimes(0);
    expect(response.status).toEqual(400);
    expect(post).toBeNull();
  });

  it('Delete a post succeeds', async () => {
    const agent = request.agent(app);
    const user = await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const unsavedPost = new Post(postData);
    unsavedPost.user = user;
    const savedPost = await unsavedPost.save();
    jest.spyOn(modelHelpers, 'deleteAttachment').mockImplementation();
    const response = await agent
      .post('/post/delete/')
      .send({ id: savedPost._id });
    const post = await Post.findById(savedPost._id);
    expect(response.status).toEqual(200);
    expect(post).toBeNull();
  });

  it('Delete a post fails if not created by same user', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const unsavedPost = new Post(postData);
    const savedPost = await unsavedPost.save();
    jest.spyOn(modelHelpers, 'deleteAttachment').mockImplementation();
    const response = await agent
      .post('/post/delete/')
      .send({ id: savedPost._id });
    const post = await Post.findById(savedPost._id);
    expect(response.status).toEqual(400);
    expect(post.title).toEqual(postData.title);
    expect(post.message).toEqual(postData.message);
    expect(post.tags).toEqual(expect.objectContaining(postData.tags));
  });

  it('Delete nonexistent post fails', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    jest.spyOn(modelHelpers, 'deleteAttachment').mockImplementation();
    const response = await agent
      .post('/post/delete/')
      .send({ id: 'nonexistent' });
    expect(response.status).toEqual(400);
  });

  it('Get empty posts succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const response = await agent.get(`/post/view/${userData.username}`);
    expect(response.status).toEqual(200);
    expect(response.body.results).toHaveLength(0);
  });

  it('Get posts succeeds', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    const unsavedPost = new Post(postData);
    unsavedPost.username = userData.username;
    await unsavedPost.save();
    const response = await agent.get(`/post/view/${userData.username}`);
    expect(response.status).toEqual(200);
    expect(response.body.results).toHaveLength(1);
  });

  it('Feed succeeds for anonymous user', async () => {
    const agent = request.agent(app);
    await new Post(postData).save();
    const response = await agent.get('/post/feed');
    expect(response.status).toEqual(200);
    expect(response.body.results).toHaveLength(1);
  });

  it('Feed succeeds for user with followees', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    await new Post(postData).save();
    const response = await agent.get('/post/feed');
    expect(response.status).toEqual(200);
    expect(response.body.results).toHaveLength(1);
  });

  it('Feed succeeds for user without followees', async () => {
    const agent = request.agent(app);
    const unsavedUser = new UserModel(userData);
    unsavedUser.followed_users = [];
    await unsavedUser.save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    await new Post(postData).save();
    const response = await agent.get('/post/feed');
    expect(response.status).toEqual(200);
    expect(response.body.results).toHaveLength(0);
  });

  it('Discovery succeeds for anonymous user', async () => {
    const agent = request.agent(app);
    await new Post(postData).save();
    const response = await agent.get('/post/discovery');
    expect(response.status).toEqual(200);
    expect(response.body.results).toHaveLength(1);
  });

  it('Discovery succeeds for user', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    await new Post(postData).save();
    const response = await agent.get('/post/discovery');
    expect(response.status).toEqual(200);
    expect(response.body.results).toHaveLength(1);
  });

  it('Discovery succeeds for user with tags', async () => {
    const agent = request.agent(app);
    await new UserModel(userData).save();
    await agent.post('/user/login').send({
      email: userData.email,
      password: userData.password,
    });
    await new Post(postData).save();
    const response = await agent
      .get('/post/discovery')
      .query({ tags: postData.tags[0] });
    expect(response.status).toEqual(200);
    expect(response.body.results).toHaveLength(1);
  });
});
