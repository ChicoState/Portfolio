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
        //console.log("PASSED 1");
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
		//console.log("PASSED 2");
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
        //console.log("PASSED 3");
        expect(login.status).toEqual(200);
    });

    //Testing logout endpoint
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
        const logout = await agent
            .get('/user/logout')
        //console.log(logout.status);
        expect(logout.status).toEqual(200);
    });

});