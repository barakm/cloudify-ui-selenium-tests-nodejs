'use strict';

var assert = require('assert');
var components = require('../../components');
var logger = require('log4js').getLogger('testDeployments');
var async = require('async');

describe('Deployments', function () {

    it('should install deployment', function(done){
        // load the deployments screen
        components.ui.page.loadDeployments();
        // get new instance on deployment page
        components.ui.deployments.page().then(function(page){
            // select the first deployment from the list
            page.selectByPosition(1).then(function(deploymentRow){
                // click on the deployment to open the deployment page
                deploymentRow.click().then(function(){
                    // wait for initialize deployment to be complete
                    page.onInitializedComplete().then(function(complete){
                        logger.info('onInitializedComplete:', complete);
                        if(complete) {
                            // get the header of the deployment
                            page.getHeader().then(function(header){
                                // get new instance of action
                                components.ui.deployments.actions().then(function(actions){
                                    // open the actions menu and select 'install'
                                    actions.selectAction(header, 'install').then(function(){
                                        // click on play button
                                        actions.playAction(header).then(function(err){
                                            if(err) logger.error(err);
                                            else {
                                                // on the confirmation dialog choose 'Confim'
                                                actions.playConfirmation('Confirm').then(function(){
                                                    // check if the install complete successfully
                                                    page.isInstallSuccessful().then(function(err){
                                                        logger.info('isInstallSuccessful:', err);
                                                        if(err) logger.error(err);
                                                        assert.equal(err, null, err);
                                                        done();
                                                    }).catch(function(e) {
                                                        done(e);
                                                    });
                                                })
                                            }
                                        }).catch(function(e) {
                                            done(e);
                                        });
                                    });
                                });
                            });
                        }
                        else {
                            done('Initialize deployment timeout!');
                        }
                    });
                });
            });
        });
    });

});