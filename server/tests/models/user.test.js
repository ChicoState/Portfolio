const mongoose = require('mongoose');
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
    savedUser.comparePassword(userData.password, (err, isMatch) => {
      expect(err).toBeFalsy();
      expect(isMatch).toBeTruthy();
    });
  });

  it('User with only strictly necessary fields', async () => {
    const bareData = {
      username: 'barebones',
      email: 'b@mail.com',
      password: 'password',
      role: 'user',
    };
    const validUser = new UserModel(bareData);
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(bareData.username);
    expect(savedUser.email).toBe(bareData.email);
    expect(savedUser.role).toBe(bareData.role);
    savedUser.comparePassword(bareData.password, (err, isMatch) => {
      expect(err).toBeFalsy();
      expect(isMatch).toBeTruthy();
    });
  });

  it('User missing a username', async () => {
    const invalidUser = new UserModel({
      email: 'b@mail.com',
      password: 'password',
      role: 'user',
    });
    let err;
    try {
      await invalidUser.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.username).toBeDefined();
  });

  it('Two users with the same username', async () => {
    const validData = {
      username: 'copy',
      email: 'copy@mail.com',
      password: 'password',
      role: 'user',
    };
    const validUser = new UserModel(validData);
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validData.username);
    expect(savedUser.email).toBe(validData.email);
    expect(savedUser.role).toBe(validData.role);
    savedUser.comparePassword(validData.password, (err, isMatch) => {
      expect(err).toBeFalsy();
      expect(isMatch).toBeTruthy();
    });
    const copyUser = new UserModel(validData);
    let err;
    try {
      await copyUser.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('User with non-existent field', async () => {
    const extraData = {
      username: 'extra',
      email: 'extra@mail.com',
      password: 'password',
      role: 'user',
      job: 'useles',
    };
    const validUser = new UserModel(extraData);
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(extraData.username);
    expect(savedUser.email).toBe(extraData.email);
    expect(savedUser.role).toBe(extraData.role);
    savedUser.comparePassword(extraData.password, (err, isMatch) => {
      expect(err).toBeFalsy();
      expect(isMatch).toBeTruthy();
    });
    expect(savedUser.job).toBeUndefined();
  });
});
