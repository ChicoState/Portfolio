const mongoose = require('mongoose');
const UserModel = require('../../models/user');
const bcrypt = require('bcryptjs');
const userData = { username: 'testuser',  email: 'test@nuts.com', 
    password: 'password', role: 'user', first_name: "Poo", middle_name: 'Doggy', 
    last_name: 'Dog', public: true, followed_users: [mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa')],
    pending_followers: [mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa')] };

describe('User Model Test',  () => {

    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewURLParser: true, useUnifiedTopology: true,
            useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    afterAll(async () => {
        mongoose.connection.close();
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
        expect(savedUser.followed_users).toEqual(expect.objectContaining(userData.followed_users));
        expect(savedUser.pending_followers).toEqual(expect.objectContaining(userData.pending_followers));
        expect(bcrypt.compareSync(userData.password, savedUser.password)).toBe(true);
    });



});