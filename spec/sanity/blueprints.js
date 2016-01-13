'use strict';

var logger = require('log4js').getLogger('blueprints_spec');
var components = require('../../src/components/index');

describe('blueprints page', function(){
    var testConf = components.config.tests.sanity.blueprints_spec;

    beforeEach(function(){
        components.ui.LoginPage.goTo().login('admin', 'admin');
    });

    describe('blueprint view', function(){

        beforeEach(function(){
            components.ui.blueprints.IndexPage.goToBlueprint({'name' : testConf.blueprints.blueprintToRead });
        });

        it('should have all sections', function (done) {
            components.ui.blueprints.BlueprintPage.goToNodes();
            components.ui.blueprints.BlueprintPage.goToSource();
            browser.sleep(1000).then(function(){ done(); });
        });

        it('should have working source section', function(done) {

            logger.trace('start blueprint source section test');
            components.ui.blueprints.BlueprintPage.goToSource();
            components.ui.blueprints.BlueprintPage.Source.getLoadingMessage();
            components.ui.blueprints.BlueprintPage.Source.getTree();
            // we should be viewing the main blueprint file:
            components.ui.blueprints.BlueprintPage.Source.getFileTitle('simple-blueprint.yaml');
            components.ui.blueprints.BlueprintPage.Source.selectFile('README.md');
            components.ui.blueprints.BlueprintPage.Source.getFileTitle('README.md');
            components.ui.blueprints.BlueprintPage.Source.getFileContent();

            browser.sleep(1000).then(function(){ done(); });
        });

    });


    it('should create a deployment, CREATE_DEPLOYMENT_EXISTS', function (done) {
        logger.trace('start create deployment test');

        components.ui.blueprints.IndexPage.createDeployment({'name' : testConf.blueprints.blueprintToDeploy});
        // 'Deploy' button should be disabled while the deployment name field is empty
        expect(components.ui.blueprints.CreateDeployment.isButtonActive()).toBe(false);
        var newDeploymentName = 'new-deployment-' + new Date().getTime();

        components.ui.common.Dialog.clickClose(); // lets test cancel on the way!

        function createDeployment( waitFor ) {

            components.ui.blueprints.IndexPage.createDeployment({'name': testConf.blueprints.blueprintToDeploy});
            components.ui.blueprints.CreateDeployment.setDetails({
                name: newDeploymentName,
                raw: components.config.tests.sanity.blueprints_spec.deployment
            });
            expect(components.ui.blueprints.CreateDeployment.isButtonActive()).toBe(true);
            components.ui.blueprints.CreateDeployment.deploy();
            if ( waitFor ) {
                components.ui.deployments.DeploymentPage.waitForInitializingToStop();
            }
        }

        createDeployment(true);

        browser.sleep(3000);
        expect(browser.getCurrentUrl()).toContain('/deployment/', 'DEPLOY_REDIRECT should redirect to deployments');

        components.ui.layout.goToBlueprints();

        createDeployment(false);

        expect(components.ui.common.Dialog.getErrorMessage()).toContain('already', 'CFY-2902 duplicate name should cause error');
        components.ui.common.Dialog.close();

        components.ui.layout.goToDeployments();
        components.ui.deployments.IndexPage.deleteDeployment({id:newDeploymentName});

        browser.sleep(1000).then(done);
    });

    it('should show deploy dialog after default button pressed', function (done) {

        logger.trace('start create deployment with default button test');

        components.ui.blueprints.IndexPage.createDeploymentWithDefaultBtn({'name' : testConf.blueprints.blueprintToDeploy});
        expect(element(by.css('#deployDialogContainer')).isPresent()).toBe(true);

        browser.sleep(500).then(function(){ done(); });
    });

    it('should upload and delete a blueprint, ENTER_BLUEPRINT_NAME', function(done){
        // todo
        //done();
        var blueprintName = 'uploaded-' + new Date().getTime();
        var uploadedBlueprint = { blueprint_id: blueprintName , 'blueprint_filename' : 'simple-blueprint.yaml', 'blueprint_location':'https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/master.zip' };
        components.ui.blueprints.IndexPage.uploadBlueprint();

        components.ui.common.Dialog.clickClose();

        expect(components.ui.blueprints.UploadBlueprintDialog.getUploadForm().isPresent()).toBe(false,'CLOSE_BLUEPRINT_DIALOG dialog should be closed after');
        components.ui.blueprints.IndexPage.uploadBlueprint(); // reopen

        components.ui.blueprints.UploadBlueprintDialog.getBlueprintIdLabel().then(function(label){
            expect(label.toLowerCase()).toContain('blueprint id', 'CFY-2301 label should be blueprint id ...  also verifies dialog is open');
        });
        components.ui.blueprints.UploadBlueprintDialog.setDetails(uploadedBlueprint);
        components.ui.blueprints.UploadBlueprintDialog.submit();

        expect(browser.getCurrentUrl()).toContain(uploadedBlueprint.blueprint_id,'UPLOAD_REDIRECT upload should redirect to blueprint when finished');
        //components.ui.blueprints.IndexPage.waitForUploadDone({name: uploadedBlueprint.blueprint_id});
        components.ui.layout.goToBlueprints();

        components.ui.blueprints.IndexPage.deleteBlueprint({name:blueprintName});
        expect(components.ui.blueprints.IndexPage.getBlueprint({name: blueprintName }, true)).toBeUndefined('CFY-3524 delete blueprint should refresh blueprints');

        browser.sleep(1000).then(function(){ done(); });
    });

    it('should open node details panel when clicking on node in topology section', function(done) {
        logger.trace('start blueprint topology section test');
        components.ui.blueprints.IndexPage.goToBlueprint({'name' : testConf.blueprints.blueprintToRead});
        components.ui.blueprints.BlueprintPage.goToTopology();
        components.ui.blueprints.BlueprintPage.Topology.clickNode(testConf.blueprints.nodeToClick);
        components.ui.blueprints.BlueprintPage.PropertiesPanel.goToProperties();
        components.ui.blueprints.BlueprintPage.PropertiesPanel.goToRelationships();
        components.ui.blueprints.BlueprintPage.PropertiesPanel.close();

        browser.sleep(1000).then(function(){ done(); });
    });




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

});
