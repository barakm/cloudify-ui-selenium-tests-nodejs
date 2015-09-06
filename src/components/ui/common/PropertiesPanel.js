'use strict';

var logger = require('log4js').getLogger('blueprints_spec');
var TabNavigation = require('./TabNavigation');
var components = require('../../index');
var testConf = components.config.tests.sanity.blueprints_spec;

/**
 * @description
 * used to navigate between sections in floating panel
 * @param sectionName
 */
function goToSection( sectionName ){
    logger.trace('go to section ' + sectionName);
    return new TabNavigation( $('[floating-blueprint-node-panel] > .properties-panel .buttons-group > .buttons-group')).goTo(sectionName);
}

exports.goToProperties = function() {
    return goToSection(testConf.blueprints.panel_sections.properties);
};

exports.goToRelationships = function() {
    return goToSection(testConf.blueprints.panel_sections.relationships);
};

exports.close = function() {
    return element.all(by.css('[floating-blueprint-node-panel] > .properties-panel .close-properties-button')).click();
};