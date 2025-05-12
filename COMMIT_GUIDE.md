# Semantic Commit Guide

This repository uses semantic commit messages to ensure consistency and make the commit history more readable and useful.

## How to Make a Commit

Instead of using `git commit` directly, you can use one of these approaches:

### Option 1: Interactive Commit Wizard (Recommended)

Run:
```bash
npm run commit
```

This will launch an interactive wizard that will guide you through creating a properly formatted commit message.

### Option 2: Manual Commit with Template

If you prefer to write commits manually, use:
```bash
git commit
```

This will open the commit message template in your default editor. Fill in the template following the instructions provided.

## Commit Message Format

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

### Scope (Optional)

The scope provides additional contextual information.

Examples:
- `feat(auth)`: Feature related to authentication
- `fix(api)`: Bug fix in the API
- `docs(readme)`: Changes to README.md

### Subject

The subject contains a succinct description of the change:
- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end

### Examples of Good Commit Messages

```
feat(auth): add OAuth2 login support
fix(api): handle empty responses properly
docs: update installation instructions
style: format code according to new style guide
refactor(user): simplify profile update logic
```

## Why Use Semantic Commits?

- Makes the commit history more readable
- Automatically generates meaningful changelogs
- Makes it easier to understand the impact of changes
- Helps with version management 