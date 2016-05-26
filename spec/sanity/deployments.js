'use strict';

var logger = require('log4js').getLogger('deployments_spec');
var components = require('../../src/components');
var testConf = components.config.tests.sanity.deployments_spec;

//var INSTALLED_DEPLOYMENT_NAME = 'installed_deployment';

describe('deployments page', function () {

    beforeEach(function(){ logger.info('running from ' + __filename); });

    beforeAll(function() { components.ui.LoginPage.goTo().login('admin', 'admin'); });

    beforeEach(function (done) {
        components.ui.layout.goToDeployments();
        browser.sleep(1000).then(done);
    });

    describe('single deployment', function(){

        var deploymentName;
        var deploymentsOpts;

        function createTestDeployment() {
            deploymentName = 'deployment_' + new Date().getTime();
            deploymentsOpts = {id : deploymentName };

            components.ui.layout.goToBlueprints();
            components.ui.blueprints.IndexPage.createDeployment({ name : 'nodecellar1' });
            components.ui.blueprints.CreateDeployment.setDetails({ name : deploymentName , 'raw' : {
                'agent_private_key_path': 'ggg',
                'agent_user': 'ggg',
                'host_ip': 'ggg'
            }});
            components.ui.blueprints.CreateDeployment.confirm();

            components.ui.deployments.DeploymentPage.waitForInitializingToStop();
        }

        it('should not have any search queries in the url after creation', function(done){
            createTestDeployment();

            expect(browser.getCurrentUrl()).toMatch(/.+topology$/);

            browser.sleep(1000).then(done);
        });

        it('should be deletable from deployments table view', function (done) {

            logger.trace('starting: should be deletable from deployments table view');

            components.ui.layout.goToDeployments();

            components.ui.deployments.IndexPage.deleteDeployment(deploymentsOpts);
            components.ui.deployments.DeleteDeployment.clickCancel();
            components.ui.deployments.IndexPage.deleteDeployment(deploymentsOpts);
            components.ui.deployments.DeleteDeployment.clickConfirm();
            components.ui.deployments.IndexPage.getDeployment(deploymentsOpts,true).then(function(dep){
                expect(dep).toBeUndefined('deployment ' + deploymentsOpts + ' should not exist');
            });
            browser.sleep(1000).then(done);
        });

        describe('should be deletable from deployment layout view', function (){

            beforeEach(function (done){
                createTestDeployment();

                components.ui.deployments.DeploymentLayout.deleteDeployment(deploymentsOpts);
                components.ui.deployments.DeleteDeployment.clickConfirm();

                browser.sleep(1000).then(done);
            });

            it('and redirect to deployments table after deletion', function (done) {

                expect(browser.getCurrentUrl()).toContain('deployments');
                components.ui.deployments.IndexPage.getDeployment(deploymentsOpts,true).then(function(dep){
                    expect(dep).toBeUndefined('deployment ' + deploymentsOpts + ' should not exist');
                });

                browser.sleep(1000).then(done);
            });

            it('and not redirect to deployments if user navigated elsewhere', function (done) {
                browser.ignoreSynchronization = true;
                components.ui.deployments.DeleteDeployment.clickClose();
                components.ui.layout.goToBlueprints();
                browser.ignoreSynchronization = false;
                expect(browser.getCurrentUrl()).not.toContain('deployments');
                browser.sleep(1000).then(done);
            });
        });

    });

    it('should list all deployments', function (done) {
        logger.trace('start deployments page test');
        var deployments = components.ui.deployments.IndexPage.getDeployments();
        expect(deployments.count()).toBeGreaterThan(0);
        browser.sleep(1000).then(done);
    });

    it('should go into deployment and verify all section exist', function (done) {

        components.ui.deployments.IndexPage.goToDeployment(testConf.deployment.deploymentToRead);
        components.ui.deployments.DeploymentPage.goToNodes();
        components.ui.deployments.DeploymentPage.goToExecutions();
        components.ui.deployments.DeploymentPage.goToInputsOutputs();
        components.ui.deployments.DeploymentPage.goToPlugins();
        components.ui.deployments.DeploymentPage.goToSource();
        components.ui.deployments.DeploymentPage.goToMonitoring();

        browser.sleep(1000).then(done);
    });

    it('should open node details panel when clicking on node in topology section', function (done) {
        components.ui.deployments.IndexPage.goToDeployment(testConf.deployment.deploymentToRead);
        components.ui.deployments.DeploymentPage.goToTopology();

        // drag Events list down for the nodes to be click-able


        var panel = components.ui.deployments.DeploymentLayout.getNodePropertiesPanel();
        expect(panel.isDisplayed()).toEqual(false, 'panel should not exist');
        components.ui.deployments.DeploymentLayout.closeEventsPanel();
        components.ui.deployments.DeploymentPage.Topology.clickNode(testConf.deployment.nodeToClick);
        expect(panel.isDisplayed()).toEqual(true, 'panel should not exist');
        browser.sleep(1000).then(done);
    });

    //xit('should open node details panel when clicking on node in network section', function (done) {
    //
    //});
    //
    //xit('should open node details panel when clicking on node in nodes section', function (done) {
    //
    //});
    //
    //xit('should list all executions in executions section', function (done) {
    //
    //});
    //
    //xit('should show files tree in source section and selected file content', function (done) {
    //
    //});
});