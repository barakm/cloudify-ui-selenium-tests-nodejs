'use strict';

var q = require('q');
var driver = require('../driver');
var logger = require('log4js').getLogger('Blueprints');
var css = require('selenium-webdriver').By.css;
var path = require('path');

/**
 * Upload New Blueprint
 * @constructor
 */
var UploadBlueprint = function() {

    /**
     * Insert path to blueprint file from the project resources
     * @returns {promise}
     */
    this.setFile = function() {
        var deferred = q.defer();
        driver.get().findElement(css('#browse #fileInput')).then(function(inputFile){
            var blueprintPath = path.resolve('src/resources/cloudify-nodecellar-example.tar.gz');
            logger.info('Inject blueprint file:', blueprintPath);
            inputFile.sendKeys(blueprintPath);
            deferred.resolve();
        });
        return deferred.promise;
    };

    /**
     * Insert blueprint name in upload blueprint dialog
     * @param name - blueprint name
     * @returns {promise}
     */
    this.setName = function(name) {
        var deferred = q.defer();
        driver.get().findElement(css('#uploadForm .name input')).then(function(inputBlueprintName){
            logger.info('Inject blueprint name:', name);
            inputBlueprintName.sendKeys(name);
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

/**
 * Create New Deployment
 * @constructor
 */
var CreateDeployment = function() {

    /**
     * Set deployment name on create deployment dialog
     * @param {string} name - deployment name
     * @returns {promise}
     */
    this.setName = function(name) {
        var deferred = q.defer();
        driver.get().findElement(css('#deployDialogContainer .dialogDeploymentName input')).then(function(inputDeploymentName){
            logger.info('Inject deployment name:', name);
            inputDeploymentName.sendKeys(name);
            deferred.resolve();
        });
        return deferred.promise;
    };

    /**
     * Set Deployment Params
     * @param paramsArr - array of params to inject in create deployment dialog
     * @returns {promise}
     */
    this.setParams = function(paramsArr) {
        var deferred = q.defer();
        driver.get().findElements(css('#deployDialogContainer .inputsParameters input')).then(function(inputs){
            for(var i = 0; i < inputs.length || deferred.resolve(); i++) {
                if(paramsArr[i]) {
                    inputs[i].sendKeys(paramsArr[i]);
                }
            }
        });
        return deferred.promise;
    };

    /**
     * Click on create button on create deployment dialog to complete the creation of new deployment
     * @returns {promise}
     */
    this.deploy = function() {
        var deferred = q.defer();
        driver.get().findElement(css('#deployBtn')).then(function(createButton){
            logger.info('clicking on "create" button');
            driver.get().wait(function(){
                return createButton.isEnabled();
            }, 1000).then(function(){
                createButton.click();
                deferred.resolve();
            }).thenCatch(function(){
                deferred.resolve('Unable to click on "create" button');
            });
        });
        return deferred.promise;
    };

};


/**
 * Export full scenario of uploads new blueprint
 * @param {string} options.name - define name for the blueprint
 * @returns {promise}
 */
exports.uploadBlueprint = function(options) {
    var uploadBlueprint = new UploadBlueprint();
    var deferred = q.defer();
    driver.get().findElement(css('#main-content .content-header button')).then(function(uploadButton){
        uploadButton.click();
        logger.info('Upload blueprint button clicked');

        uploadBlueprint.setFile().then(function(){
            uploadBlueprint.setName(options.name).then(function(){
                uploadBlueprint.save().then(function(){
                    uploadBlueprint.isUploadSuccessful().then(function(err){
                        deferred.resolve(err);
                    });
                });
            });
        });
    });
    return deferred.promise;
};

/**
 * Export full scenario of Creation of new deployment
 * @returns {webdriver.promise.|Document.promise|promise|*|webdriver.test.promise|webdriver.testing.promise}
 */
exports.createDeployment = function(options) {
    var createDeployment = new CreateDeployment();
    var deferred = q.defer();
    driver.get().findElement(css('#main-content .table tr:first-child .deploy-button')).then(function(blueprintsTable){
        blueprintsTable.click();
        createDeployment.setName(options.name).then(function(){
            createDeployment.setParams(options.params).then(function(){
                createDeployment.deploy().then(function(err){
                    deferred.resolve(err);
                });
            });
        });

    });
    return deferred.promise;
};