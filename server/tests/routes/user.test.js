const mongoose = require('mongoose');
const app = require('../../server');
const request = require('supertest');
const UserModel = require('../../models/user');
const user = require('../../models/user');


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


describe('User Endpoint Test', () => {
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

    afterAll(async () => {
        await mongoose.connection.close();
    });


    //Test for creating a new user.
    it('Create User', async () => {
        const agent = request.agent(app);
        const response = await agent
            .post('/user/register/')
            .send(
                userData
            )
        expect(response.status).toEqual(200);
    });

    // //Test for creating a user that already exist.
    it('Failed Create User', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
		const response = await agent
            .post('/user/register/')
            .send(
                userData
            )
		expect(response.status).toEqual(400);
    });

    //Valid user Login
    it('Login Endpoint', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        const login = await agent
            .post('/user/login')
            .send({
                email: userData.email,
                password: userData.password,
            })
        expect(login.status).toEqual(200);
    });

    //Testing logout endpoint
    it('Logout Endpoint', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        const login = await agent
            .post('/user/login')
            .send({
                email: userData.email,
                password: userData.password,
            })
        const logout = await agent
            .get('/user/logout')
        expect(logout.status).toEqual(200);
    });

    it('Logout Endpoint After No Login', async () => {
        const agent = request.agent(app);
        const logout = await agent
            .get('/user/logout')
        expect(logout.status).toEqual(401);
    });

    it('Authenticated Endpoint', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        const login = await agent
            .post('/user/login')
            .send({
                email: userData.email,
                password: userData.password,
            })
        const auth = await agent
            .get('/user/authenticated')
            .send(
                userData
            )
        expect(auth.status).toEqual(200);
    });

    it('Not authenticated', async () => {
        const agent = request.agent(app);
        const auth = await agent
            .get('/user/authenticated')
        expect(auth.status).toEqual(401);
    });

    it('Logout No Longer Authenticated Endpoint', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        const login = await agent
            .post('/user/login')
            .send({
                email: userData.email,
                password: userData.password,
            })
        const logout = await agent
            .get('/user/logout')
        const auth = await agent
            .get('/user/authenticated')
            .send(
                userData
            )
        expect(auth.status).toEqual(401);
    });

    it('Exists Endpoint With Existing User', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        const login = await agent
        .post('/user/login')
        .send({
            email: userData.email,
            password: userData.password,
        })
        const auth = await agent
            .get('/user/exists/'+validUser.username)
        expect(auth.status).toEqual(200);
    });

    it('Exists Endpoint With Existing User', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();

        const auth = await agent
            .get('/user/exists/'+validUser.username+"testser")
        expect(auth.status).toEqual(401);
    });

    it('Update User Info Endpoint', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        const login = await agent
        .post('/user/login')
        .send({
            email: userData.email,
            password: userData.password,
        })
        savedUser.username = 'timmy12';
        const update = await agent
            .put('/user/update/info')
            .send(savedUser._id)
        expect(update.status).toEqual(200);
    });

    it('Update User Info Endpoint', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        const login = await agent
        .post('/user/login')
        .send({
            email: userData.email,
            password: userData.password,
        })
        savedUser.username = 'timmy12';
        const update = await agent
            .put('/user/update/info')
            .send(savedUser._id)
        expect(update.status).toEqual(200);
    });

    it('Update User Info Not Authorized Endpoint', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();

        savedUser.username = 'timmy12';
        const update = await agent
            .put('/user/update/info')
            .send(savedUser._id)
        expect(update.status).toEqual(401);
    });

    it('Update User Password Endpoint', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        const login = await agent
        .post('/user/login')
        .send({
            email: userData.email,
            password: userData.password,
        })
        const update = await agent
            .put('/user/update/password')
            .send({
                old_password: userData.password,
                new_password: 'bryan123',
                new_password_confirmed: 'bryan123',
            })
        expect(update.status).toEqual(200);
    });

    it('Update User Password Invalid Password Endpoint', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        const login = await agent
        .post('/user/login')
        .send({
            email: userData.email,
            password: userData.password,
        })
        const update = await agent
            .put('/user/update/password')
            .send({
                old_password: 'HELLO WORLD',
                new_password: 'bryan123',
                new_password_confirmed: 'bryan123',
            })
        expect(update.status).toEqual(500);
    });

    it('Update User Password Invalid Duplicate Password Endpoint', async () => {
        const agent = request.agent(app);
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();
        const login = await agent
        .post('/user/login')
        .send({
            email: userData.email,
            password: userData.password,
        })
        const update = await agent
            .put('/user/update/password')
            .send({
                old_password: userData.password,
                new_password: userData.password,
                new_password_confirmed: userData.new_password,
            })
        expect(update.status).toEqual(500);
    });
});