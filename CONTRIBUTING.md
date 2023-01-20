# Contributing to StuddyBuddyv1 Backend
First of all, thank you for considering being a part of this amazing project. 🤩 When contributing to this repository, please first discuss the change you wish to make via [issue](https://github.com/StudyBuddyv1/studybuddyv1-backend/issues) or any other method with the owners of this repository before making a change.

We love pull requests! We can't wait to collaborate with you. Please note that we have a [Code of Conduct](/CODE_OF_CONDUCT.md), kindly follow it in all your interactions with the project.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Development Setup](#development-setup)
  - [Running the tests](#running-the-tests)
  - [Editor setup](#editor-setup)
- [Testing](#testing)
- [Style Guide](#style-guide)
- [Commit Message Guidelines](#commit-message-guidelines)
  - [Commit CheatSheet](#commit-cheatsheet)
  - [Other Notes](#other-notes)
- [Pull Request Process](#pull-request-process)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
* [Node.js](https://nodejs.org/en/download/)
* [MongoDB](https://docs.mongodb.com/manual/installation/)
* [Git](https://git-scm.com/downloads)
* [npm](https://www.npmjs.com/get-npm)
* A winning attitude 🤩

### Development Setup
1. Fork the repository and clone it to your local machine.
```
$ git clone https://github.com/YOUR_GITHUB_USERNAME/studybuddyv1-backend.git
```
2. Navigate to the project directory.
```
$ cd studybuddyv1-backend
```
3. Install the project dependencies.
```
$ npm install
```
4. Copy the contents of `example.env` to a new file called `.env` and fill in the required environment variables.
```
cp example.env .env
```
- You can generate a random string for the `JWT_SECRET` variable using this command: `openssl rand -hex 32`

5. Start the development server.
```
$ npm run start:dev
```

### Development Workflow
1. Create a new branch for the feature you want to work on.
```
$ git checkout -b feature/feature-name
```
2. Make your changes.
3. Commit your changes.
```
$ git add .
$ git commit -m "commit message"
```
4. Push your changes to your remote branch.
```
$ git push origin feature/feature-name
```
5. Create a pull request to the `dev` branch.
6. Wait for your pull request to be reviewed and merged.

### Running the Tests
We use Jest for testing, and require contributors to follow a Test Driven Development (TDD) approach where you write test to fail at first, and then write the corresponding function to pass the test.
1. Navigate to the project directory.
```
$ cd studybuddyv1-backend
```
2. Run the tests.
```
$ npm run test
```

## Style Guide
We advocate for clean and well structured code. We use [Airbnb's JavaScript Style Guide](https://airbnb.io/javascript/) as a guide for writing clean code. Please read through it and follow the guidelines. We also use [ESLint](https://eslint.org/) to enforce the style guide. You can easily set up your editor to lint your code as you type. Follow the instructions [here](https://eslint.org/docs/user-guide/integrations) to set up your editor.

Before creating or merging a pull request, make sure your code is properly formatted. You can easily do that by running:

- `npm lint` to lint all files in the project directory
- `npm lint <file_name>` to lint only a particular file in the project directory

We also use [Prettier](https://prettier.io/) to format our code. You can easily set up your editor to format your code as you save. Follow the instructions [here](https://prettier.io/docs/en/editors.html) to set up your editor.
### File names
File names must be in camelCase. For example: `userController.js`.

## Commit Message Guidelines
We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specifications to format our commit messages. Please read through the guide and follow the guidelines. If you're new to this format, that's okay. Here's a quick guide to get you started:
> *Commit CheatSheet*


| Type     |                          | Description                                                                                                 |
|----------|--------------------------|-------------------------------------------------------------------------------------------------------------|
|   feat   | Features                 | A new feature                                                                                               |
|    fix   | Bug Fixes                | A bug fix                                                                                                   |
|   docs   | Documentation            | Documentation only changes                                                                                  |
|   style  | Styles                   | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)      |
| refactor | Code Refactoring         | A code change that neither fixes a bug nor adds a feature                                                   |
|   perf   | Performance Improvements | A code change that improves performance                                                                     |
|   test   | Tests                    | Adding missing tests or correcting existing tests                                                           |
|   build  | Builds                   | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)         |
|    ci    | Continuous Integrations  | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
|   chore  | Chores                   | Other changes that don't modify src or test files                                                           |
|  revert  | Reverts                  | Reverts a previous commit                                                                                   |

### Other Guidelines
- Please format your **commit messages** appropriately:
    - Use the body to explain what and why vs. how.
    - Be as descriptive as possible in the 72 characters allowed. This helps us _a lot_ when writing release notes and tracking down regressions. Here are some examples:
        - Instead of `Fixing bugs`, consider `fix #1372: negative top/skip values would break odata output`.
        - Instead of `Updating readme`, consider `improve: making build instructions clearer in README`.
        - Instead of `Adding some tests`, consider `test #889: missing test cases for permissions given anonymous user`.
- Please **do not** use the `--amend` flag when committing. This will cause your commit to be overwritten and will cause problems with the commit history.

## License
This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.

#
> This document was created by [Precious Abubakar](https://github.com/misspee007) and [Oluwatobi Balogun](https://github.com/tobisupreme)