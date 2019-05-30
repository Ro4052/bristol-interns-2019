## Process for deploy to master

1. Be on up-to-date development branch
2. Create new branch `release-v{releaseName}` see: Naming Conventions
3. Change version number in package.json
4. Commit in with message in the form `{handle} Release {version} to master`
5. Tag commit with version and comment using `git tag -a v{version} -m '{helpful message}'`
6. Push branch to remote and create pull-request from `release branch` -> `develop`
7. Push tag to remote with `git push origin {tag}`
8. Merge pull request and check [dev-deployment]( https://bristol-interns-2019-dev.herokuapp.com/) for changes/problems
9. Create pull request from `develop` -> `master`
10. Merge pull request and check [prod deployment](https://bristol-interns-2019.herokuapp.com/)
11. Chill

## Naming Conventions

Up to you!

*Courtesy of flaps*
