# Contributing to F.I.D.E

> PS: any PR will be accepted by default until there is (unit/e2e) blackbox testing

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

## Technical Handbook

To contribute directly to the code, there is technical prequisite that you must know to contribute effectively.
To contribute to this code you must first know about:

- Vuejs (especially `$refs`, `$slots`, and `mixins`)
- SVG related thing

For temporary, this component use this library (if you had better idea, let us know by submitting an issue)

- [Svgjs](https://svgjs.com) and some plugin
- [inetractjs](https://interactjs.com)

### Project Structure

The structure of this component follow one component with many functionality a.k.a mixins.

```markdwon
src/
├── components
│   └── Annotator.vue
│
└── mixins
    ├── delete.js
    ├── drawing.js
    ├── manipulate.js
    └── select.js
```

There is only one component `Annotator.vue` at this moment.
There is possibiliy to make another support components that can be used in slots.
Each `mixins` represent the functionality of the component.

### Demo and Manual smoke test

Demo and smoke test (currently manual, not automated) are using [storybook](https://storybook.js.org).
There is some modification in a way of representing stories by writing it in Vue SFC format.

```markdwon
src/
└── stories
    ├── AdvancedShape
    │   ├── Canvas.vue
    │   ├── Component.vue
    │   ├── GroupBasicShape.vue
    │   ├── Image.vue
    │   └── Video.vue
    ├── BasicShape
    │   ├── Circle.vue
    │   ├── Ellipse.vue
    │   ├── Path.vue
    │   ├── Polygon.vue
    │   └── Rectangle.vue
    ├── Interact and Manipulate
    │   ├── Create.vue
    │   ├── Delete.vue
    │   └── Select.vue
    ├── config.js
    └── index.js
```

- **BasicShape** folder consist how using SVG basic shape as annotation
- **Interact and Manipulate** folder consist how to interacting/manipulate the annotation
- **AdvancedShape** folder consist how to use non SVG basic shape as annotation
- **config.js** file consist order of the stories

For more info see [vue-authoring-template](https://github.com/DrSensor/vue-authoring-template)

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