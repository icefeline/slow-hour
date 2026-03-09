# /push

Commit all staged and unstaged changes, then push to the slow hour GitHub repo.

## steps

1. Run `git status` to show what's changed
2. Stage all modified tracked files with `git add -u`, then ask if any untracked files should be included
3. Run `git diff --cached --stat` to confirm what's staged
4. Draft a conventional commit message based on the changes:
   - `feat:` new feature
   - `fix:` bug fix
   - `style:` visual/CSS only
   - `content:` card meanings, copy, tone changes
   - `refactor:` restructuring without behaviour change
   - `chore:` config, deps, tooling
   - keep it lowercase, under 72 chars
5. Show the commit message and ask for approval before committing
6. Commit with `git commit -m "..."`
7. Push with `git push origin main`
8. Confirm push succeeded and show the commit hash

## notes
- never force push
- never amend a commit that's already been pushed
- if there are merge conflicts, stop and explain — don't resolve automatically
