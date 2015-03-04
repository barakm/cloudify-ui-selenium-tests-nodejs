'use strict';

var q = require('q');
var logger = require('log4js').getLogger('Blueprints');
var Actions = require('./Actions');
var Page = require('./Page');
var Monitoring = require('./Monitoring');

/**
 * Create new instance of Action
 * @returns {promise}
 */
exports.actions = function(){
    var deferred = q.defer();
    deferred.resolve(new Actions());
    return deferred.promise;
};

/**
 * Create new instance of Page
 * @returns {promise}
 */
exports.page = function() {
    var deferred = q.defer();
    deferred.resolve(new Page());
    return deferred.promise;
};

/**
 * Create new instance of Monitoring
 * @returns {promise}
 */
exports.monitoring = function() {
    var deferred = q.defer();
    deferred.resolve(new Monitoring());
    return deferred.promise;
};