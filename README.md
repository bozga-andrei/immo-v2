# Immo Invest Simulator
This project is an application for immo simulation and investment simulation

## Prerequisites
- You must have node.js and its package manager (npm) installed. You can get them from http://nodejs.org/.

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in `package.json`.

    npm install

We use [Gulp][] as our build system. Install the Gulp command-line tool globally with:

    npm install -g gulp-cli


[Bower][] is used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in `bower.json`. You can also run `bower update` and `bower install` to manage dependencies.
Add the `-h` flag on any command to see how you can use it. For example, `bower update -h`.

### Run the Application

We have preconfigured the project with [BrowserSync] with LiveReload.  The simplest way to start
this server is:

```
gulp serve
```

Now browse to the app at `http://localhost:3000/index.html`.


## Building for production

To optimize the FSBServicesCatalog application for production, run:

    gulp

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.\
The entirely application will be available under `release` directory. You have to copy everything in you web server. 


## Testing

There are two kinds of tests in the angular-seed application: Unit tests and end-to-end tests.

###Running Unit Tests
Unit tests are run by [Karma][] and written with [Jasmine][]. 
I provide a Karma configuration file to run them.
- the configuration is found at karma.conf.js

They can be run with:

    gulp test

UI end-to-end tests are powered by [Protractor][], which is built on top of WebDriverJS. They're located in `/e2e`
and can be run by running the tests (`gulp itest`).

[JHipster Homepage and latest documentation]: https://jhipster.github.io
[JHipster 4.0.5 archive]: https://jhipster.github.io/documentation-archive/v4.0.5

[Using JHipster in development]: https://jhipster.github.io/documentation-archive/v4.0.5/development/
[Using Docker and Docker-Compose]: https://jhipster.github.io/documentation-archive/v4.0.5/docker-compose
[Using JHipster in production]: https://jhipster.github.io/documentation-archive/v4.0.5/production/
[Running tests page]: https://jhipster.github.io/documentation-archive/v4.0.5/running-tests/
[Setting up Continuous Integration]: https://jhipster.github.io/documentation-archive/v4.0.5/setting-up-ci/

[Gatling]: http://gatling.io/
[Node.js]: https://nodejs.org/
[Yarn]: https://yarnpkg.org/
[Bower]: http://bower.io/
[Gulp]: http://gulpjs.com/
[BrowserSync]: http://www.browsersync.io/
[Karma]: http://karma-runner.github.io/
[Jasmine]: http://jasmine.github.io/2.0/introduction.html
[Protractor]: https://angular.github.io/protractor/
[Leaflet]: http://leafletjs.com/
[DefinitelyTyped]: http://definitelytyped.org/
