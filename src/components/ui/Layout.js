'use strict';

var logger = require('log4js').getLogger('Layout');
var common = require('./common');

/**
 *
 * @returns promise - function( href value )
 */
exports.getSpecLink = function(){
    //var deferred = q.defer();
    //// todo : add class to each link so we can know which is which
    //driver.get().findElement(css('#footer #smallFooter  .links  li:nth-child(3) a')).then(function(element){
    //    logger.info('got link element. looking for href');
    //    element.getAttribute('href').then(function(value){
    //        deferred.resolve(value);
    //    });
    //});
    //return deferred.promise;
};

exports.goToView = function(viewName) {
    logger.trace('changing view to ' + viewName);
    return common.SideMenu.goTo(viewName);
};

exports.goToBlueprints = function(){ return common.SideMenu.goTo('blueprints'); };
exports.goToDeployments = function(){ return common.SideMenu.goTo('deployments'); };
exports.goToPlugins = function(){ return common.SideMenu.goTo('plugins'); };
exports.goToLogsEvents = function(){ return common.SideMenu.goTo('Logs & Events'); };
