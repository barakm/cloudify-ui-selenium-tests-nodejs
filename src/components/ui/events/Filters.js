'use strict';

var MultiSelectMenu = require('../common/MultiSelectMenu');
var Datepicker = require('../common/DatePicker');
var Input = require('../common/Input');
var elementsFilters = require('../../Utils/Filters');

var filters = {
    blueprints:{},
    deployments:{},
    logLevels:{},
    eventTypes:{},
    timeRange:{},
    messageText:{},
    clearFilters:{},
    columnsOrganizer:{}
};

filters.blueprints = new MultiSelectMenu(element(by.name('blueprints')));
filters.deployments = new MultiSelectMenu(element(by.name('deployments')));
filters.logLevels = new MultiSelectMenu(element(by.name('logLevels')));
filters.eventTypes = new MultiSelectMenu(element(by.name('eventTypes')));

filters.timeRange.gte = new Datepicker(element.all(by.css('[predicate=timestamp]>span')).get(0));
filters.timeRange.lte = new Datepicker(element.all(by.css('[predicate=timestamp]>span')).get(1));

filters.messageText = new Input(element(by.css('[ng-model="eventsFilter.messageText"]')));

filters.clearFilters = function(){
    return element(by.css('button[ng-click="resetFilters()"]')).click();
};

filters.columnsOrganizer.toggle = function(column){
    element(by.css('#columns-organizer button')).click();
    elementsFilters.filterByText(element.all(by.css('#columns-organizer li span')), column).click();
    element(by.css('#columns-organizer button')).click();
};

module.exports = filters;