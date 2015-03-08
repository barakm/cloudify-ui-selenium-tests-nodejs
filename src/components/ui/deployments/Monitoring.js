'use strict';

var q = require('q');
var driver = require('../../driver');
var logger = require('log4js').getLogger('Deployments.Monitoring');
var css = require('selenium-webdriver').By.css;
var async = require('async');

/**
 * Monitoring
 * @constructor
 */
var Monitoring = function() {

    /**
     * Check if monitoring screen is loaded successfully
     * @returns {promise}
     */
    this.isMonitoringLoads = function() {
        var deferred = q.defer();
        driver.get().findElement(css('.grafanaLoader')).then(function(loader){
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
            }, 100000).thenCatch(function(){
                deferred.resolve(false);
            })
        });
        return deferred.promise;
    };

    /**
     * Get list of available charts
     * @returns {promise}
     */
    this.getCharts = function() {
        var deferred = q.defer();
        driver.get().findElement(css('.monitoringIframe')).then(function(iframe){
            driver.get().switchTo().frame(iframe).then(function(){
                driver.get().findElements(css('.panel')).then(function(panels){
                    deferred.resolve(panels);
                });
            });
        });
        return deferred.promise;
    };

    /**
     * Check if chart panel is getting and display data
     * @param {array} panels - list of chart panel elements
     * @returns {promise}
     */
    this.checkPanels = function(panels){
        var deferred = q.defer();
        async.each(panels, function(panel, callback){
            panel.findElement(css('.panel-content .datapoints-warning')).then(function(warning){
                driver.get().wait(function(){
                    return warning.isDisplayed().then(function(){
                        if(displayed) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    })
                }, 200000).then(function(){
                    callback();
                }).thenCatch(function(){
                    callback('No datapoints or Datapoints outside time range');
                })
            }).thenCatch(function(){
                logger.info('warning element not found, all ok!');
                callback();
            })
        }, function(err){
            deferred.resolve(err);
        });
        return deferred.promise;
    };

};

module.exports = Monitoring;