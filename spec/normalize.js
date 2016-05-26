'use strict';

/**
 * This file will normalize all tests
 *
 * When you declare a suite in protractor, include this file first to have it normalized
 */
var jasmineReporters = require('jasmine-reporters');

jasmine.getEnv().addReporter(new jasmineReporters.TerminalReporter({
    verbosity: 3,
    color: true,
    showStack: true
}));

browser.getLogger = function(name){

    var logger = require('log4js').getLogger(name);

    function logMe ( level ){
        return function(msg){

            try {
                browser.sleep(1).then(function () {
                    try {
                        logger[level](msg);
                    }catch(e){
                        console.log(e);
                    }
                });

            }catch(e){
                console.log(e);
            }
        };
    }

    return {
        info : logMe('info'),
        warn : logMe('warn'),
        error : logMe('error'),
        debug : logMe('debug'),
        trace : logMe('trace')
    };
};

var recordingSet = false;
beforeEach(function() {

    if (process.env.RECORD && !recordingSet) {

        var folderPath = '/tmp/protractor';
        recordingSet = true;

        var fs = require('fs-extra');
        fs.emptyDirSync(folderPath);
        setInterval(function () {
            if ( browser.ignoreSynchronization ){ // does not work well when not synced.. don't know why.
                return;
            }
            try {
                browser.takeScreenshot().then(function (png) {
                    var stream = fs.createWriteStream(folderPath + '/screenshot-' + new Date().getTime() + '.png');
                    stream.write(new Buffer(png, 'base64'));
                    stream.end();
                });
            } catch (e) {
            }
        }, 500);

    }
});
