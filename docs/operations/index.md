# Operations

This area contains deployment, rollback, runbook, monitoring, and other operational guidance.

## Release

Releases use Changesets, matching the `md-to-naver-blog` release workflow.

- Add a `.changeset/*.md` file for each release-worthy change.
- Declare the package and semver bump (`major`, `minor`, or `patch`) in the changeset frontmatter.
- A push to `main` runs `.github/workflows/release.yml`.
- `changesets/action@v1` creates the release PR, or publishes the versioned package after the release PR is merged.
- Release intent is not derived from PR titles or a `release-none` label.

The workflow requests GitHub Actions OIDC with `id-token: write` and publishes through the npm Trusted Publisher configured for `jjlabsio/korea-stock-mcp` and `release.yml`. Keep the npm package's repository URL aligned with this GitHub repository.
