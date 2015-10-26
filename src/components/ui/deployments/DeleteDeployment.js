'use strict';

/**
 * Click on 'Delete' tab on delete deployment dialog
 */
exports.clickConfirm = function() {
    element.all(by.css('#deleteDialog .confirmationButtons button')).then(function(btns) {
        btns[1].click();
    });
};

/**
 * Click on 'Cancel' button on delete deployment dialog
 */
exports.clickCancel = function() {
    element.all(by.css('#deleteDialog .confirmationButtons button')).then(function(btns) {
        btns[0].click();
    });
};

exports.clickClose = function() {
    element.all(by.css('.ngdialog-close')).then(function(btns) {
        btns[0].click();
    });
};