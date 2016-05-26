'use strict';


//var logger = require('log4js').getLogger('Blueprints.CreateDeployments');


/**
 * Set deployment name on create deployment dialog
 * @returns {promise}
 */
exports.setName = function(name) {
    return element(by.model('deploymentId')).sendKeys(name);
};

/** Click on 'Raw' tab on create deployment dialog
 */
exports.clickOnRaw = function() {
    element.all(by.css('.deploy-dialog .deployInputs .buttons-group button')).then(function(btns) {
        btns[1].click();
    });
};

/**
 * Set Deployment Params
 * @returns {promise}
 * @deprecated use setRaw instead
 */
exports.setParams = function( params ) {
    return element(by.model('rawString')).clear().sendKeys(JSON.stringify(params));
};

exports.setRaw = exports.setParams;

/**
 * Click on create button on create deployment dialog to complete the creation of new deployment
 * @returns {promise}
 */
exports.deploy = function() {
    return element(by.css('.deploy-dialog .buttonsContainer button')).click();
};

exports.submit = exports.deploy;
exports.confirm = exports.deploy;

/**
 * @param {object} opts
 * @param {string} opts.raw raw string to set in raw
 * @param {string} opts.name name of blueprint
 */
exports.setDetails = function( opts ){
      if ( opts.name ){
          exports.setName(opts.name);
      }

    if ( opts.raw ){
        exports.clickOnRaw();
        exports.setRaw(opts.raw);
    }
    return browser.sleep(1); // return a promise that will run last..
};
