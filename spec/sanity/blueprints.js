'use strict';

var logger = require('log4js').getLogger('blueprints_spec');
var components = require('../../src/components/index');

describe('blueprints page', function(){
    var testConf = components.config.tests.sanity.blueprints_spec;

    var newDeploymentName = 'new-deployment-' + new Date().getTime();

    beforeEach(function(){
        components.ui.LoginPage.goTo().login('user1','pass1');
    });

    it('should go into blueprint and verify all section exists', function (done) {
        components.ui.blueprints.IndexPage.goToBlueprint({'name' : testConf.blueprints.blueprintToRead });
        components.ui.blueprints.BlueprintPage.goToNetwork('Network');
        components.ui.blueprints.BlueprintPage.goToNodes('Nodes');
        components.ui.blueprints.BlueprintPage.goToSource('Source');
        browser.sleep(1000).then(function(){ done(); });
    });



    it('should create a deployment', function (done) {
        logger.trace('start create deployment test');

        components.ui.blueprints.IndexPage.createDeployment({'name' : testConf.blueprints.blueprintToDeploy});
        //components.ui.blueprints.CreateDeployment.clickCancel(); // lets test cancel on the way!
        //components.ui.blueprints.IndexPage.createDeployment({'name' : testConf.blueprints.blueprintToDeploy});
        components.ui.blueprints.CreateDeployment.setName(newDeploymentName);
        components.ui.blueprints.CreateDeployment.clickOnRaw();
        components.ui.blueprints.CreateDeployment.setParams(components.config.tests.sanity.blueprints_spec.deployment);
        components.ui.blueprints.CreateDeployment.deploy();

        browser.sleep(3000);
        expect(browser.getCurrentUrl()).toContain('/deployment/');
        browser.sleep(1000).then(function(){ done(); });
    });

    it('should show deploy dialog after default button pressed', function (done) {

        logger.trace('start create deployment with default button test');

        components.ui.blueprints.IndexPage.createDeploymentWithDefaultBtn({'name' : testConf.blueprints.blueprintToDeploy});
        expect(element(by.css('#deployDialogContainer')).isPresent()).toBe(true);

        browser.sleep(500).then(function(){ done(); });
    });

    it('should upload and delete a blueprint', function(done){
        // todo
        //done();
        var uploadedBlueprint = { blueprint_id: 'uploaded-' + new Date().getTime(), 'blueprint_filename' : 'singlehost-blueprint.yaml', 'blueprint_location':'https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/master.zip' };
        components.ui.blueprints.IndexPage.uploadBlueprint(uploadedBlueprint);
        components.ui.blueprints.IndexPage.waitForUploadDone({name: uploadedBlueprint.blueprint_id});
        components.ui.layout.goToBlueprints();
        components.ui.blueprints.IndexPage.deleteBlueprint({name: uploadedBlueprint.blueprint_id});
        browser.sleep(1000).then(function(){ done(); });
    });

    it('should open node details panel when clicking on node in topology section', function(done) {
        logger.trace('start blueprint topology section test');
        components.ui.blueprints.IndexPage.goToBlueprint({'name' : testConf.blueprints.blueprintToRead});
        components.ui.blueprints.BlueprintPage.goToTopology();
        components.ui.blueprints.BlueprintPage.Topology.clickNode(testConf.blueprints.propertiesPanel.nodeToClick);
        components.ui.blueprints.BlueprintPage.PropertiesPanel.goToProperties();
        components.ui.blueprints.BlueprintPage.PropertiesPanel.goToRelationships();
        components.ui.blueprints.BlueprintPage.PropertiesPanel.close();

        browser.sleep(1000).then(function(){ done(); });
    });
    //
    //it('should open node details panel when clicking on node in network section', function (done) {
    //    logger.trace('start blueprint network section test');
    //    components.ui.blueprints.IndexPage.goToBlueprint({'name' : DEPLOY_BLUEPRINT_NAME});
    //    components.ui.blueprints.BlueprintPage.goToSection('Network');
    //    components.ui.blueprints.BlueprintPage.Network.getSubnets();
    //    components.ui.blueprints.BlueprintPage.Network.getRouters();
    //
    //    browser.sleep(1000).then(function(){ done(); });
    //});
    //
    //it('should open node details panel when clicking on node in nodes section', function (done) {
    //    logger.trace('start blueprint node section test');
    //    components.ui.blueprints.IndexPage.goToBlueprint({'name' : DEPLOY_BLUEPRINT_NAME});
    //    components.ui.blueprints.BlueprintPage.goToSection('Nodes');
    //    components.ui.blueprints.BlueprintPage.NodesTable.clickNode('mongod');
    //
    //    browser.sleep(1000).then(function(){ done(); });
    //});
    //
    //it('should show files tree in source section and selected file content', function (done) {
    //    logger.trace('start blueprint source section test');
    //    components.ui.blueprints.IndexPage.goToBlueprint({'name' : DEPLOY_BLUEPRINT_NAME});
    //    components.ui.blueprints.BlueprintPage.goToSection('Source');
    //    components.ui.blueprints.BlueprintPage.Source.getTree();
    //    components.ui.blueprints.BlueprintPage.Source.selectFile('openstack-blueprint.yaml');
    //    components.ui.blueprints.BlueprintPage.Source.getFileTitle('openstack-blueprint.yaml');
    //    components.ui.blueprints.BlueprintPage.Source.getFileContent();
    //
    //    browser.sleep(1000).then(function(){ done(); });
    //});
});
