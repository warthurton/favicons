# Versioning

This project uses automated semantic versioning based on [Conventional Commits](https://www.conventionalcommits.org/).

## How It Works

When you push commits to the `main` branch, GitHub Actions automatically:
1. Analyzes your commit message
2. Bumps the version in `package.json` based on the commit type
3. Creates a git tag with the new version
4. Pushes the changes back to the repository

## Commit Message Format

Use these prefixes in your commit messages to trigger version bumps:

### MAJOR version bump (1.0.0 → 2.0.0)
Breaking changes:
```
BREAKING CHANGE: description of breaking change
feat!: description of breaking feature
fix!: description of breaking fix
```

### MINOR version bump (0.1.0 → 0.2.0)
New features:
```
feat: add new feature
feat(scope): add feature with scope
```

### PATCH version bump (0.1.0 → 0.1.1)
Bug fixes:
```
fix: fix bug
fix(scope): fix bug with scope
```

### NO version bump
Other changes (docs, refactoring, etc.):
```
docs: update documentation
chore: update dependencies
refactor: refactor code
style: code style changes
test: add tests
ci: update CI configuration
```

## Examples

### Feature Addition (Minor Bump)
```bash
git commit -m "feat: add path-based routing for cleaner URLs"
# Version: 0.1.0 → 0.2.0
```

### Bug Fix (Patch Bump)
```bash
git commit -m "fix: resolve caching issue with resized icons"
# Version: 0.1.0 → 0.1.1
```

### Breaking Change (Major Bump)
```bash
git commit -m "feat!: change API response format to JSON

BREAKING CHANGE: API now returns JSON instead of redirects"
# Version: 0.1.0 → 1.0.0
```

### No Version Bump
```bash
git commit -m "docs: update README with new examples"
# Version: 0.1.0 (no change)
```

## Skipping Version Bump

If you need to push to main without triggering a version bump (even for feat/fix commits), add `[skip-version]` to your commit message:

```bash
git commit -m "feat: add feature [skip-version]"
# Version: 0.1.0 (no change despite feat: prefix)
```

## Workflow Details

The version bump workflow:
- Runs on: Push to `main` branch
- Skips for: Changes to `docs/`, `*.md` files, `.github/` directory
- Creates: Version commit with message `chore: bump version to X.Y.Z [skip-version]`
- Creates: Git tag `vX.Y.Z`
- Uses: `github-actions[bot]` as the committer

## Manual Version Bump

If you need to manually bump the version:

```bash
# Patch bump (0.1.0 → 0.1.1)
npm version patch

# Minor bump (0.1.0 → 0.2.0)
npm version minor

# Major bump (0.1.0 → 1.0.0)
npm version major

# Specific version
npm version 1.2.3

# Push the tag
git push origin main --tags
```

## Versioning Strategy

This project follows [Semantic Versioning](https://semver.org/) (SemVer):

**Given a version number MAJOR.MINOR.PATCH:**
- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Checking Current Version

```bash
# From package.json
node -p "require('./package.json').version"

# Or view directly
cat package.json | grep version

# Latest git tag
git describe --tags --abbrev=0
```

## Tags and Releases

Every version bump creates a git tag:
- Format: `vX.Y.Z` (e.g., `v1.2.3`)
- Pushed automatically by CI
- Can be used for GitHub Releases
- Useful for deployment tracking

## Best Practices

1. **Use conventional commits** consistently
2. **Group related changes** in a single commit when possible
3. **Write clear commit messages** that explain the "why"
4. **Test before pushing** to main (CI runs on push, not PR)
5. **Use feature branches** and only merge to main when ready for version bump

## CI Configuration

The version bump workflow is configured in [.github/workflows/version-bump.yml](../.github/workflows/version-bump.yml).

Key features:
- Only runs on `main` branch
- Ignores documentation-only changes
- Uses GitHub Actions bot for commits
- Requires no manual intervention
- Pushes tags automatically
