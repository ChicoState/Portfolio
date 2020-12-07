const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    const { collections } = mongoose.connection;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
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
  // Valid user creation
  it('Create and save user successfully', async () => {
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.role).toBe(userData.role);
    expect(savedUser.first_name).toBe(userData.first_name);
    expect(savedUser.middle_name).toBe(userData.middle_name);
    expect(savedUser.last_name).toBe(userData.last_name);
    expect(savedUser.public).toBe(userData.public);
    expect(savedUser.followed_users).toEqual(
      expect.objectContaining(userData.followed_users),
    );
    expect(savedUser.pending_followers).toEqual(
      expect.objectContaining(userData.pending_followers),
    );
    expect(bcrypt.compareSync(userData.password, savedUser.password)).toBe(
      true,
    );
  });

  
});




// const mongoose = require('mongoose');
// const app = require('../../server'); // Link to your server file
// const supertest = require('supertest');
// const bcrypt = require('bcryptjs');
// const request = supertest(app);

// const UserModel = require('../../models/user');
// //const user = require('../../models/user');

// const userData = {
//     username: 'testuser',
//     email: 'test@nuts.com',
//     password: 'password',
//     role: 'user',
//     first_name: 'Poo',
//     middle_name: 'Doggy',
//     last_name: 'Dog',
//     public: true,
//     followed_users: [mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa')],
//     pending_followers: [mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa')],
//   };
  


// // const postData = {
// //   title: 'title',
// //   message: 'message',
// //   attachments: ['attachment.txt'],
// //   user: mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
// //   tags: ['tag'],
// //   timestamp: new Date(),
// //   username: 'username',
// // };

// describe('Post Endpoints', () => {
//     beforeAll(async () => {
//         await mongoose.connect(
//           global.__MONGO_URI__,
//           {
//             useNewURLParser: true,
//             useUnifiedTopology: true,
//             useCreateIndex: true,
//           },
//           (err) => {
//             if (err) {
//               console.error(err);
//               process.exit(1);
//             }
//           },
//         );
//       });
    
//       afterAll(async () => {
//         mongoose.connection.close();
//       });

// //    const user2 = req.agent()
// //    user2
// //       .post('/user/login')
// //       .send({
// //           email: 'tom1@gmail.com',
// //           password: 'tom1',
// //       })
// //       .end(function(err,res){
// //         //print(res);
// //       })
//   //should expect a 401 error because a non user is making a post. 
//   //need to mock out 1 user to test with
// //   it('Should create post',  async done => {
// //     const user1 = new UserModel(userData).save();
// //     const login = await request
// //         .post('/user/login')
// //         .send({
// //             email: 'test@nuts.com',
// //             password: 'password',
// //         })
// //     const response = await request
// //         .post('/post/create')
// //         .send({  
// //         title: 'title',
// //         message: 'message',
// //         attachments: ['attachment.txt'],
// //         user:login,
// //         tags: ['tag'],
// //         timestamp: new Date(),
// //         username: 'username',})
// //     expect(response).toEqual(401);
// //     done();
// //   });

//   //Gets a list of the feed. Since it's a json return 
//   //I just read it as text to check the data
// //   it('Should get post',  async done => {
// //     const response = await request
// //         .get('/post/feed')
// //     expect(response.text).toMatch('hasNext');
// //     done();
// //   });

// //   it('Should get user post',  async done => {
// //     console.log('BLUE JEANS');
// //     const nu =  new UserModel(userData);
// //     console.log('ripping out');
// //     const nubigallu = await nu.save();
// //     console.log(nubigallu);
// //     console.log('PPPPPOOOOOOOOOOOOOOOOOPPPP');
// //     const response = await request
// //         .get('/post/'+user1.username)
// //     expect(response).toMatch('hasNext');
// //     done();
// //   });
// it('Create and save user successfully', async () => {
//     const validUser = new UserModel(userData);
//     const savedUser = await validUser.save();
//     expect(savedUser._id).toBeDefined();
//     expect(savedUser.username).toBe(userData.username);
//     expect(savedUser.email).toBe(userData.email);
//     expect(savedUser.role).toBe(userData.role);
//     expect(savedUser.first_name).toBe(userData.first_name);
//     expect(savedUser.middle_name).toBe(userData.middle_name);
//     expect(savedUser.last_name).toBe(userData.last_name);
//     expect(savedUser.public).toBe(userData.public);
//     expect(savedUser.followed_users).toEqual(
//       expect.objectContaining(userData.followed_users),
//     );
//     expect(savedUser.pending_followers).toEqual(
//       expect.objectContaining(userData.pending_followers),
//     );
//     expect(bcrypt.compareSync(userData.password, savedUser.password)).toBe(
//       true,
//     );
//   });

// });
