// const mongoose = require('mongoose');
// const app = require('../../server'); // Link to your server file
// const request = require('supertest');
// const UserModel = require('../../models/user');

// const userData1 = {
//   username: 'user1',
//   email: 'one@gmail.com',
//   password: 'password',
//   role: 'user',
//   first_name: 'Poo',
//   middle_name: 'Doggy',
//   last_name: 'Dog',
//   public: true,
//   followed_users: [],
//   pending_followers: [],
// };

// const userData2 = {
//   username: 'user2',
//   email: 'two@gmail.com',
//   password: 'password',
//   role: 'user',
//   first_name: 'Grant',
//   middle_name: 'Luke',
//   last_name: 'McDonald',
//   public: true,
//   followed_users: [],
//   pending_followers: [],
// };

// describe('User Model Test', () => {
//   beforeAll(async () => {
//     await mongoose.connect(
//       global.__MONGO_URI__,
//       {
//         useNewURLParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//       },
//       (err) => {
//         if (err) {
//           console.error(err);
//           process.exit(1);
//         }
//       },
//     );
//   });

//   afterAll(async () => {
//     mongoose.connection.close();
//   });

//   afterEach(async () => {
//     // Clear all mock calls after every test
//     jest.clearAllMocks();

//     // Clear all database data after every test
//     const { collections } = mongoose.connection;
//     for (const key in collections) {
//       const collection = collections[key];
//       await collection.deleteMany();
//     }
//   });

//   it('Create two users, check follow_status succeeded', async () => {
//       const agent = request.agent(app);
//       const validUser1 = new UserModel(userData1);
//       const savedUser1 = await validUser1.save();
//       const login = await agent.post('/user/login')
//       .send({email: userData1.email, password: userData1.password});

//       const followStatusResponse = await agent.get('/user/follow_status')
//       .send({followee_username: userData2.username})
//       //console.log(followStatusResponse);
//       expect(followStatusResponse.status).toEqual(200);
//   });

// });