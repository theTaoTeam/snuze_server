# Snuze Server
## Setup

#### Firebase
Make sure you've logged into Firebase using the firebase cli.

    1. Install firebase command line tools globally using `npm i -g firebase-tools`.
    2. Login to firebase using `firebase login`.
    3. Use `firebase use` to select the firebase instance to use. This is necessary for testing as well as deployment and serving.
        - staging - All functionality should be tested here first.
        - master - Functions can be manually run from here if needed.
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