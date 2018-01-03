# Contributing to F.I.D.E

vue-annotator is a community-driven project. As such, we welcome and encourage all sorts of
contributions. They include, but are not limited to:

- Constructive feedback
- Questions about usage
- Documentation changes
- Feature requests
- [Pull requests](#pull-requests)
- [Create issues](#create-issues)

We strongly suggest that before filing an issue, you search through the existing issues to see
if it has already been filed by someone else.
For pull-request and commit message, it's mandatory to follow the [guide](#pull-requests)
but can became a good practice for contributing to this project.

<!-- ## Contribution suggestions

We use the label [`help wanted`](https://github.com/DrSensor/F.I.D.E/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) in the issue tracker to denote fairly-well-scoped-out bugs or feature requests that the community can pick up and work on. If any of those labeled issues do not have enough information, please feel free to ask constructive questions. (This applies to any open issue.) -->

-----
## Pull Requests

Here are some things to keep in mind as you file pull requests to fix bugs, add new features, etc.:

- Circle CI is used to make sure that the project builds packages as expected on the supported
  platforms, using supported Node.js versions.
- Please make sure your commits are rebased onto the latest commit in the master branch, and that
  you limit/squash the number of commits created to a "feature"-level. For instance:

bad:

```
commit 1: add foo option
commit 2: standardize code
commit 3: add test
commit 4: add docs
commit 5: add bar option
commit 6: add test + docs
```

good:

```
commit 1: add foo option
commit 2: add bar option
```

### Git Commit Messages

- Use the present tense (`add feature` not `added feature`)
- Use the imperative mood (`move cursor to...` not `moves cursor to...`)
- Try to limit the length of commit message
- For long commit message, make it per point and use `-` in commit description
- Reference issues and pull requests liberally after the first line, if applicable
- When need emoticon, use it at the end of sentence (`add explosion :boom:`)

-----