'use strict';
var logger = require('log4js').getLogger('blueprints_spec');
var components = require('../../src/components/index');
var events = components.ui.events.page;
var config = components.config.tests.sanity.events_spec;

describe('logs & events page', function() {

    /* @@@@@@@@@@@@@@@@@@@@@@@@@@
            HELPER FUNCTIONS
       @@@@@@@@@@@@@@@@@@@@@@@@@@ */

    //protractor fails to wait for debounce
    function waitingForDebounce(){
        browser.sleep(500);
    }

    function isAllValuesEqualTo(array, value) {
        var isIt = true;
        for(var i = 0; i < array.length; i++){
            if(array[i] !== value){
                isIt = false;
                break;
            }
        }
        return isIt;
    }

    function dateToDatepickerInput(date){
        var year = date.getFullYear();
        var month = date.getMonth()+1 > 9 ? date.getMonth()+1 : '0'+date.getMonth()+1;
        var day = date.getDate() > 9 ? date.getDate() : '0'+date.getDate();
        var hour = date.getHours() > 9 ? date.getHours() : '0'+date.getHours();
        var minutes = date.getMinutes() > 9 ? date.getMinutes() : '0'+date.getMinutes();

        return  year+'-'+month+'-'+day+' '+hour+':'+minutes;
    }

    /* @@@@@@@@@@@@@@@@@@@@@@@@@@
                SUITE
     @@@@@@@@@@@@@@@@@@@@@@@@@@ */

    beforeEach(function(){
        events.route();
    });

    describe('On load', function(){
    //    it('should route to events page', function(done){
    //        expect(browser.getCurrentUrl()).toContain('/logs');
    //
    //        browser.sleep(1000).then(done);
    //
    //    });
    //
    //    it('should sort by timestamp desc by default', function(done){
    //        waitingForDebounce();
    //        events.mainTable.timestamp.getValues().then(function(values){
    //            expect(events.mainTable.isDatesOrdered(values, true)).toBe(true);
    //        });
    //
    //        browser.sleep(1000).then(done);
    //    });
    //
    //    it('should load 50 events per page', function(){
    //        expect(events.mainTable.countRows()).toBe(50);
    //        events.mainTable.pagination.goToPage(2);
    //        waitingForDebounce();
    //        expect(events.mainTable.countRows()).toBe(50);
    //    });
    //
    //    it('should load blueprints list', function(){
    //        var blueprints = events.filters.blueprints.getOptionsTexts();
    //        expect(blueprints).toContain(config.blueprintWithoutEvents);
    //        expect(blueprints).toContain(config.blueprintWithEvents);
    //    });
    //
    //    it('should load deployments list', function(){
    //        var deployments = events.filters.deployments.getOptionsTexts();
    //        expect(deployments).toContain(config.firstDeployment);
    //        expect(deployments).toContain(config.secondDeployment);
    //    });
    //
    //    it('should load log levels filter list', function(){
    //        var logLevels = events.filters.logLevels.getOptionsTexts();
    //        expect(logLevels).toEqual(config.logLevelsOptions);
    //    });
    //
    //    it('should load event types filter list', function(){
    //        var eventTypes = events.filters.eventTypes.getOptionsTexts();
    //        expect(eventTypes).toEqual(config.eventTypesOptions);
    //    });
    });
    //
    describe('Filtering', function(){
        //TODO: try to implement it with free input search
        //describe('Debounce', function(done){
        //   it('should debounce the filters to update data', function(){
        //       expect(events.mainTable.countRows()).toBe(50);
        //
        //       expect(events.mainTable.countRows()).toBe(50);
        //
        //       expect(events.mainTable.countRows()).toBe(50);
        //       waitingForDebounce();
        //       expect(events.mainTable.countRows()).toBe(0);
        //
        //       browser.sleep(1000).then(done);
        //   })
        //});
        //
        //it('should filter by blueprints', function(done){
        //    //getting number of events on startup
        //    var noFiltersEventsCount = events.mainTable.countRows();
        //    //Choosing a blueprint with no events
        //    events.filters.blueprints.select(config.blueprintWithoutEvents);
        //    waitingForDebounce();
        //    expect(events.filters.blueprints.getSelectedTexts()).toEqual([config.blueprintWithoutEvents]);
        //    expect(events.mainTable.countRows()).toBe(0);
        //
        //    //Choosing another blueprint with events
        //    events.filters.blueprints.select(config.blueprintWithEvents);
        //    waitingForDebounce();
        //    var blueprints = events.filters.blueprints.getSelectedTexts();
        //    expect(blueprints).toContain(config.blueprintWithEvents);
        //    expect(blueprints).toContain(config.blueprintWithoutEvents);
        //    expect(events.mainTable.countRows()).toBe(noFiltersEventsCount);
        //
        //    browser.sleep(1000).then(done);
        //});
        //
        //it('should filter by deployments', function(done){
        //    //Choosing a random deployments
        //    events.filters.deployments.select(config.firstDeployment);
        //    waitingForDebounce();
        //    expect(events.filters.deployments.getSelectedTexts()).toEqual([config.firstDeployment]);
        //
        //    events.filters.deployments.select(config.secondDeployment);
        //    waitingForDebounce();
        //    expect(events.filters.deployments.getSelectedTexts()).toContain(config.secondDeployment);
        //    expect(events.filters.deployments.getSelectedTexts()).toContain(config.firstDeployment);
        //
        //    browser.sleep(1000).then(done);
        //});
        //
        //it('should filter by logs levels', function(done){
        //    //getting number of events on startup
        //    var noFiltersEventsCount = events.mainTable.countRows();
        //    //Choosing a level with no events
        //    events.filters.logLevels.select(config.logLevelWithoutEvents);
        //    waitingForDebounce();
        //    expect(events.filters.logLevels.getSelectedTexts()).toEqual([config.logLevelWithoutEvents]);
        //    expect(events.mainTable.countRows()).toBe(0);
        //
        //    ////Choosing another level with events
        //    events.filters.logLevels.select(config.logLevelWithEvents);
        //    waitingForDebounce();
        //    expect(events.filters.logLevels.getSelectedTexts()).toContain(config.logLevelWithEvents);
        //    expect(events.filters.logLevels.getSelectedTexts()).toContain(config.logLevelWithoutEvents);
        //    expect(events.mainTable.countRows()).toBe(noFiltersEventsCount);
        //
        //    //checking events data to be all as was filtered
        //    events.mainTable.logLevel.getValues().then(function(values){
        //        expect(isAllValuesEqualTo(values,config.logLevelWithEvents)).toBe(true);
        //    });
        //
        //    browser.sleep(1000).then(done);
        //});
        //
        //it('should filter by event types', function(done){
        //    //Choosing an event type with no events
        //    events.filters.eventTypes.select(config.eventTypeWithoutEvents);
        //    waitingForDebounce();
        //    expect(events.filters.eventTypes.getSelectedTexts()).toEqual([config.eventTypeWithoutEvents]);
        //    expect(events.mainTable.countRows()).toBe(0);
        //
        //    //Choosing another event types with events
        //    events.filters.eventTypes.select(config.eventTypeWithEvents);
        //    waitingForDebounce();
        //    var eventTypes = events.filters.eventTypes.getSelectedTexts();
        //    expect(eventTypes).toContain(config.eventTypeWithEvents);
        //    expect(eventTypes).toContain(config.eventTypeWithoutEvents);
        //    expect(events.mainTable.countRows()).toBe(3);
        //    expect(isAllValuesEqualTo(events.mainTable.eventType.getValues,config.eventTypeWithEvents)).toBe(true);
        //
        //    browser.sleep(1000).then(done);
        //});
        describe('time ranges filters', function(){
            xit('should filter all events from a timestamp using the datepicker', function(done){
                //getting number of events on startup
                var noFiltersEventsCount = events.mainTable.countRows();

                // A future date
                events.filters.timeRange.gte.chooseTimestamp(1, 9, 0, true, false);
                waitingForDebounce();
                expect(events.mainTable.countRows()).toBe(0);

                events.filters.clearFilters();
                waitingForDebounce();

                //selecting previous month date
                events.filters.timeRange.gte.chooseTimestamp(1, 9, 0, false, true);
                waitingForDebounce();
                expect(events.mainTable.countRows()).toBe(noFiltersEventsCount);

                browser.sleep(1000).then(done);
            });

            xit('should filter all events to a timestamp using the datepicker', function(done){
                //getting number of events on startup
                var noFiltersEventsCount = events.mainTable.countRows();

                // A future date
                events.filters.timeRange.lte.chooseTimestamp(1, 9, 0, false, true);
                waitingForDebounce();
                expect(events.mainTable.countRows()).toBe(0);

                events.filters.clearFilters();
                waitingForDebounce();

                //selecting previous month date
                events.filters.timeRange.lte.chooseTimestamp(1, 9, 0, true, false);
                waitingForDebounce();
                expect(events.mainTable.countRows()).toBe(noFiltersEventsCount);

                browser.sleep(1000).then(done);
            });

            xit('should filter all events from a timestamp using the free text input', function(done){
                waitingForDebounce();
                //getting number of events on startup
                var noFiltersEventsCount = events.mainTable.countRows();

                // A future date
                var futureTimestamp = new Date();
                futureTimestamp.setMonth(futureTimestamp.getMonth() + 1);
                futureTimestamp = dateToDatepickerInput(futureTimestamp);
                events.filters.timeRange.gte.typeTimestamp(futureTimestamp);
                waitingForDebounce();
                expect(events.mainTable.countRows()).toBe(0);


                events.filters.clearFilters();
                waitingForDebounce();

                //selecting previous month date
                var pastTimestamp = new Date();
                pastTimestamp.setMonth(pastTimestamp.getMonth() - 1);
                pastTimestamp = dateToDatepickerInput(pastTimestamp);
                events.filters.timeRange.gte.typeTimestamp(pastTimestamp);
                waitingForDebounce();
                expect(events.mainTable.countRows()).toBe(noFiltersEventsCount);

                browser.sleep(1000).then(done);
            });

            xit('should filter all events to a timestamp using the free text input', function(done){
                waitingForDebounce();
                //getting number of events on startup
                var noFiltersEventsCount = events.mainTable.countRows();

                //selecting previous month date
                var pastTimestamp = new Date();
                pastTimestamp.setMonth(pastTimestamp.getMonth() - 1);
                pastTimestamp = dateToDatepickerInput(pastTimestamp);
                events.filters.timeRange.lte.typeTimestamp(pastTimestamp);
                waitingForDebounce();
                expect(events.mainTable.countRows()).toBe(0);

                events.filters.clearFilters();
                waitingForDebounce();

                // A future date
                var futureTimestamp = new Date();
                futureTimestamp.setMonth(futureTimestamp.getMonth() + 1);
                futureTimestamp = dateToDatepickerInput(futureTimestamp);
                events.filters.timeRange.lte.typeTimestamp(futureTimestamp);
                waitingForDebounce();
                expect(events.mainTable.countRows()).toBe(noFiltersEventsCount);

                browser.sleep(1000).then(done);
            });

            xit('should check icon changing when date is picked', function(done){
                expect(events.filters.timeRange.gte.isDatepickerIconFull()).toBe(false);
                expect(events.filters.timeRange.lte.isDatepickerIconFull()).toBe(false);

                events.filters.timeRange.gte.chooseTimestamp(1, 9, 0, false, false);
                events.filters.timeRange.lte.chooseTimestamp(1, 9, 0, false, false);
                waitingForDebounce();

                expect(events.filters.timeRange.gte.isDatepickerIconFull()).toBe(true);
                expect(events.filters.timeRange.lte.isDatepickerIconFull()).toBe(true);

                events.filters.clearFilters();
                waitingForDebounce();

                expect(events.filters.timeRange.gte.isDatepickerIconFull()).toBe(false);
                expect(events.filters.timeRange.lte.isDatepickerIconFull()).toBe(false);

                browser.sleep(1000).then(done);
            });

            it('should check icon changing when date is typed', function(done){
                //expect(events.filters.timeRange.gte.isDatepickerIconFull()).toBe(false);
                //expect(events.filters.timeRange.lte.isDatepickerIconFull()).toBe(false);
                //
                ////typing timestamp
                //var timestamp = new Date();
                //timestamp = dateToDatepickerInput(timestamp);
                //events.filters.timeRange.gte.typeTimestamp(timestamp);
                //events.filters.timeRange.lte.typeTimestamp(timestamp);
                //waitingForDebounce();
                //
                //expect(events.filters.timeRange.gte.isDatepickerIconFull()).toBe(true);
                //expect(events.filters.timeRange.lte.isDatepickerIconFull()).toBe(true);
                //
                //events.filters.clearFilters();
                //waitingForDebounce();
                //
                //expect(events.filters.timeRange.gte.isDatepickerIconFull()).toBe(false);
                //expect(events.filters.timeRange.lte.isDatepickerIconFull()).toBe(false);
                //
                ////typing a mock
                //var mockTimestamp = '2015-10-10 10-10';
                //events.filters.timeRange.gte.typeTimestamp(mockTimestamp);
                //events.filters.timeRange.lte.typeTimestamp(mockTimestamp);
                //waitingForDebounce();
                //
                //expect(events.filters.timeRange.gte.isDatepickerIconFull()).toBe(false);
                //expect(events.filters.timeRange.lte.isDatepickerIconFull()).toBe(false);

                //typing timestamp
                var timestamp = new Date();
                timestamp = dateToDatepickerInput(timestamp);
                events.filters.timeRange.gte.typeTimestamp(timestamp);
                events.filters.timeRange.lte.typeTimestamp(timestamp);

                browser.sleep(1000).then(done);
            });

        });

        //it('should filter by message texts', function(done){
        //    do {
        //        waitingForDebounce();
        //        //getting number of events on startup
        //        var noFiltersEventsCount = events.mainTable.countRows();
        //    }
        //    while(!noFiltersEventsCount || noFiltersEventsCount === 0);
        //
        //    //A search with 6 results
        //    events.filters.messageText.search('stopped');
        //    waitingForDebounce();
        //    expect(events.mainTable.countRows()).toBe(6);
        //
        //    events.filters.messageText.search('');
        //    waitingForDebounce();
        //    expect(events.mainTable.countRows()).toBe(noFiltersEventsCount);
        //
        //    browser.sleep(1000).then(done);
        //});
        //
        //it('should clear filters', function(done){
        //    //pick random filters
        //    events.filters.blueprints.select(config.blueprintWithEvents);
        //    events.filters.deployments.select(config.firstDeployment);
        //    events.filters.logLevels.select(config.logLevelWithoutEvents);
        //    //click clear filters button
        //    events.filters.clearFilters();
        //    //check filters has no selected options
        //    expect(events.filters.blueprints.getSelected().count()).toBe(0);
        //    expect(events.filters.deployments.getSelected().count()).toBe(0);
        //    expect(events.filters.logLevels.getSelected().count()).toBe(0);
        //
        //    browser.sleep(1000).then(done);
        //});
        //
        //it('should toggle columns removal', function(done){
        //    events.filters.columnsOrganizer.toggle('Timestamp');
        //    events.filters.columnsOrganizer.toggle('Log Level');
        //    expect(events.mainTable.timestamp.getCells().count()).toBe(0);
        //    expect(events.mainTable.timestamp.getHeader().isPresent()).toBe(false);
        //    expect(events.mainTable.logLevel.getCells().count()).toBe(0);
        //    expect(events.mainTable.logLevel.getHeader().isPresent()).toBe(false);
        //
        //    events.filters.columnsOrganizer.toggle('Timestamp');
        //    expect(events.mainTable.timestamp.getCells().count()).not.toBe(0);
        //    expect(events.mainTable.timestamp.getHeader().isPresent()).toBe(true);
        //
        //    browser.sleep(1000).then(done);
        //});
        //
        //it('should refresh page and keep filters', function(done){
        //    //pick random filters
        //    events.filters.blueprints.select(config.blueprintWithEvents);
        //    events.filters.logLevels.select(config.logLevelWithEvents);
        //    events.filters.deployments.select(config.firstDeployment);
        //
        //    browser.refresh();
        //
        //    //check filters have right options selected
        //    expect(events.filters.blueprints.getSelectedTexts()).toEqual([config.blueprintWithEvents]);
        //    expect(events.filters.deployments.getSelectedTexts()).toEqual([config.firstDeployment]);
        //    expect(events.filters.logLevels.getSelectedTexts()).toEqual([config.logLevelWithEvents]);
        //
        //    browser.sleep(1000).then(done);
        //});
    });
    //
    describe('Sorting', function(){
        //it('should sort timestamp', function(done){
        //    waitingForDebounce();
        //    //sorted desc by default
        //    events.mainTable.timestamp.getValues().then(function(values){
        //        expect(events.mainTable.isDatesOrdered(values, true)).toBe(true);
        //    });
        //
        //    events.mainTable.timestamp.sort();
        //    events.mainTable.timestamp.sort();
        //    waitingForDebounce();
        //
        //    events.mainTable.timestamp.getValues().then(function(values){
        //        expect(events.mainTable.isDatesOrdered(values, false)).toBe(true);
        //    });
        //
        //    browser.sleep(1000).then(done);
        //});
    });
    //
    describe('Paging', function(){
        //it('should change pages', function(done){
        //    events.mainTable.pagination.goToPage(2);
        //    expect(events.mainTable.pagination.isPageActive(2)).toBe(true);
        //    events.mainTable.pagination.goToPage(3);
        //    expect(events.mainTable.pagination.isPageActive(2)).toBe(false);
        //    expect(events.mainTable.pagination.isPageActive(3)).toBe(true);
        //
        //    browser.sleep(1000).then(done);
        //});
        //
        //it('should refresh page and keep pagination', function(done){
        //    //go to another page
        //    events.mainTable.pagination.goToPage(4);
        //
        //    browser.refresh();
        //
        //    //check we are on the right page
        //    expect(events.mainTable.pagination.isPageActive(4)).toBe(true);
        //
        //    browser.sleep(1000).then(done);
        //});
    });

    describe('table', function(){
        //it('should toggle events additional data', function(done){
        //    events.mainTable.clickEvent(1);
        //    expect(events.mainTable.isEventInfoOpen(1)).toBe(true);
        //    events.mainTable.clickEvent(1);
        //    expect(events.mainTable.isEventInfoOpen(1)).toBe(false);
        //
        //    events.mainTable.clickEvent(4);
        //    expect(events.mainTable.isEventInfoOpen(4)).toBe(true);
        //    events.mainTable.clickEvent(4);
        //    expect(events.mainTable.isEventInfoOpen(4)).toBe(false);
        //
        //    browser.sleep(1000).then(done);
        //});
        //
    });
});