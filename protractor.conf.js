var capabilities = {
    'browserName': 'chrome',
    'chromeOptions': {'args': ['--disable-extensions']}
};

var timeout = parseInt(process.env.TIMEOUT || "6000000",10);

if ( !!process.env.BROWSER_TYPE ) {
    if ( process.env.BROWSER_TYPE.toLowerCase() === 'phantomjs') {
        capabilities = {
            'browserName': 'phantomjs',
            'platform': 'ANY',
            'version': '',
            //'phantomjs.cli.args': ['--ignore-ssl-errors=true',  '--web-security=false', '--webdriver-loglevel=DEBUG','--debug=true']
            'phantomjs.cli.args': ['--ignore-ssl-errors=true',  '--web-security=false'/*, '--remote-debugger-port=9090'*/]
        }
    }
}

exports.config = {
    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Spec patterns are relative to the location of this config.

    suites: {
        sanity: [ 'spec/normalize.js', 'spec/sanity/**' ],
        quickstart: ['spec/normalize.js', 'spec/quickstart/quickstart.js'],
        blueprints: [  'spec/normalize.js', 'spec/sanity/blueprints.js'  ],
        deployments: [  'spec/normalize.js', 'spec/sanity/deployments.js' ],
        events: [ 'spec/normalize.js', 'spec/sanity/events.js' ],
        stress: ['spec/stress/deployments.js' ],
        custom: [ 'spec/normalize.js', process.env.CFY_SPEC ]
    },


    capabilities: capabilities,

    allScriptsTimeout: timeout,


    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: process.env.PROTRACTOR_BASE_URL || 'http://localhost:1616',

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: timeout,
        allScriptsTimeout: timeout
    }
};