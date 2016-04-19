/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files, and the ! prefix for excluding files.)
 */

// Path to public folder
var tmpPath = '.tmp/public/';

// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
    'styles/**/*.css',
    'vendor/bootstrap/dist/css/bootstrap.min.css',
    'vendor/bootstrap/dist/css/bootstrap-theme.min.css',
    'vendor/angucomplete-alt/angucomplete-alt.css',
    'vendor/angular-bootstrap/ui-bootstrap-csp.css',
//'vendor/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
            //'vendor/angular-material/angular-material.min.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
    // Load sails.io before everything else
    'js/dependencies/sails.io.js',
    // Dependencies like jQuery, or Angular are brought in here
    'js/dependencies/**/*.js',
    'vendor/jquery/dist/jquery.min.js',
    'vendor/angular/angular.min.js',
//    'vendor/angular-animate/angular-animate.min.js',
//    'vendor/angular-aria/angular-aria.min.js',
//    'vendor/angular-messages/angular-messages.min.js',
//    'vendor/angular-material/angular-material.min.js',
    'vendor/bootstrap/dist/js/bootstrap.min.js',
    'vendor/angucomplete-alt/dist/angucomplete-alt.min.js',
    'vendor/remarkable-bootstrap-notify/bootstrap-notify.min.js',
    'vendor/underscore/underscore-min.js',
    'vendor/momentjs/min/moment-with-langs.min.js',
    'vendor/angular-bootstrap/ui-bootstrap.min.js',
//'vendor/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
    // 'vendor/angular-bootstrap3-datepicker/dist/ng-bs3-datepicker.min.js',
// All of the rest of your client-side js files
    // will be injected here in no particular order.
    '/js/app/historic/historicModule.js',
    '/js/app/historic/historicDirectives.js',
    '/js/app/historic/historicController.js',
//'js/**/*.js',
            // Use the "exclude" operator to ignore files
            // '!js/ignore/these/files/*.js'
];
// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
    'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(transformPath);
module.exports.jsFilesToInject = jsFilesToInject.map(transformPath);
module.exports.templateFilesToInject = templateFilesToInject.map(transformPath);

// Transform paths relative to the "assets" folder to be relative to the public
// folder, preserving "exclude" operators.
function transformPath(path) {
    return (path.substring(0, 1) == '!') ? ('!' + tmpPath + path.substring(1)) : (tmpPath + path);
}
