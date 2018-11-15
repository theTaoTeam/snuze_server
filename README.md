# Snuze Server
## Setup

#### Firebase
Make sure you've logged into Firebase using the firebase cli. An update to the README may be coming soon to clarify this if there are issues on the team.

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