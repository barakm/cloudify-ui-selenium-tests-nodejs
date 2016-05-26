'use strict';

var uploadForm = $('#uploadForm');

exports.getUploadForm = function() {
    return uploadForm;
};

exports.setUrl = function(url) {
    return uploadForm.element(by.model('inputText')).sendKeys(url);
};

exports.submit = function() {
    uploadForm.element(by.css('[ng-click="upload()"]')).click();
};

/**
 *
 * @param {object} opts
 * @param {object.string} opts.plugin_location
 * @param {object.string} opts.plugin_id
 * @param {object.string} opts.plugin_filename
 */
exports.setDetails = function(opts) {
    if (opts.plugin_location) {
        exports.setUrl(opts.plugin_location);
    }
};
