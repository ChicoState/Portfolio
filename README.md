[![Build Status](https://travis-ci.org/ChicoState/Portfolio.svg?branch=main)](https://travis-ci.org/ChicoState/Portfolio)

# Getting Started

## Things You Need to Download

### Docker
* https://docs.docker.com/get-docker/

### Docker Compose
* https://docs.docker.com/compose/install/

## Running the app
1. Clone the repo and cd into the repo.

2. Copy your Google service account key into `/server`.

3. Use `.env.example` to create a `.env` file with your desired MongoDB and Google Cloud credentials and private secret.

4. `docker-compose up`

Open a browser and navigate to [localhost:3000](localhost:3000)

# Making Contributions

## Workflow
Make code contributions in a branch related to an issue, and create a request to merge branch after the issue is resolved.

### Linter
* All code contributions must pass the linter before submission.

### Review
* All code contributions must be reviewed by one team member before submission.

### Tests
* All code contributions must pass all tests before submission.
* All code contributions must have corresponding tests.
