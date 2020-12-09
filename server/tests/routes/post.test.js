const mongoose = require('mongoose');
const app = require('../../server'); // Link to your server file
const request = require('supertest');
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

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(
      global.__MONGO_URI__,
      {
        useNewURLParser: true,
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

//   // Valid user creation
//   it('Create and save user successfully', async () => {
//     const agent = request.agent(app);
//     const validUser = new UserModel(userData);
//     const savedUser = await validUser.save();
//     const login = await agent
//     .post('/user/login')
//     .send({
//         email: userData.email,
//         password: userData.password,
//     })
//     /*
//     const response = await agent
//         .post('/post/create')
//         .send({  
//         title: 'title',
//         message: 'message',
//         attachments: ['attachment.txt'],
//         user: savedUser,
//         tags: ['tag'],
//         timestamp: new Date(),
//         username: savedUser.username,})
//         */
//     const response = await agent
//         .get('/post/view/' + userData.username)
//     //console.log(response);
//     expect(response.status).toEqual(200);
//   });

});