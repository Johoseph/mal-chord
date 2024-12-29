# MAL Chord 📈

MAL Chord is an interactive web-app that allows users to visualise their [MyAnimeList](https://myanimelist.net/) library.

![image](https://user-images.githubusercontent.com/49534136/185727853-aba00599-fa1c-4fc6-9b8f-834f64f5e131.png)

The application has been built as a single-page [Preact](https://preactjs.com/) project which communicates with a [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/) API.

## Running locally 🏃

To run the project locally, you will need to obtain your own client credentials through MyAnimeList (see Step 0 of [this](https://myanimelist.net/blog.php?eid=835707) blog post for a guide on how to do this). During this process, you will be prompted to enter app information - the below values can be used:

| Field            | Value                              |
| ---------------- | ---------------------------------- |
| App Redirect URL | `http://localhost:5173`            |
| Homepage URL     | `http://localhost:5173`            |
| App Logo URL     | `http://localhost:8080/chord-logo` |

### Docker

1. Add your MAL Client ID/Secret values generated above to a `.env` file at the root of the project (use/copy the `.env.example` file).
2. Run `docker-compose up --build -d`
3. Once the build completes, MAL Chord will run at [http://localhost:5173](http://localhost:5173)

### Node

#### App Setup

1. cd into the `app` directory
2. Add your MAL Client ID/Secret values generated above to a `.env` file (use/copy the `.env.example` file)
3. Run `yarn` to install
4. Run `yarn start` to run MAL Chord will at [http://localhost:5173](http://localhost:5173)

The following other commands can be run in the project:

- `yarn dev` - Runs the application in development mode (on port 5173)
- `yarn build` - Builds the application for production to the `build` folder
- `yarn preview` - Serves the production build locally (on port 4173)

#### API Setup

1. cd into the `api` directory
2. Add your MAL Client ID/Secret values generated above to a `.env` file (use/copy the `.env.example` file)
3. Run `yarn` to install
4. Run `yarn start` to run MAL Chord will at [http://localhost:5173](http://localhost:5173)

The following other commands can be run in the project:

- `yarn dev` - Utilises [nodemon](https://nodemon.io/) to run the application in watch mode

## What happened to `mal-chord.com`?

This site was originally deployed via Amazon services at [mal-chord.com](https://mal-chord.com/), however has been retired as of 20/08/2022 due to my free-tier of the Amazon services expiring. See below for an overview of the services that I utilised to get this running:

- Amplify for Preact client
- Elastic Beanstalk for Node.JS server
- Route 53 to allow server to be accessed via `api.mal-chord` URL prefix
