'use strict';

var common = require('../common');

exports.closeEventsPanel = function() {
    browser.actions().mouseDown($('[deployment-events] .dragBtn')).perform();
    browser.actions().mouseMove({x: 0, y: 700}).perform();
    browser.actions().mouseUp().perform();
};

exports.getNodePropertiesPanel = function(){
    return $('[floating-deployment-node-panel]');
};

exports.deleteDeployment = function() {
        new common.ActionsDropdown($('body')).clickMenuOption('Delete');
};
