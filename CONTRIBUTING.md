# Contributing to FaceTrack AI

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Style Guides](#style-guides)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## I Have a Question

Before you ask a question, it is best to search for existing [Issues](https://github.com/yourusername/facetrack-ai/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/yourusername/facetrack-ai/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

## I Want To Contribute

> ### Legal Notice
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report.

#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to security@facetrack.ai.

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/yourusername/facetrack-ai/issues/new).
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps*.
- Provide information about OS, Platform, and version.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for FaceTrack AI, **including completely new features and minor improvements to existing functionality**.

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Perform a [search](https://github.com/yourusername/facetrack-ai/issues) to see if the enhancement has already been suggested.
- Find out whether your idea fits with the scope and aims of the project.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/yourusername/facetrack-ai/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Explain why this enhancement would be useful** to most FaceTrack AI users.

### Your First Code Contribution

#### Step 1: Fork the Repository

Fork the repository on GitHub and clone it to your local machine:

```bash
git clone https://github.com/your-username/facetrack-ai.git
cd facetrack-ai
```

#### Step 2: Create a Branch

Create a branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

#### Step 3: Make Your Changes

Make your changes and test them thoroughly.

#### Step 4: Commit Your Changes

Commit your changes with a descriptive commit message:

```bash
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve bug in face recognition"
```

#### Step 5: Push to GitHub

Push your changes to your fork:

```bash
git push origin feature/your-feature-name
```

#### Step 6: Submit a Pull Request

Go to the original repository on GitHub and click "New Pull Request". Select your branch and submit the PR.

## Style Guides

### Git Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

Examples:
```
feat: add dark mode toggle
fix: resolve camera permission error
docs: update README with new setup instructions
style: format code with prettier
refactor: simplify face recognition logic
```

### JavaScript/TypeScript Style Guide

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

### CSS/Tailwind Style Guide

- Use Tailwind utility classes
- Follow the existing design system
- Use the defined color palette
- Maintain responsive design principles

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## Thank You!

Your contributions to open source, no matter how small, make projects like FaceTrack AI possible. Thank you for being part of our community!
