'use strict';

var assert = require('assert');
var components = require('../../components');
var logger = require('log4js').getLogger('testEvents');


describe('Events', function () {

    it('should display logs and events', function(done){
        // load the events screen
        components.ui.page.loadEvents();

        // create new instance of Events
        var events = new components.ui.events();

        // set options for this instance
        events.setOptions(components.config.events).then(function(){
            // select deployments
            events.selectDeployments().then(function(){
                // select timeframe
                events.selectTimeframe().then(function(){
                    // show results
                    events.show().then(function(){
                        // check for results
                        events.getResults().then(function(results){
                            assert.notEqual(results.length, 0, 'Logs and events are empty');
                            done();
                        }).catch(function(e) {
                            done(e);
                        });
                    });
                });
            });
        });

    });

});