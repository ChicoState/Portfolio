const mongoose = require('mongoose');
const Post = require('../../models/post');
const postData = {title: 'title', message: 'message', attachments: ['attachment.txt'], user: mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'), tags: ['tag'], timestamp: new Date(), username: 'username'};
const invalidPostData = {title: 'title', message: 'message', attachments: ['attachment.txt'], user: mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'), tags: ['tag'], timestamp: new Date(), username: 'username', invalid: 'INVALID'};
const PostDataWithoutUser = {title: 'title', message: 'message', attachments: ['attachment.txt'], tags: ['tag'], timestamp: new Date(), username: 'username', invalid: 'INVALID'};

describe('Post Model Test', () => {

    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    afterAll(async () => {
        mongoose.connection.close();
    });

    it('Create and save post successfully', async () => {
        const validPost = new Post(postData);
        const savedPost = await validPost.save();
        expect(savedPost._id).toBeDefined();
        expect(savedPost.title).toBe(postData.title);
        expect(savedPost.message).toBe(postData.message);
        expect(savedPost.attachments).toEqual(expect.objectContaining(postData.attachments));
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
            const savedPostWithoutUser = await postWithoutUser.save();
            error = savedPostWithoutUser;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.user).toBeDefined();
    }); 
})