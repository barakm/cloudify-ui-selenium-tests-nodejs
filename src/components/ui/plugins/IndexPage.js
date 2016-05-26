'use strict';

var logger = require('log4js').getLogger('PluginIndexPage');
var common = require('../common');

exports.getPlugins = function() {
    return element.all(by.css('.gs-table tbody'));
};


/**
 * @typedef {object} PluginOpts
 * @property {string} name
 */

/**
 *
 * @description returns a promise the fulfills with the first plugin found according to opts specification.
 * <p>
 * for example:
 * if opts.name = 'X' - then it will return the first plugin with name X.
 * </p>
 *
 * @param {object} opts contains information to find the plugin
 * @param {string} opts.name the name of the plugin
 * @param {boolean} optional whether to expect existence or not.
 * @returns {webdriver.promise.Deferred.promise|*}
 */
exports.getPlugin = function(opts, optional) {
    logger.trace('getting plugin by ', opts);
    return exports.getPlugins().filter(function(plugin) {
        if (opts.package_name) {
            return plugin.element(by.css('.name')).getText().then(function(text) {
                return text === opts.package_name;
            });
        }
        if (opts.id) {
            return plugin.element(by.css('.id')).getText().then(function(text) {
                return text === opts.id;
            });
        }
    }).then(function(filtered) {
        if (!optional) {
            expect(filtered.length).toBe(1, 'plugin ' + JSON.stringify(opts) + ' should exist');
        }
        return filtered[0];
    });
};

/**
 *
 * @param {PluginOpts} opts
 * @returns {*}
 */
exports.goToPlugin = function(opts) {
    return exports.getPlugin(opts).then(function(plugin) {
        expect(!!plugin).toBe(true, 'plugin ' + JSON.stringify(opts) + ' should exist');
        return plugin.all(by.css('.id a')).click();
    });
};

exports.clickUploadPlugin = function() {
    element(by.css('[ng-click="uploadPlugin()"]')).click();
    return browser.sleep(1000); // fade in effect??
};

// used in conjunction with uploadPlugin
// waits until plugin appears
/**
 *
 * @description
 * waits until the URL changes to the plugin url.
 * this means the upload is done successfully.
 *
 * @param {object} opts
 * @param {string} opts.name
 */
exports.waitForUploadDone = function(opts) {
    browser.wait(function() {
        return browser.getCurrentUrl().then(function(url) {
            return url.indexOf(opts.name) > 0;
        });
    }, 60000);
};

exports.deletePlugin = function(opts) {
    return exports.getPlugin(opts).then(function(plugin) {
        new common.ActionsDropdown(plugin).clickMenuOption('Delete');
    }).then(function() {
        return element(by.css('[ng-click="confirm({target: target})"]')).click();
    });
};

exports.downloadPlugin = function(opts) {
    return exports.getPlugin(opts).then(function(plugin) {
        new common.ActionsDropdown(plugin).clickMenuOption('Download');
    });
};

exports.selectPlugin = function(index) {
    $$('[ng-click="select(plugin)"]').get(index).click();
};