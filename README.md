[![Build Status](https://travis-ci.com/ChicoState/Portfolio.svg?branch=main)](https://travis-ci.com/ChicoState/Portfolio)
[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/dashboard?id=ChicoState_Portfolio)

# Portfolio
 *"A place where like minded professionals can connect and collaborate."*
 
 Portfolio is a social media website for professionals that seek exposure. 

 ## Team Members
 - [Colton Davies](https://github.com/Colton0012)
 - [Devan Hedglin](https://github.com/dlhedglin)
 - [Joseph Levin](https://github.com/Joseph-Levin)
 - [Luke Zearfoss](https://github.com/LWZearfoss)

## Getting Started

### Things You Need

#### Docker
- https://docs.docker.com/get-docker/

#### Docker Compose
- https://docs.docker.com/compose/install/

#### MongoDB Instance
- https://www.mongodb.com/

#### Google Cloud Storage Bucket
- https://cloud.google.com/storage/docs/creating-buckets/

### Running the app
1. Clone the repo and `cd` into the repo

2. Configure a MongoDB instance and a Google Cloud Storage bucket

2. Copy your Google service account authentication JSON key into `/server`

3. Use `.env.example` to create a `.env` file with your credentials such as:
    ```
    MONGO_URL=mongodb+srv://USER:PASSWORD@cluster0.hgylc.mongodb.net/DBNAME
    SECRET=SHARED-CLIENT-SERVER-SECRET
    PROJECT_ID=GOOGLE-CLOUD-PROJECT-ID
    KEY_FILENAME=/server/GOOGLE-CLOUD-KEY-NAME.json
    REACT_APP_BUCKET_NAME=GOOGLE-CLOUD-BUCKET-NAME
    ```

    - **MONGO_URL** is the URL to the backend's MongoDB instance
    - **SECRET** is a shared secret used for encrypting and decrypting JWT for authentication
    - **PROJECT_ID** is the Google Cloud Storage project's name
    - **KEY_FILENAME** is the path to the Google service account authentication JSON key relative to the root
    - **REACT_APP_BUCKET_NAME** is the Google Cloud Storage bucket's name

4. Commands:
   - `docker-compose up --build` will launch the website at the URL [localhost:3000](localhost:3000)
   - `docker-compose run server npm test` will run the server tests
   - `docker-compose run server npm run lint` will run the server linter
   - `docker-compose run server npm run plato` will run Plato static analysis for the server
        - Results are stored in `/server/report/index.html`
   - `docker-compose run client npm test` will run the client tests
   - `docker-compose run client npm run lint` will run the client linter
   - `docker-compose run client npm run plato` will run Plato static analysis for the client
        - Results are stored in `/client/report/index.html`

## Making Contributions

### Workflow
Make code contributions in a branch related to an issue, and create a request to merge branch after the issue is resolved

#### Linter
- All code contributions must pass the linters before submission

#### Review
- All code contributions must be reviewed by one team member before submission

#### Tests
- All code contributions must pass all tests before submission
- All code contributions must have corresponding tests
