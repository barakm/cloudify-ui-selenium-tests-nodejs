'use strict';
/**

 Selenium driver for our use


 **/


/**
 *
 *
 *
 * This is a wrapper for selenium's driver.
 *
 * We need this small wrapper so we can generate a driver 'beforeEach' and 'afterEach'.
 *
 * in order to use this wrapper, your test should do the following :
 *
 * var driver = require('./driver'); ==> this is not selenium's driver! this is our wrapper.
 * driver.get() ==> will get you the selenium's instance. now you can do what you want with it.
 *
 * Please note you cannot write
 *
 * require('./driver').get(); because when the system loads the driver is not yet initialized!
 *
 *
 *
 * @param opts {
 *
 *          'seleniumServerUrl' : 'http://localhost/wd/hub',
 *          'rootUrl' : 'which url to load'
 * }
 */


var driver = null;
var logger = require('log4js').getLogger('index');


exports.generate = function( opts ){

    var webdriver = require('selenium-webdriver');

    var serverUrl = opts.serverUrl;
    var browserType = opts.browserType;

    if ( !serverUrl || !browserType ){
        throw new Error('serverUrl or browserType not defined');
    }
    logger.info('initializing driver with ', serverUrl, browserType);

    driver = new webdriver.Builder().
        usingServer(opts.serverUrl).
        withCapabilities(webdriver.Capabilities[opts.browserType]()).
        build();
    driver.manage().timeouts().implicitlyWait(10000);
    return driver;
};


exports.get = function(){
    if ( driver === null ){
        throw new Error('driver not initialized!!');
    }
    return driver;
};

exports.quit = function(){
    logger.info('quitting driver');
    return driver.quit( );
};






