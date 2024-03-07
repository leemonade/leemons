# Contribute to Leemons

Leemons is an open-source project administered by [the Leemons team](https://www.leemons.io/company). We appreciate your interest and efforts to contribute to Leemons.

All efforts to contribute are highly appreciated, we recommend you talk to a maintainer prior to spending a lot of time making a pull request that may not align with the project roadmap.

## Open Development & Community Driven

Leemons is an open-source project. See the [LICENSE](https://github.com/leemonade/leemons/blob/main/LICENSE) file for licensing information. All the work done is available on GitHub.

The core team and the contributors send pull requests which go through the same validation process.

## Code of Conduct

This project and everyone participating in it are governed by the [Leemons Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please read the [full text](CODE_OF_CONDUCT.md) so that you can read which actions may or may not be tolerated.

## Documentation

Pull requests relating to fixing documentation for the latest release should be directed towards the [documentation repo](https://github.com/leemonade/leemons-docs). Please see the documentation [contributing guide](https://github.com/leemonade/leemons-docs/blob/main/CONTRIBUTING.md) for more information on how to make the documentation pull request.

## Bugs

We are using [GitHub Issues](https://github.com/leemonade/leemons/issues) to manage our public bugs. We keep a close eye on this so before filing a new issue, try to make sure the problem does not already exist.

---

## Before Submitting a Pull Request

The core team will review your pull request and will either merge it, request changes to it, or close it.

**Before submitting your pull request** make sure the following requirements are fulfilled:

- Fork the repository and create your branch from `main`.
- Run `yarn` in the repository root.
- If you’ve fixed a bug or added code that should be tested, add the tests and then link the corresponding issue in either your commit or your PR!
- Make sure your code lints (`yarn lint`).

## Contribution Prerequisites

- You have [Node](https://nodejs.org/en/) at >= v16 and [Yarn](https://yarnpkg.com/en/) at v1.2.0+.
- You are familiar with Git.

## Development Workflow

_For users running on Apple Silicon M1, you may encounter errors thrown by `sharp`. You may need to re-install `libvps` or to build `sharp` manually following [this issue comment](https://github.com/lovell/sharp/issues/2460#issuecomment-751491241) in order to start the project._

To facilitate the contribution, we have drastically reduced the amount of commands necessary to install the entire development environment.

Then, please follow the instructions below:

### 1. Fork the [repository](https://github.com/leemonade/leemons)

[Go to the repository](https://github.com/leemonade/leemons) and fork it to your own GitHub account.

### 2. Clone from your repository

```bash
git clone git@github.com:YOUR_USERNAME/leemons.git
```

#### 3. Install the dependencies

Go to the root of the repository.

```bash
cd leemons && yarn
```

#### 4. Start the example application

To start a test example application to test your changes quickly and also for the next step.

```bash
cd leemons/examples/demo && yarn dev
```

Read the `demo` application README [here](./examples/demo/README.md) for more details.

**Awesome! You are now able to contribute to Leemons.**

#### 6. Available commands

- `yarn` installs the dependencies.
- `yarn dev` starts yarn watch in all packages.
- `yarn start` starts yarn watch in all packages.
- `yarn front` starts yarn watch in all frontend packages.
- `yarn lint` lints the codebase.

---

## Miscellaneous

### Repository Organization

We chose to use a monorepo design that exploits [Yarn Workspaces](https://yarnpkg.com/en/docs/workspaces) in the way [React](https://github.com/facebook/react/tree/master/packages) or [Babel](https://github.com/babel/babel/tree/master/packages) does. This allows the community to easily maintain the whole ecosystem, keep it up-to-date and consistent.

We do our best to keep the main branch as clean as possible, with tests passing at all times. However, it may happen that the main branch moves faster than the release cycle. Therefore check the [releases on npm](https://www.npmjs.com/package/leemons) so that you're always up-to-date with the latest stable version.

### Reporting an issue

Before submitting an issue you need to make sure:

- You are experiencing a concrete technical issue with Leemons.
- You have already searched for related [issues](https://github.com/leemonade/leemons/issues), and found none open (if you found a related _closed_ issue, please link to it from your post).
- You are not asking a question about how to use Leemons or about whether or not Leemons has a certain feature. For general help using Leemons, you may:
  - Refer to [the official Leemons documentation](https://leemonade.github.com/leemons-docs).
- Your issue title is concise, on-topic and polite.
- You can and do provide steps to reproduce your issue.
- You have tried all the following (if relevant) and your issue remains:
  - Make sure you have the right application started.
  - Make sure the [issue template](.github/ISSUE_TEMPLATE) is respected.
  - Make sure your issue body is readable and [well formatted](https://guides.github.com/features/mastering-markdown).
  - Make sure you've killed the Leemons server with CTRL+C and started it again.
  - Make sure the application you are using to reproduce the issue has a clean `node_modules` directory, meaning:
    - no dependencies are linked (e.g. you haven't run `yarn link` nor `npm link`)
    - that you haven't made any inline changes to files in the `node_modules` folder
    - that you don't have any weird global dependency loops. The easiest way to double-check any of the above, if you aren't sure, is to run: `$ rm -rf node_modules && yarn cache clear && yarn install`.
