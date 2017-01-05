'use strict';

var logger = require('log4js').getLogger('prerequisites_spec');
var components = require('../../src/components/index');

var configBlueprints = components.config.tests.sanity.blueprints_spec;
var configDeployments = components.config.tests.sanity.deployments_spec;
var configEvents = components.config.tests.sanity.events_spec;
var configHotkeys = components.config.tests.sanity.hotkeys_spec;

var isInstallPrerequisites = process.env.INSTALL_SYSTEM_TESTS_PREREQUISITES;
var isRunSystemTests = /true/i.test(process.env.RUN_SYSTEM_TESTS);

function addBlueprint(blueprintId, blueprintFilename, blueprintLocation) {
    components.ui.layout.goToBlueprints();
    components.ui.blueprints.IndexPage.getBlueprint({name: blueprintId}, true).then(function(blue) {
        if (!blue) {
            components.ui.blueprints.IndexPage.clickUploadBlueprint();
            components.ui.blueprints.UploadBlueprintDialog.setDetails({
                blueprint_id: blueprintId,
                blueprint_filename: blueprintFilename,
                blueprint_location: blueprintLocation
            });
            components.ui.blueprints.UploadBlueprintDialog.submit();
        }
    });
}

function addDeployment(blueprintId, deploymentId, deploymentInputs, workflowToExecute) {
    components.ui.layout.goToDeployments();
    components.ui.deployments.IndexPage.getDeployment({id: deploymentId}, true).then(function(dep) {
        if (!dep) {
            components.ui.layout.goToBlueprints();
            components.ui.blueprints.IndexPage.createDeployment({name: blueprintId});
            components.ui.blueprints.CreateDeployment.setDetails({
                name: deploymentId,
                raw: deploymentInputs
            });
            components.ui.blueprints.CreateDeployment.confirm();

            if (workflowToExecute) {
                components.ui.deployments.DeploymentPage.waitForInitializingToStop();
                components.ui.deployments.IndexPage.executeWorkflow({
                    deployment: {id: deploymentId},
                    workflow: workflowToExecute
                }, isRunSystemTests);
            }
        }
    });
}

logger.info('INSTALL_SYSTEM_TESTS_PREREQUISITES is ' + isInstallPrerequisites);

if (/false/i.test(isInstallPrerequisites)) {
    logger.info('system tests prerequisites will not be installed');
    return;
}

describe('installing system tests prerequisites', function() {
    beforeAll(function() {
        logger.info('running from ' + __filename);
        components.ui.LoginPage.goTo().login('admin', 'admin');
    });

    it('should add a blueprint "nodecellar1"', function() {
        addBlueprint(configBlueprints.blueprints.blueprintToDeploy, 'simple-blueprint.yaml', 'https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/master.zip');
    });

    it('should add a blueprint "nodecellar_undeployed"', function() {
        addBlueprint(configEvents.blueprintWithoutEvents, 'simple-blueprint.yaml', 'https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/master.zip');
    });

    it('should add a blueprint "nodecellar_to_update"', function() {
        addBlueprint('nodecellar_to_update', 'simple-blueprint.yaml', 'https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/3.4m5.zip');
    });

    it('should add a blueprint "groups"', function() {
        addBlueprint(configBlueprints.blueprints.groupsBlueprint, undefined, 'https://github.com/cloudify-cosmo/cloudify-installer/blob/master/resources/nested-groups.tar.gz?raw=true');
    });

    it('should add a blueprint "bomber"', function() {
        addBlueprint(configEvents.bomberBlueprint, undefined, 'https://github.com/cloudify-cosmo/cloudify-installer/blob/master/resources/bomber.tar.gz?raw=true');
    });

    it('should create a deployment "deployment_to_delete" based on "nodecellar1" blueprint', function() {
        addDeployment(
            configBlueprints.blueprints.blueprintToDeploy,
            configDeployments.deployment.deploymentToDelete.id,
            configBlueprints.deployment
        );
    });

    it('should create a deployment "installed_deployment" based on "nodecellar1" blueprint', function() {
        addDeployment(
            configBlueprints.blueprints.blueprintToDeploy,
            configDeployments.deployment.deploymentToRead.id,
            configBlueprints.deployment
        );
    });

    it('should create a deployment "installed_deployment2" based on "nodecellar1" blueprint', function() {
        addDeployment(
            configEvents.blueprintWithEvents,
            configEvents.secondInstalledDeployment.id,
            configBlueprints.deployment
        );
    });

    it('should create a deployment "hotkeys_deployment" based on "nodecellar1" blueprint', function() {
        addDeployment(
            configBlueprints.blueprints.blueprintToDeploy,
            configHotkeys.executingDeployment,
            configBlueprints.deployment
        );
    });

    it('should create a deployment "groups" based on "groups" blueprint', function() {
        addDeployment(
            configBlueprints.blueprints.groupsBlueprint,
            configDeployments.deployment.groupsDeployment,
            configBlueprints.deployment
        );
    });

    it('should create and install a deployment "bomber" based on "bomber" blueprint', function() {
        addDeployment(
            configEvents.bomberBlueprint,
            configDeployments.deployment.deploymentToUpdate.id,
            undefined,
            'install'
        );
    });
});
