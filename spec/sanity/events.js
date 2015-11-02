'use strict';
var logger = require('log4js').getLogger('blueprints_spec');
var components = require('../../src/components/index');
var events = components.ui.events.page;

describe('logs & events page', function() {

    beforeEach(function(){
        events.route();
    });
    
    it('should route to events page', function(){
        expect(browser.getCurrentUrl()).toContain('/logs');
    });

    //TODO: make it after using api
    //it('should sort by timestamp desc by default', function(){

    //});

    it('should filter blueprints', function(){
        //getting number of events on startup
        var noFiltersEventsCount = events.mainTable.countRows();
        //Choosing a blueprint with no events
        events.filters.blueprints.select('nodecellar_undeployed');
        events.filters.blueprints.getSelected().getText().then(function(text){
            expect(text).toEqual(['nodecellar_undeployed']);
            events.filters.blueprints.toggle();
        });
        expect(events.mainTable.countRows()).toBe(0);

        //Choosing another blueprint with events
        events.filters.blueprints.select('nodecellar1');
        events.filters.blueprints.getSelected().getText().then(function(text){
            expect(text).toEqual(['nodecellar1', 'nodecellar_undeployed']);
            events.filters.blueprints.toggle();
        });
        expect(events.mainTable.countRows()).toBe(noFiltersEventsCount);
    });

    it('should filter deployments', function(){
        //Choosing a deployment with no events
        events.filters.deployments.select('installed_deployment [nodecellar1]');
        events.filters.deployments.getSelected().getText().then(function(text){
            expect(text).toEqual(['installed_deployment [nodecellar1]']);
            events.filters.deployments.toggle();
        });

        events.filters.deployments.select('installed_deployment2 [nodecellar1]');
        events.filters.deployments.getSelected().getText().then(function(text){
            expect(text).toEqual(['installed_deployment2 [nodecellar1]','installed_deployment [nodecellar1]']);
            events.filters.deployments.toggle();
        });
    });

    it('should filter logs levels', function(){
        //getting number of events on startup
        var noFiltersEventsCount = events.mainTable.countRows();
        //Choosing a level with no events
        events.filters.logLevels.select('ERROR');
        events.filters.logLevels.getSelected().getText().then(function(text){
            expect(text).toEqual(['ERROR']);
            events.filters.logLevels.toggle();
        });
        expect(events.mainTable.countRows()).toBe(0);

        ////Choosing another level with events
        events.filters.logLevels.select('INFO');
        events.filters.logLevels.getSelected().getText().then(function(text){
            expect(text).toEqual(['ERROR','INFO']);
            events.filters.logLevels.toggle();
        });
        expect(events.mainTable.countRows()).toBe(noFiltersEventsCount);

        function isAllValuesEqualTo(array, value){
            var isIt = true;
            for(var i = 0; i < array.length; i++){
                if(array[i] !== value){
                    isIt = false;
                    break;
                }
            }
            return isIt;
        }

        //checking events data to be all was filtered
        events.mainTable.logLevel.getValues().then(function(values){
            expect(isAllValuesEqualTo(values,'INFO')).toBe(true);
        })
    });

    it('should clear filters', function(){
        //pick random filters
        events.filters.blueprints.select('nodecellar1');
        events.filters.deployments.select('installed_deployment [nodecellar1]');
        events.filters.logLevels.select('WARNING');
        //click clear filters button
        events.filters.clearFilters();
        //check filters has no selected options
        expect(events.filters.blueprints.getSelected().count()).toBe(0);
        expect(events.filters.deployments.getSelected().count()).toBe(0);
        expect(events.filters.logLevels.getSelected().count()).toBe(0);
     });

    //TODO:Activate it when sorting is supported by the api
    //it('should sort timestamp', function(){
    //    function isDatesOrdered(dates, reverseOrder){
    //        var ordered = true;
    //        for(var i = 0; i<dates.length -1; i++){
    //            if(reverseOrder && (new Date(dates[i]) < new Date(dates[i+1]))) {
    //                logger.trace(1);
    //                ordered = false;
    //                break;
    //            }
    //            if(!reverseOrder && (new Date(dates[i]).getTime() > new Date(dates[i+1]).getTime())){
    //                ordered = false;
    //                break;
    //            }
    //        }
    //        return ordered;
    //    }
    //
    //    events.mainTable.timestamp.sort();
    //    events.mainTable.timestamp.getValues().then(function(values){
    //        expect(isDatesOrdered(values, true)).toBe(true);
    //    });
    //
    //    events.mainTable.timestamp.sort();
    //    events.mainTable.timestamp.getValues().then(function(values){
    //        expect(isDatesOrdered(values, false)).toBe(true);
    //    });
    //
    //});

    it('should toggle columns removal', function(){
        events.filters.columnsOrganizer.toggle('Timestamp');
        events.filters.columnsOrganizer.toggle('Log Level');

        expect(events.mainTable.timestamp.getCells().count()).toBe(0);
        expect(events.mainTable.timestamp.getHeader().isPresent()).toBe(false);
        expect(events.mainTable.logLevel.getCells().count()).toBe(0);
        expect(events.mainTable.logLevel.getHeader().isPresent()).toBe(false);

        events.filters.columnsOrganizer.toggle('Timestamp');
        expect(events.mainTable.timestamp.getCells().count()).not.toBe(0);
        expect(events.mainTable.timestamp.getHeader().isPresent()).toBe(true);

    });


    it('should toggle events additional data', function(){
        events.mainTable.clickEvent(0);
        expect(events.mainTable.isEventInfoOpen(0)).toBe(true);
        events.mainTable.clickEvent(0);
        expect(events.mainTable.isEventInfoOpen(0)).toBe(false);

        events.mainTable.clickEvent(3);
        expect(events.mainTable.isEventInfoOpen(3)).toBe(true);
        events.mainTable.clickEvent(3);
        expect(events.mainTable.isEventInfoOpen(3)).toBe(false);
    });

    it('should change pages', function(){
        events.mainTable.pagination.moveToPage(2);
        expect(events.mainTable.pagination.isPageActive(2)).toBe(true);
        events.mainTable.pagination.moveToPage(3);
        expect(events.mainTable.pagination.isPageActive(2)).toBe(false);
        expect(events.mainTable.pagination.isPageActive(3)).toBe(true);
    });

    //TODO: make it after using api
    //it('should toggle error message', function(){

    //});

    it('should refresh page and keep filters', function(){
        //pick random filters
        events.filters.blueprints.select('nodecellar1');
        events.filters.deployments.select('installed_deployment [nodecellar1]');
        events.filters.logLevels.select('INFO');
        //go to another page
        events.mainTable.pagination.moveToPage(4);

        browser.refresh();

        //check filters have right options selected
        events.filters.blueprints.getSelected().getText().then(function(text){
            expect(text).toEqual(['nodecellar1']);
        });
        events.filters.deployments.getSelected().getText().then(function(text){
            expect(text).toEqual(['installed_deployment [nodecellar1]']);
        });
        events.filters.logLevels.getSelected().getText().then(function(text){
            expect(text).toEqual(['INFO']);
        });
        //check we are on the right page
        expect(events.mainTable.pagination.isPageActive(4)).toBe(true);
    });
});