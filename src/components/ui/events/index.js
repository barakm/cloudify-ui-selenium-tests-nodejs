'use strict';

var q = require('q');
var driver = require('../../driver');
var logger = require('log4js').getLogger('Events');
var css = require('selenium-webdriver').By.css;
var async = require('async');

/**
 * Events
 * @constructor
 */
var Events = function() {

    var options = {};

    this.setOptions = function(opt){
        var deferred = q.defer();
        options = opt;
        deferred.resolve();
        return deferred.promise;
    };

    /**
     * Select options from menu filter
     * @param {elements} filter - filter menu element
     * @param {array} options - list of options to choose
     * @returns {promise}
     */
    function filterSelect(filter, options) {
        var deferred = q.defer();
        filter.click().then(function(){
            filter.findElements(css('ul li')).then(function(lis){
                async.each(lis, function(li, callback){
                    li.getText().then(function(liText){
                        if(options.indexOf(liText) > -1) {
                            li.click().then(function(){
                                callback();
                            });
                        }
                        else {
                            callback();
                        }
                    });
                }, function(err){
                    deferred.resolve(err);
                });
            });
        });
        return deferred.promise;
    }

    /**
     * Select Deployments
     * @param {array} options - list of deployments to choose
     * @returns {promise}
     */
    this.selectDeployments = function() {
        var deferred = q.defer();
        driver.get().findElement(css('#main-content .filters .filter:nth-child(2) .multiSelectMenu')).then(function(filter){
            filterSelect(filter, options.deployment).then(function(err){
                deferred.resolve(err);
            });
        });
        return deferred.promise;
    };

    /**
     * Select Timeframe
     * @param {array} options - list of timeframes to choose
     * @returns {promise}
     */
    this.selectTimeframe = function() {
        var deferred = q.defer();
        driver.get().findElement(css('#main-content .filters .filter:nth-child(3) .multiSelectMenu')).then(function(filter){
            filterSelect(filter, options.timeframe).then(function(err){
                deferred.resolve(err);
            });
        });
        return deferred.promise;
    };

    /**
     * Click on show button to display results
     * @returns {promise}
     */
    this.show = function() {
        var deferred = q.defer();
        driver.get().findElement(css('#main-content .filters .gs-btn')).then(function(showBtn){
            showBtn.click().then(function(){
                deferred.resolve();
            });
        });
        return deferred.promise;
    };

    /**
     * Get list of events and logs
     * @returns {promise}
     */
    this.getResults = function() {
        var deferred = q.defer();
        driver.get().findElements(css('#main-content .eventsTable tbody')).then(function(results){
            driver.get().wait(function(){
                logger.info('Number of logs and events:', results.length);
                return results.length > 0;
            }, 300000).then(function(){
                deferred.resolve(results);
            }).thenCatch(function(){
                deferred.resolve(results);
            });
        });
        return deferred.promise;
    };

};

module.exports = Events;