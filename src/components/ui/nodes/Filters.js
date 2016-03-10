'use strict';

var MultiSelectMenu = require('../common/MultiSelectMenu');
var Input = require('../common/Input');

var filters = {
    blueprints:{},
    deployments:{},
    types:{},
    freeText:{},
    clearFilters:{}
};

filters.blueprints = new MultiSelectMenu(element(by.name('blueprints')), false);
filters.deployments = new MultiSelectMenu(element(by.name('deployments')));
filters.types = new MultiSelectMenu(element(by.name('types')));

filters.freeText = new Input($('[data-ng-model="nodesInstancesFilter.search"]'));

filters.clearFilters = function(){
    element(by.css('.filters .gs-btn')).click();
};

module.exports = filters;