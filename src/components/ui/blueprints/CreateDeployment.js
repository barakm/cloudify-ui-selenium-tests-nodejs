'use strict';

var q = require('q');
var driver = require('../../driver');
var logger = require('log4js').getLogger('Blueprints.CreateDeployments');
var css = require('selenium-webdriver').By.css;

/**
 * Create New Deployment
 * @constructor
 */
var CreateDeployment = function() {

    var options = {};

    /**
     * Set Options
     * @param {string} opt.name - deployment name
     * @param {array} opt.params - array of params to inject in create deployment dialog
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
     * Open new dialog of create new deployment
     * @returns {promise}
     */
    this.openDialog = function() {
        var deferred = q.defer();
        logger.info('Open dialog box');
        driver.get().findElement(css('#main-content .gs-table tbody tr:first-child .deploy-button')).then(function(blueprintsTable){
            blueprintsTable.click().then(function(){
                logger.info('Create deployment button clicked');
                deferred.resolve();
            });
        });
        return deferred.promise;
    };

    /**
     * Set deployment name on create deployment dialog
     * @returns {promise}
     */
    this.setName = function() {
        var deferred = q.defer();
        driver.get().findElement(css('#deployDialogContainer .dialogDeploymentName input')).then(function(inputDeploymentName){
            logger.info('Inject deployment name:', options.name);
            inputDeploymentName.sendKeys(options.name);
            deferred.resolve();
        });
        return deferred.promise;
    };

    /**
     * Set Deployment Params
     * @returns {promise}
     */
    this.setParams = function() {
        var deferred = q.defer();
        driver.get().findElements(css('#deployDialogContainer .inputsParameters input')).then(function(inputs){
            for(var i = 0; i < inputs.length || deferred.resolve(); i++) {
                if(options.params[i]) {
                    inputs[i].sendKeys(options.params[i]);
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

module.exports = CreateDeployment;
