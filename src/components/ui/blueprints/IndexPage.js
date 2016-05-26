'use strict';

var logger = require('log4js').getLogger('BlueprintIndexPage');
var common = require('../common');

exports.getBlueprints = function(){
    return element.all(by.css('.gs-table tbody'));
};


/**
 * @typedef {object} BlueprintOpts
 * @property {string} name
 */

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
 * @param {boolean} optional whether to expect existence or not.
 * @returns {webdriver.promise.Deferred.promise|*}
 */
exports.getBlueprint = function( opts, optional ){
    logger.trace('getting blueprint by ', opts );
    return exports.getBlueprints().filter(function(blueprint){
        return blueprint.element(by.css('.name')).getText().then(function( text ){
            return text === opts.name;
        });
    }).then(function(filtered){
        if ( !optional ) {
            expect(filtered.length).toBe(1, 'blueprint ' + JSON.stringify(opts) + ' should exist');
        }
        return filtered[0];
    });
};

/**
 *
 * @param {BlueprintOpts} opts
 * @returns {*}
 */
exports.goToBlueprint = function( opts ){
    return exports.getBlueprint(opts).then(function(blueprint){
        expect(!!blueprint).toBe(true, 'blueprint ' + JSON.stringify(opts) + ' should exist');
        return blueprint.all(by.css('.name a')).click();
    });
};

/**
 *
 * @param {BlueprintOpts} opts
 * @returns {*}
 */
exports.createDeployment = function(opts) {
    return exports.getBlueprint(opts).then(function(blueprint){
        new common.ActionsDropdown(blueprint).clickMenuOption('Create Deployment');
        return browser.sleep(1000); //fade in
    });
};

exports.createDeploymentWithDefaultBtn = function(opts) {
    return exports.getBlueprint(opts).then(function(blueprint){
        new common.ActionsDropdown(blueprint).clickDefaultAction();
    });
};

exports.clickUploadBlueprint = function(){
    element(by.css('[upload-blueprint-button] button')).click();
    return browser.sleep(1000); // fade in effect??
};

exports.uploadBlueprint = exports.clickUploadBlueprint;

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
        return element.all(by.css('.buttonsContainer button')).last().click();
    });
};

exports.selectBlueprint = function(index){
  $$('[ng-click="select(blueprint)"]').get(index).click();
};

exports.route = function(){
    browser.get('/#/blueprints');
    browser.waitForAngular();
};

exports.getSelectedBlueprintIndex = common.IndexTable.getSelectedItemIndex;