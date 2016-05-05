'use strict';

var common = require('../common');
var components = require('../../index');
var testConf = components.config.tests.sanity.blueprints_spec;
exports.Topology = common.Topology;
exports.PropertiesPanel = common.PropertiesPanel;
exports.NodesTable = common.NodesTable;
exports.Network = common.Network;
exports.Source = common.Source;

/**
 * @description
 * used to navigate between sections in blueprint page
 * @param sectionName
 */
function goToSection( sectionName ){
    return common.TabNavigation($('.sections')).goTo(sectionName);
}

function getBreadCrumbs() {
    return element.all(by.css('.breadcrumbs li'));
}

exports.goToTopology = function(){
    goToSection(testConf.blueprints.sections.topology);
};

exports.goToNodes = function(){
    goToSection(testConf.blueprints.sections.nodes);
};

exports.goToSource = function(){
    goToSection(testConf.blueprints.sections.source);
};

exports.goFromBreadCrumbsToBlueprints = function() {
    getBreadCrumbs().then(function(items){
        items[0].click();
    });
    expect(browser.getCurrentUrl()).toContain('blueprints');
};

exports.checkBreadCrumbsContent = function(blueprintName){

    getBreadCrumbs().then(function(items) {
        expect(items.length).toBe(2);
        expect(items[0].getText()).toBe('Blueprints');
        expect(items[1].getText()).toBe(blueprintName);
    });

    expect(element(by.css('.breadcrumbs li a')).getAttribute('href')).toContain('/#/blueprints');
    browser.executeScript("return window.getComputedStyle(jQuery('.breadcrumbs li')[0], ':after').content")
        .then(function(content){
            expect(content).toBe('">"');
        });
};