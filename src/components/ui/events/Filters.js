var actions = require('../common/Actions');
var elementsFilters = require('../common/Filters');

var filters = {
    blueprints:{},
    deployments:{},
    logLevels:{},
    clearFilters:{},
    columnsOrganizer:{}
};


filters.blueprints.uncheckAll = function() {
    var opts = {base: element(by.name('blueprints'))};
    actions.uncheckAllDropdownOptions(opts);
};

filters.blueprints.select = function(blueprint) {
    var opts = {base: element(by.name('blueprints')), optionName: blueprint};
    actions.selectDropdownOption(opts);
};

filters.blueprints.getSelected = function() {
    var multiSelectElement = element(by.name('blueprints'));
    return actions.getSelectedOptions(multiSelectElement);
};

filters.blueprints.toggle = function() {
    element(by.name('blueprints')).element(by.css('.msArrow')).click();;
};


filters.deployments.uncheckAll = function() {
    var opts = {base: element(by.name('deployments'))};
    actions.uncheckAllDropdownOptions(opts);
};

filters.deployments.select = function(deployment) {
    var opts = {base: element(by.name('deployments')), optionName: deployment};
    actions.selectDropdownOption(opts);
};

filters.deployments.getSelected = function() {
    var multiSelectElement = element(by.name('deployments'));
    return actions.getSelectedOptions(multiSelectElement);
};

filters.deployments.toggle = function() {
    element(by.name('deployments')).element(by.css('.msArrow')).click();;
};


filters.logLevels.uncheckAll = function() {
    var opts = {base: element(by.name('logLevels'))};
    actions.uncheckAllDropdownOptions(opts);
};

filters.logLevels.select = function(level){
    var opts = {base: element(by.name('logLevels')), optionName: level};
    actions.selectDropdownOption(opts);
};

filters.logLevels.getSelected = function() {
    var multiSelectElement = element(by.name('logLevels'));
    return actions.getSelectedOptions(multiSelectElement);
};

filters.logLevels.toggle = function() {
    element(by.name('logLevels')).element(by.css('.msArrow')).click();;
};


filters.clearFilters = function(){
    element(by.css('button[data-ng-click="clearFilters()"]')).click();
};


filters.columnsOrganizer.toggle = function(column){
    element(by.css('#columns-organizer')).click();
    elementsFilters.filterByText(element.all(by.css('#columns-organizer li span')), column).click();
    element(by.css('#columns-organizer')).click();
};

module.exports = filters;