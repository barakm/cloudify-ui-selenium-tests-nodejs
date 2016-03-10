'use strict';

var utils = require('../../Utils');
var mainTable = {pagination:{},timestamp:{}, logLevel:{}};

mainTable.countRows = function() {
    return element.all(by.css('.eventsTable tbody')).count().then(function(count){
        return count;
    });
};

mainTable.clickEvent = function(eventRowNum){
    var eventRow = element.all(by.css('.eventsTable tbody tr[data-ng-click]')).get(eventRowNum);
    // todo: take top navbar into consideration
    //utils.view.scrollIntoView(eventRow);
    return eventRow.click();
};

mainTable.isEventInfoOpen = function(eventRowNum){
    return element.all(by.css('.eventsTable tbody')).get(eventRowNum).$('tr:nth-child(2n)').isPresent();
};

mainTable.getEventInfo = function(eventRowNum){
    var eventInfoRow = element.all(by.css('.eventsTable tbody')).get(eventRowNum).$('tr:nth-child(2n)');
    return eventInfoRow.$$('span.ng-binding').getText().then(function(texts){
        var eventInfo = {};
        for( var i = 0; i < texts.length; i++){
            var infoKey = texts[i].split(':').shift();
            var infoValue = (texts[i].split(':').slice(1)).join(':').trim();
            eventInfo[infoKey] = infoValue;
        }
        return eventInfo;
    });
};

mainTable.isDatesOrdered = function(dates, reverseOrder){
    var ordered = true;
    for(var i = 0; i<dates.length -1; i++){
        if(reverseOrder && (new Date(dates[i]).getTime() < new Date(dates[i+1]).getTime())) {
            ordered = false;
            break;
        }
        if(!reverseOrder && (new Date(dates[i]).getTime() > new Date(dates[i+1]).getTime())){
            ordered = false;
            break;
        }
    }
    return ordered;
};

mainTable.pagination.goToPage = function(pageNum){
    utils.view.scrollIntoView(element(by.css('div.pagination')));
    utils.filters.filterByText($$('div.pagination li a'),String(pageNum)).first().click();
};

mainTable.pagination.isPageActive = function(pageNum){
    utils.view.scrollIntoView(element(by.css('div.pagination')));
    return utils.filters.filterByText($$('ul.pagination li'),String(pageNum)).first().getAttribute('class').then(function(attr){
        return attr.indexOf('active') !== -1;
    });
};


function EventsTableColumn(columnClass){
    this.getHeader = function(){
        return element(by.css('.eventsTable p.'+columnClass));
    };

    this.getCells = function(){
        return element.all(by.css('.eventsTable p.'+columnClass));
    };

    this.getValues = function(){
        return element.all(by.css('.eventsTable p.'+columnClass)).getText();
    };

    this.sort = function(){
            return element(by.css('.eventsTable th .'+columnClass+' span')).click();
    };
}

mainTable.timestamp = new EventsTableColumn('date');
mainTable.logLevel = new EventsTableColumn('level');
mainTable.eventType = new EventsTableColumn('type');
mainTable.eventMessage = new EventsTableColumn('task');


module.exports = mainTable;