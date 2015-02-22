'use strict';

var q = require('q');
var driver = require('../driver');
var logger = require('log4js').getLogger('Layout');
var css = require('selenium-webdriver').By.css;

/**
 *
 * @returns promise - function( href value )
 */
exports.getSpecLink = function(){
    var deferred = q.defer();
    // todo : add class to each link so we can know which is which
    driver.get().findElement(css('#footer #smallFooter  .links  li:nth-child(3) a')).then(function(element){
        logger.info('got link element. looking for href');
        element.getAttribute('href').then(function(value){
            deferred.resolve(value);
        });
    });
    return deferred.promise;
};
