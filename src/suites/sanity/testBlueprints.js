'use strict';

var assert = require('assert');
var components = require('../../components');
var logger = require('log4js').getLogger('testBlueprints');

describe('Blueprints', function () {

    it('should upload blueprint', function(done){
        // load blueprint page
        components.ui.page.loadBlueprints();
        // create new instance of upload blueprint
        components.ui.blueprints.newUploadInstance().then(function(upload){
            // set options for this instance
            upload.setOptions(components.config.blueprint).then(function () {
                // open new upload dialog
                upload.openDialog().then(function(){
                    // set file location
                    upload.setFile().then(function () {
                        // set blueprint name
                        upload.setName().then(function () {
                            // start upload the blueprint
                            upload.save().then(function () {
                                // check if the blueprint uploaded successfully
                                upload.isUploadSuccessful().then(function (err) {
                                    if (err) logger.error(err);
                                    assert.equal(err, null, err);
                                    done();
                                }).catch(function (e) {
                                    done(e);
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('should create new deployment', function(done){
        // load blueprint page
        components.ui.page.loadBlueprints();
        // create new instance of create deployment
        components.ui.blueprints.createDeployment().then(function(createDeployment){
            // set options for this instance
            createDeployment.setOptions(components.config.deployment).then(function(){
                // open new create deployment dialog
                createDeployment.openDialog().then(function(){
                    // set deployment name
                    createDeployment.setName().then(function(){
                        // set deployment params
                        createDeployment.setParams().then(function(){
                            // deploy new deployment
                            createDeployment.deploy().then(function(err){
                                if(err) logger.error(err);
                                assert.equal(err, null, err);
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

});