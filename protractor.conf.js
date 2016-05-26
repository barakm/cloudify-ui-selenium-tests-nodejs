var tempFolderPath = '/tmp';
//var tempFolderPath = 'C:\\Users\\Alex\\AppData\\Local\\Temp\\'; // Windows

var capabilities = {
    'browserName': 'chrome',
    'chromeOptions': {
        args: ['--disable-extensions'],
        prefs: {
            'download': {
                'prompt_for_download': false,
                'default_directory': tempFolderPath
            }
        }
    }
};

var timeout = parseInt(process.env.TIMEOUT || "600000",10);

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
        sanity: [ 'spec/normalize.js',
            'spec/sanity/blueprints.js',
            'spec/sanity/deployments.js',
            'spec/sanity/events.js',
            'spec/sanity/nodesInstances.js',
            'spec/sanity/maintenance.js',
            'spec/sanity/hotkeys.js'
        ],
        quickstart: ['spec/normalize.js', 'spec/quickstart/quickstart.js'],
        'quickstart-cli': ['spec/normalize.js', 'spec/quickstart/quickstart-cli.js'],
        prerequisites: [ 'spec/normalize.js', 'spec/sanity/_prerequisites.js' ],
        blueprints: [  'spec/normalize.js', 'spec/sanity/blueprints.js'  ],
        deployments: [  'spec/normalize.js', 'spec/sanity/deployments.js' ],
        plugins: [  'spec/normalize.js', 'spec/sanity/plugins.js' ],
        events: [ 'spec/normalize.js', 'spec/sanity/events.js' ],
        hotkeys: [ 'spec/normalize.js', 'spec/sanity/hotkeys.js' ],
        nodesInstances: [ 'spec/normalize.js', 'spec/sanity/nodesInstances.js' ],
        maintenance: [ 'spec/normalize.js', 'spec/sanity/maintenance.js' ],
        custom: [ 'spec/normalize.js', process.env.CFY_SPEC ]
    },


    capabilities: capabilities,

    allScriptsTimeout: timeout,


    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: process.env.PROTRACTOR_BASE_URL || 'http://localhost:9000',

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: timeout,
        allScriptsTimeout: timeout
    },

    onPrepare: function() {
        browser.manage().timeouts().pageLoadTimeout(10000);
        //browser.driver.manage().window().setSize(1920, 1080);
        browser.driver.manage().window().maximize();
    }
};