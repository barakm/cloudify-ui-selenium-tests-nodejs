'use strict';

var q = require('q');
var driver = require('../../driver/index');
var logger = require('log4js').getLogger('Deployments.Page');
var css = require('selenium-webdriver').By.css;

/**
 * Deployments page
 * @constructor
 */
var Page = function() {

    /**
     * Select Deployment by position number
     * @param {int} position - position number on the list
     * @returns {promise}
     */
    this.selectByPosition = function(position) {
        var deferred = q.defer();
        // define default child
        if(!position || position < 1) {
            position = 1;
        }
        // get the selected deployment row
        driver.get().findElement(css('#deploymentTable tbody tr:nth-child(' + position + ')')).then(function(deploymentRow){
            deferred.resolve(deploymentRow);
        });
        return deferred.promise;
    };

    /**
     * Wait for Initializing deployment to complete
     * @returns {promise}
     */
    this.onInitializedComplete = function() {
        var deferred = q.defer();
        driver.get().findElement(css('#deployment-header .deploymentLoader')).then(function(loader){
            driver.get().wait(function(){
                return loader.isDisplayed().then(function(displayed){
                    if(!displayed) {
                        deferred.resolve(true);
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }, 200000).thenCatch(function(){
                deferred.resolve(false);
            });
        });
        return deferred.promise;
    };

    /**
     * Get the header element of a deployment page
     * @returns {promise}
     */
    this.getHeader = function() {
        var deferred = q.defer();
        driver.get().wait(function(){
            return driver.get().findElement(css('#deployment-header')).then(function(header){
                if(header.isDisplayed()) {
                    logger.info('header is displayed!');
                    return header;
                }
                else {
                    logger.info('header is not display yes');
                    return false;
                }
            });
        }, 200000).then(function(header){
            logger.info('header is on, resolve now!');
            deferred.resolve(header);
        }).thenCatch(function(){
            logger.info('Header is undetected, Timeout!');
            deferred.resolve('Header is undetected');
        });
        return deferred.promise;
    };

    /**
     * Wait for approximately 3 minutes for the install to be complete
     * @returns {promise}
     */
    this.isInstallSuccessful = function() {
        var deferred = q.defer();
        driver.get().findElement(css('#appStatus .gauge')).then(function(gauge){
            driver.get().wait(function(){
                return gauge.getText().then(function(status){
                    logger.info('App Status:', status + '%');
                    if(status === '100') {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }, 900000).then(function(){
                deferred.resolve(null);
            }).thenCatch(function(){ // it should complete the install within 15 min
                deferred.resolve('Install failed!');
            });
        });
        return deferred.promise;
    };

    /**
     * Switch tabs
     * @param {string} section - tab label text
     * @returns {promise}
     */
    this.switchTab = function(section) {
        var deferred = q.defer();
        driver.get().findElements(css('#deployment-header .buttons-group.sections button')).then(function(tabs){
            var count = 0;
            var findTab = false;
            function handleTab(tab){
                tab.getText().then(function(tabText){
                    count++;
                    if(tabText === section) {
                        findTab = true;
                        tab.click().then(function(){
                            deferred.resolve();
                        });
                    }
                    if(!findTab && count === tabs.length) {
                        deferred.resolve('Unable to find any tab match for you request');
                    }
                });
            }
            for(var i = 0; i < tabs.length; i++) {
                handleTab(tabs[i]);
            }
        });
        return deferred.promise;
    };

    /**
     * Get topology hosts list
     * @returns {promise}
     */
    this.getTopologyHosts = function() {
        var deferred = q.defer();
        driver.get().findElements(css('.bpContainer > div > .box')).then(function(hosts){
            deferred.resolve(hosts);
        });
        return deferred.promise;
    };

    /**
     * Get networks list
     * @returns {promise}
     */
    this.getNetworks = function(){
        var deferred = q.defer();
        driver.get().findElements(css('.networksContainer > .network')).then(function(networks){
            deferred.resolve(networks);
        });
        return deferred.promise;
    };

    /**
     * Get nodes list
     * @returns {promise}
     */
    this.getNodes = function(){
        var deferred = q.defer();
        driver.get().findElements(css('.nodesTable .gs-table tbody')).then(function(networks){
            deferred.resolve(networks);
        });
        return deferred.promise;
    };

    /**
     * Get executions list
     * @returns {promise}
     */
    this.getExecutions = function(){
        var deferred = q.defer();
        driver.get().findElements(css('.executions .gs-table tbody')).then(function(networks){
            deferred.resolve(networks);
        });
        return deferred.promise;
    };

};

module.exports = Page;
