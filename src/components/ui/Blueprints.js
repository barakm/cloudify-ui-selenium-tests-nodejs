'use strict';

var q = require('q');
var driver = require('../driver');
var logger = require('log4js').getLogger('Blueprints');
var css = require('selenium-webdriver').By.css;
var path = require('path');

/**
 * Insert path to blueprint file from the project resources
 * @returns {promise}
 */
function injectBlueprintFile() {
    var deferred = q.defer();
    driver.get().findElement(css('#browse #fileInput')).then(function(inputFile){
        var blueprintPath = path.resolve('src/resources/cloudify-nodecellar-example.tar.gz');
        logger.info('Inject blueprint file:', blueprintPath);
        inputFile.sendKeys(blueprintPath);
        deferred.resolve();
    });
    return deferred.promise;
}

/**
 * Insert blueprint name in upload blueprint dialog
 * @param name - blueprint name
 * @returns {promise}
 */
function injectBlueprintName(name) {
    var deferred = q.defer();
    driver.get().findElement(css('#uploadForm .name input')).then(function(inputBlueprintName){
        logger.info('Inject blueprint name:', name);
        inputBlueprintName.sendKeys(name);
        deferred.resolve();
    });
    return deferred.promise;
}

/**
 * Click on save button in upload blueprint dialog
 * @returns {promise}
 */
function saveBlueprint() {
    var deferred = q.defer();
    driver.get().findElement(css('#uploadDialogContainer #uploadBtn')).then(function(saveButton){
        logger.info('clicking on "Save" button');
        saveButton.click();
        deferred.resolve(null);
    });
    return deferred.promise;
}

/**
 * Check if blueprint file is uploaded successful
 * @returns {promise}
 */
function isUploadSuccessful() {
    var deferred = q.defer();
    driver.get().findElement(css('#upload-error-message')).then(function(uploadError){
        logger.info('Wait for upload to complete...');
        driver.get().wait(function(){
            return uploadError.getText().then(function(value){
                if(value.length > 0) {
                    deferred.resolve(value);
                    return true;
                }
                else {
                    return false;
                }
            });
        }, 10000).thenCatch(function() {
            deferred.resolve(null);
        });
    });
    return deferred.promise;
}

/**
 * Upload Blueprint
 * @param {string} options.name - define name for the blueprint
 * @returns {promise}
 */
exports.uploadBlueprint = function(options) {
    var deferred = q.defer();
    driver.get().findElement(css('#main-content .content-header button')).then(function(uploadButton){
        uploadButton.click();
        logger.info('Upload blueprint button clicked');

        injectBlueprintFile().then(function(){
            injectBlueprintName(options.name).then(function(){
                saveBlueprint().then(function(){
                    isUploadSuccessful().then(function(err){
                        deferred.resolve(err);
                    });
                });
            });
        });
    });
    return deferred.promise;
};