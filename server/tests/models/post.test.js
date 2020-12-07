const mongoose = require('mongoose');
const Post = require('../../models/post');
const helpers = require('../../models/helpers');

const postData = {
  title: 'title',
  message: 'message',
  attachments: ['attachment.txt'],
  user: mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
  tags: ['tag'],
  timestamp: new Date(),
  username: 'username',
};

const invalidPostData = {
  title: 'title',
  message: 'message',
  attachments: ['attachment.txt'],
  user: mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
  tags: ['tag'],
  timestamp: new Date(),
  username: 'username',
  invalid: 'INVALID',
};

const PostDataWithoutUser = {
  title: 'title',
  message: 'message',
  attachments: ['attachment.txt'],
  tags: ['tag'],
  timestamp: new Date(),
  username: 'username',
  invalid: 'INVALID',
};

describe('Post Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(
      global.__MONGO_URI__,
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
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

  it('Create and save post successfully', async () => {
    const validPost = new Post(postData);
    const savedPost = await validPost.save();
    expect(savedPost._id).toBeDefined();
    expect(savedPost.title).toBe(postData.title);
    expect(savedPost.message).toBe(postData.message);
    expect(savedPost.attachments).toEqual(
      expect.objectContaining(postData.attachments),
    );
    expect(savedPost.user).toBe(postData.user);
    expect(savedPost.tags).toEqual(expect.objectContaining(postData.tags));
    expect(savedPost.timestamp).toBe(postData.timestamp);
    expect(savedPost.username).toBe(postData.username);
  });

  it('Insert post successfully, but fields not in schema should be undefined', async () => {
    const postWithInvalidField = new Post(invalidPostData);
    const savedPostWithInvalidField = await postWithInvalidField.save();
    expect(savedPostWithInvalidField.invalid).toBeUndefined();
  });

  it('Create post without required user field should fail', async () => {
    const postWithoutUser = new Post(PostDataWithoutUser);
    let err;
    try {
      await postWithoutUser.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.user).toBeDefined();
  });

  it('Delete post with unique attachment should delete attachment', async () => {
    const validPost = new Post(postData);
    const savedPost = await validPost.save();
    const deleteAttachmentStub = jest
      .spyOn(helpers, 'deleteAttachment')
      .mockImplementation();
    deleteAttachmentStub.mockClear();
    await savedPost.delete();
    expect(deleteAttachmentStub).toHaveBeenCalledTimes(1);
  });

  it('Delete post with non-unique attachment should not delete attachment', async () => {
    const validPost = new Post(postData);
    const savedPost = await validPost.save();
    await new Post(postData).save();
    const deleteAttachmentStub = jest
      .spyOn(helpers, 'deleteAttachment')
      .mockImplementation();
    deleteAttachmentStub.mockClear();
    await savedPost.delete();
    expect(deleteAttachmentStub).toHaveBeenCalledTimes(0);
  });
});
