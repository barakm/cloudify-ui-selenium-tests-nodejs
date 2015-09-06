'use strict';

var logger = require('log4js').getLogger('BlueprintIndexPage');
var common = require('../common');

exports.getBlueprints = function(){
    return element.all(by.css('.gs-table tbody'));
};

/**
 *
 * @description returns a promise the fulfills with the first blueprint found according to opts specification.
 * <p>
 * for example:
 * if opts.name = 'X' - then it will return the first blueprint with name X.
 * </p>
 *
 * @param {object} opts contains information to find the blueprint
 * @param {string} opts.name the name of the blueprint
 * @returns {webdriver.promise.Deferred.promise|*}
 */
exports.getBlueprint = function( opts ){
    logger.trace('getting blueprint by ', opts );
    var deferred = protractor.promise.defer();
    exports.getBlueprints().filter(function(blueprint){
        return blueprint.element(by.css('.name')).getText().then(function( text ){
            return text === opts.name;
        });
    }).then(function(filtered){
        deferred.fulfill(filtered[0]);
    });

    return deferred.promise;
};

exports.goToBlueprint = function( opts ){
    return exports.getBlueprint(opts).then(function(blueprint){
        return blueprint.all(by.css('.name a')).click();
    });
};

exports.createDeployment = function(opts) {
    return exports.getBlueprint(opts).then(function(blueprint){
        new common.ActionsDropdown(blueprint).clickMenuOption('Create Deployment');
    });
};

exports.createDeploymentWithDefaultBtn = function(opts) {
    return exports.getBlueprint(opts).then(function(blueprint){
        new common.ActionsDropdown(blueprint).clickDefaultAction();
    });
};
/**
 *
 * @param {object} opts
 * @param {object.string} opts.blueprint_location
 * @param {object.string} opts.blueprint_id
 * @param {object.string} opts.blueprint_filename
 */
exports.uploadBlueprint = function(opts){
    element(by.css('[ng-click="openAddDialog()"]')).click();
    var uploadForm = element(by.css('#uploadForm '));
    uploadForm.element(by.model('inputText')).sendKeys(opts.blueprint_location);
    uploadForm.element(by.model('blueprintUploadOpts.blueprint_id')).sendKeys(opts.blueprint_id);
    uploadForm.element(by.model('blueprintUploadOpts.params.application_file_name')).sendKeys(opts.blueprint_filename);
    uploadForm.element(by.css('[ng-click="uploadFile()"]')).click();

};

// used in conjunction with uploadBlueprint
// waits until blueprint appears
/**
 *
 * @description
 * waits until the URL changes to the blueprint url.
 * this means the upload is done successfully.
 *
 * @param {object} opts
 * @param {string} opts.name
 */
exports.waitForUploadDone = function( opts ){
    browser.wait(function() {
        return browser.getCurrentUrl().then(function(url){
            return url.indexOf(opts.name) > 0;
        });
    }, 60000);
};

exports.deleteBlueprint = function(opts) {
    return exports.getBlueprint(opts).then(function(blueprint){
        new common.ActionsDropdown(blueprint).clickMenuOption('Delete');
    }).then(function(){
        return element(by.css('[ng-click="confirmDelete()"]')).click();
    });
};