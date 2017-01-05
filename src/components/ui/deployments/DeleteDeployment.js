'use strict';

/**
 * Click on 'Delete' tab on delete deployment dialog
 */
exports.clickConfirm = function() {
    $$('#delete-deployment-dialog .confirmationButtons button').get(1).click();
};

/**
 * Click on 'Cancel' button on delete deployment dialog
 */
exports.clickCancel = function() {
    $$('#delete-deployment-dialog .confirmationButtons button').first().click();
    browser.sleep(1000);
};

exports.clickClose = function() {
    element.all(by.css('.ngdialog-close')).click();
    browser.sleep(1000);
};