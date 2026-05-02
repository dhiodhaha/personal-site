<!-- BEGIN:parallel-worktree-rules -->
## Parallel Agent Work — Worktree Protocol

Multiple agents (Claude Code, Codex, etc.) can work in parallel only via **git worktrees**. Never run two issues in the same working directory.

### Setup

```bash
# Create one worktree per issue before starting any work
git worktree add ../personal-site-issue-3 feature/issue-3-editorial-design-system
git worktree add ../personal-site-issue-4 feature/issue-4-content-model

# Each agent works exclusively in its own directory
cd ../personal-site-issue-3   # agent A
cd ../personal-site-issue-4   # agent B

# Remove after PR is merged
git worktree remove ../personal-site-issue-3
```

### Rules

1. **One issue = one branch = one worktree** — never share a working directory between two parallel lanes
2. **Verify branch before every commit** — run `git branch --show-current` and confirm it matches the expected branch. If it doesn't, stop and fix before committing
3. **Declare file ownership upfront** — before starting parallel work, list which files each issue will touch. If two issues claim the same file, serialize them; do not parallelize
4. **Never rebase or force-push a branch another agent is actively using**
5. **PRs target `main` independently** — no cross-PR dependencies between parallel lanes

### Serialized files — only one agent at a time

These files are shared infrastructure. If your issue requires touching any of them, check that no other lane is currently modifying the same file:

- `astro.config.mjs`
- `src/styles/global.css`
- `src/layouts/BaseLayout.astro`
- `sanity.config.ts`
- `sanity.cli.ts`
- `wrangler.toml`
<!-- END:parallel-worktree-rules -->

---

<!-- BEGIN:github-workflow-rules -->
# GitHub Workflow

**Repos:** always private unless told otherwise.

**PRs:** always draft · assignee `dhiodhaha` · pick labels from repo list (don't ask user). Use Worklayer MCP for all GitHub operations, not `gh` CLI.

**Commits:** one logical change per commit, never bundle unrelated changes.
<!-- END:github-workflow-rules -->
