### running the tests

```sh
$ npm test
```

This will check that the files are formatted correctly with [prettier][], that
you have not broken any of the non-format-related ["standard" eslint][] rules,
and that all the tests in the `test/` directory pass.

To fix code formatting issues:

```sh
$ eslint --fix
```

If you would like to format your code automatically when you save a file, there
are many ways to set that up. See the ["Editor Integration"][] of the Prettier
README for details.

[prettier]: https://github.com/prettier/prettier
["standard" eslint]: https://standardjs.com/rules.html#javascript-standard-style
["Editor Integration"]: https://github.com/prettier/prettier#editor-integration

### getting code coverage details

```sh
$ npm run cover
```

This will run the tests and generate a coverage report on the command line as
well as open a web browser with an HTML code coverage report.
