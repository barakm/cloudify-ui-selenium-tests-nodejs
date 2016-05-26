'use strict';

var logger = require('log4js').getLogger('Dialog');

exports.close = function() {
    //http://stackoverflow.com/questions/27905584/select-first-visible-element-in-protractor
    $$('.ngdialog-close')
        .filter(function(item) { return item.isDisplayed(); })
        .first()
        .click();
    return browser.sleep(1000); // close effect..
};

exports.closeToast = function() {
    //http://stackoverflow.com/questions/27905584/select-first-visible-element-in-protractor
    $$('.toast-close-button')
        .filter(function(item) { return item.isDisplayed(); })
        .first()
        .click();
    return browser.sleep(1000); // close effect..
};

exports.getErrorMessage = function() {
    browser.sleep(1000).then(function() { logger.info('getting error message'); });

    //http://stackoverflow.com/questions/27905584/select-first-visible-element-in-protractor
    return $$('#toast-container .toast-message')
        .filter(function(item) { return item.isDisplayed(); })
        .first()
        .getText();
};