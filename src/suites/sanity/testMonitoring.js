'use strict';

var assert = require('assert');
var components = require('../../components');
var logger = require('log4js').getLogger('testMonitoring');
var async = require('async');

describe('Monitoring', function () {

    it('should display data for all the available charts', function(done){
        // load the deployments screen
        components.ui.page.loadDeployments();

        // get new instance on deployment page
        components.ui.deployments.page().then(function(page){
            // select the first deployment from the list
            page.selectByPosition(1).then(function(deploymentRow){
                // click on the deployment to open the deployment page
                deploymentRow.click().then(function(){
                    // switch to monitoring tab
                    page.switchTab('Monitoring').then(function(err){
                        if(!err) {
                            // create new instance of monitoring
                            components.ui.deployments.monitoring().then(function(monitoring){
                                // make sure the monitoring screen is loaded
                                monitoring.isMonitoringLoads().then(function(isLoaded){
                                    logger.info('isMonitoringLoads:', isLoaded);
                                    if(isLoaded) {
                                        // get list of charts
                                        monitoring.getCharts().then(function(panels) {
                                            // check each panel, failed when you find the first panel without data points
                                            monitoring.checkPanels(panels).then(function(err){
                                                if(err) logger.error(err);
                                                assert.equal(err, null, err);
                                                done();
                                            }).catch(function(e) {
                                                done(e);
                                            });
                                        });
                                    }
                                    else {
                                        done('Error in loading monitoring iframe');
                                    }
                                });
                            });
                        }
                        else {
                            done(err);
                        }
                    });
                });
            });
        });


    });

});