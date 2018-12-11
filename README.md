# Snuze Server
## Setup

#### npm
Check the scripts in the package.json for additional usage info. Make sure to follow the firebase steps before attempting to run local server or deploy.
##### local server
    1. For now we need 2 terminal windows so we can use babel watch.
    2. In your second terminal window run `npm run func:watch`.
        - If this is your first time running the server locally, run `npm run func:predeploy`.
    3. In your first terminal window run `npm run func:serve`.

##### deploy
    1. Run `npm run func:predeploy`.
    2. Run `npm run func:deploy`.

#### Firebase
Make sure you've logged into Firebase using the firebase cli.

    1. Install firebase command line tools globally using `npm i -g firebase-tools`.
    2. Login to firebase using `firebase login`.
    3. Use `firebase use project_alias` to select the firebase project to use. This is necessary for testing as well as deployment and serving.
        - `firebase use` will list available project names.
        - Alternatively, check .firebaserc for project aliases.
    4. Additional info can be found [here](https://firebase.google.com/docs/cli/)

#### dotenv
We use dotenv to manage environment variables. Please make sure you create a .env file in your functions folder with the necessary environment variables.

    - STRIPE_SECRET

#### Commitizen
We use commitizen to format our commit messages. To use commitizen with this repository please use the following steps:

    1. Install commitizen globally using `npm i -g commitizen`.
    2. Run `npm install` from the root folder.
    3. Use `git add` like normal.
    4. When committing, use `git cz`.
    5. Use the prompts to write your commit message.