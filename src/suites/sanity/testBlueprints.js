'use strict';

var assert = require('assert');
var components = require('../../components');
var logger = require('log4js').getLogger('testBlueprints');

describe('Blueprints', function () {

    it('should upload blueprint', function(done){
        components.ui.page.loadBlueprints();
        components.ui.blueprints.uploadBlueprint(components.config.blueprint).then(function(err){
            if(err) logger.error(err);
            assert.equal(err, null, err);
            done();
        }).catch(function(e) {
            done(e);
        });
    });

    it('should create new deployment', function(done){
        components.ui.page.loadBlueprints();
        components.ui.blueprints.createDeployment(components.config.deployment).then(function(err){
            if(err) logger.error(err);
            assert.equal(err, null, err);
            done();
        }).catch(function(e) {
            done(e);
        });
    });

});