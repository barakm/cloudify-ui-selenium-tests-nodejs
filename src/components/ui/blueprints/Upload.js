'use strict';

var q = require('q');
var driver = require('../../driver');
var logger = require('log4js').getLogger('Blueprints.Upload');
var css = require('selenium-webdriver').By.css;
var path = require('path');

/**
 * Upload New Blueprint
 * @constructor
 */
var UploadBlueprint = function() {

    var options = {};

    /**
     * Set Options
     * @param {string} opt.name - blueprint name
     * @returns {UploadBlueprint}
     */
    this.setOptions = function(opt) {
        logger.info('setOptions');
        var deferred = q.defer();
        options = opt;
        deferred.resolve();
        return deferred.promise;
    };

    /**
     * Open new dialog of upload blueprint
     * @returns {promise}
     */
    this.openDialog = function() {
        var deferred = q.defer();
        logger.info('Open dialog box');
        driver.get().findElement(css('#main-content .content-header button')).then(function(uploadButton){
            uploadButton.click().then(function(){
                logger.info('Upload blueprint button clicked');
                deferred.resolve();
            });
        });
        return deferred.promise;
    };

    /**
     * Insert path to blueprint file from the project resources
     * @returns {promise}
     */
    this.setFile = function() {
        var deferred = q.defer();
        driver.get().findElement(css('#browse #fileInput')).then(function(inputFile){
            var blueprintPath = path.resolve(options.path);
            logger.info('Inject blueprint file:', blueprintPath);
            inputFile.sendKeys(blueprintPath);
            deferred.resolve();
        });
        return deferred.promise;
    };

    /**
     * Insert blueprint name in upload blueprint dialog
     * @returns {promise}
     */
    this.setName = function() {
        var deferred = q.defer();
        driver.get().findElement(css('#uploadForm .name input')).then(function(inputBlueprintName){
            logger.info('Inject blueprint name:', options.name);
            inputBlueprintName.sendKeys(options.name);
            deferred.resolve();
        });
        return deferred.promise;
    };

    /**
     * Click on save button in upload blueprint dialog
     * @returns {promise}
     */
    this.save = function() {
        var deferred = q.defer();
        driver.get().findElement(css('#uploadDialogContainer #uploadBtn')).then(function(saveButton){
            logger.info('clicking on "Save" button');
            saveButton.click();
            deferred.resolve();
        });
        return deferred.promise;
    };

    /**
     * Check if blueprint file is uploaded successful
     * @returns {promise}
     */
    this.isUploadSuccessful = function() {
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

};

module.exports = UploadBlueprint;
