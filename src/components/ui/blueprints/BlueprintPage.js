'use strict';

var common = require('../common');
var components = require('../../index');
var testConf = components.config.tests.sanity.blueprints_spec;
exports.Topology = common.Topology;
exports.PropertiesPanel = common.PropertiesPanel;
exports.NodesTable = common.NodesTable;
exports.Network = common.Network;
exports.Plugins = common.Plugins;
exports.Source = common.Source;

/**
 * @description
 * used to navigate between sections in blueprint page
 * @param sectionName
 */
function goToSection( sectionName ){
    return common.TabNavigation($('.sections')).goTo(sectionName);
}

exports.goToTopology = function(){
    goToSection(testConf.blueprints.sections.topology.name);
};

exports.goToNodes = function(){
    goToSection(testConf.blueprints.sections.nodes.name);
};

exports.goToPlugins = function(){
    goToSection(testConf.blueprints.sections.plugins.name);
};

exports.goToSource = function(){
    goToSection(testConf.blueprints.sections.source.name);
};