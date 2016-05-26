'use strict';
var logger = require('log4js').getLogger('hotkeys_spec');
var components = require('../../src/components/index');
var hotkeys = components.ui.hotkeys;
var config = components.config.tests.sanity.hotkeys_spec;
var blueprintsConfig = components.config.tests.sanity.blueprints_spec;
var deploymentsConfig = components.config.tests.sanity.deployments_spec;

var routeToBlueprints = components.ui.blueprints.IndexPage.route;
var routeToDeployments = components.ui.deployments.IndexPage.route;
var routeToLogs = components.ui.events.page.route;

var sendKeys = function(keys){
    browser.actions().sendKeys(keys).perform();
};

describe('Website hotkeys', function(){

    beforeEach(function(){ logger.info('running from ' + __filename); });

    //TODO Phantomjs doesn't seem to send those keys so it doesn't work while it does on chrome :/ https://cloudifysource.atlassian.net/browse/CFY-4962
    //describe('Navigation hotkeys', function(){
    //    var isPage = function(pageName){
    //        return browser.getCurrentUrl().then(function(currentUrl) {
    //            return currentUrl.indexOf('/'+pageName) !== -1;
    //        });
    //    };
    //
    //    beforeEach(function(){
    //        browser.get('/#/blueprints');
    //        browser.waitForAngular();
    //    });
    //
    //    it('should navigate to blueprints', function(){
    //        browser.get('/#/deployments');
    //        browser.waitForAngular();
    //
    //        hotkeys.Navigations.blueprints();
    //        expect(isPage('blueprints')).toBe(true);
    //    });
    //
    //    it('should navigate to deployments', function(){
    //        hotkeys.Navigations.deployments();
    //        expect(isPage('deployments')).toBe(true);
    //    });
    //
    //    it('should navigate to logs & events', function(){
    //        hotkeys.Navigations.logs();
    //        expect(isPage('logs')).toBe(true);
    //    });
    //
    //    it('should navigate to nodes', function(){
    //        hotkeys.Navigations.nodes();
    //        expect(isPage('nodes')).toBe(true);
    //    });
    //});

    describe('Upload blueprint', function(){
        describe('blueprint index', function(){
            beforeEach(function(){
                routeToBlueprints();
            });

            it('should open upload blueprint dialog', function(){
                hotkeys.UploadBlueprint();

                expect($('#uploadForm').isPresent()).toBe(true);
            });
        });


        describe('not found blueprint at blueprint page', function(){
            beforeEach(function(){
                browser.get('/#/blueprint/'+config.notExistingBlueprint+'/topology');
                browser.waitForAngular();
            });

            it('should open upload blueprint dialog', function(){
                hotkeys.UploadBlueprint();

                expect($('#uploadForm').isPresent()).toBe(true);
            });
        });
    });

    describe('Blueprint actions hotkeys', function(){
        describe('Bluprints index', function(){
            beforeEach(function(){
                routeToBlueprints();
            });

            it('should open deploy dialog', function(){
                components.ui.blueprints.IndexPage.selectBlueprint(0);
                hotkeys.BlueprintActions.deploy();

                expect($('.deploy-dialog').isPresent()).toBe(true);
            });

            it('should open delete dialog', function(){
                components.ui.blueprints.IndexPage.selectBlueprint(0);
                hotkeys.BlueprintActions.delete();

                expect($('.delete-dialog').isPresent()).toBe(true);
            });
        });

        describe('Bluprint page', function(){
            beforeEach(function(){
                browser.get('/#/blueprint/'+config.anyBlueprint+'/topology');
                browser.waitForAngular();
            });

            it('should open deploy dialog', function(){
                hotkeys.BlueprintActions.deploy();

                expect($('.deploy-dialog').isPresent()).toBe(true);
            });

            it('should open delete dialog', function(){
                hotkeys.BlueprintActions.delete();

                expect($('.delete-dialog').isPresent()).toBe(true);
            });
        });
    });

    describe('Deployment actions hotkeys', function(){
        describe('Not executing deployment', function(){
            describe('Deployments index', function(){
                beforeEach(function(){
                    routeToDeployments();
                });

                it('should open execute dialog', function(){
                    components.ui.deployments.IndexPage.selectDeployment(0);
                    hotkeys.DeploymentActions.execute();

                    expect($('.start-execution-dialog').isPresent()).toBe(true);
                });

                it('should open delete dialog', function(){
                    components.ui.deployments.IndexPage.selectDeployment(0);
                    hotkeys.DeploymentActions.delete();

                    expect($('.delete-dialog').isPresent()).toBe(true);
                });
            });

            describe('Deployment page', function(){
                beforeEach(function(){
                    browser.get('/#/deployment/'+config.notExecutingDeployment+'/topology');
                    browser.waitForAngular();
                });

                it('should open execute dialog', function(){
                    hotkeys.DeploymentActions.execute();
                    expect($('.start-execution-dialog').isPresent()).toBe(true);
                });



                it('should open delete dialog', function(){
                    hotkeys.DeploymentActions.delete();
                    expect($('.delete-dialog').isPresent()).toBe(true);
                });
            });
        });

        describe('Executing deployment', function(){
            beforeAll(function(){
                routeToDeployments();

                components.ui.deployments.IndexPage.executeWorkflowWithoutWaitingUntilDone({
                    deployment: {
                        id: config.executingDeployment
                    },
                    workflow: 'install'
                });
            });

            describe('Deployments index', function(){
                beforeEach(function(){
                    routeToDeployments();
                });

                it('should open cancel execution dialog', function(){
                    components.ui.deployments.IndexPage.selectDeployment(config.executingDeployment);
                    hotkeys.DeploymentActions.cancelExecution();

                    expect(element(by.css('.cancel-execution-dialog')).isPresent()).toBe(true);
                });
            });

            describe('Deployment page', function(){
                beforeEach(function(){
                    browser.get('/#/deployment/'+config.executingDeployment+'/topology');
                    browser.waitForAngular();
                });

                it('should open cancel execution dialog', function(){
                    hotkeys.DeploymentActions.cancelExecution();

                    expect(element(by.css('.cancel-execution-dialog')).isPresent()).toBe(true);
                });
            });

            //uninstall test deployment
            afterAll(function() {
                browser.get('/#/deployments');
                browser.waitForAngular();
                components.ui.deployments.IndexPage.selectDeployment(config.executingDeployment);
                hotkeys.DeploymentActions.cancelExecutionWithSubmit();
                browser.sleep(5000);
                components.ui.deployments.IndexPage.executeWorkflowWithoutWaitingUntilDone({
                    deployment: {
                        id: config.executingDeployment},
                    workflow: 'uninstall'
                });
            });
        });
    });

    describe('Quick search & blur', function(){
        it('should focus main search input and blur it', function(){
            routeToBlueprints();

            hotkeys.Globals.quickSearch();
            expect(browser.driver.switchTo().activeElement().getAttribute('id')).toBe('searchBlueprintByName');

            hotkeys.Globals.escape();
            expect(browser.driver.switchTo().activeElement().getAttribute('id')).toBe('');
        });
    });

    describe('Dialogs', function(){
        it('should pause and unpause hotkeys', function(){
            browser.get('/#/deployment/'+config.notExecutingDeployment+'/topology');
            browser.waitForAngular();

            hotkeys.Globals.openCheatSheet();
            expect($('.cfp-hotkeys-container').getCssValue('visibility')).toBe('visible');

            hotkeys.Globals.escape();
            hotkeys.DeploymentActions.execute();
            hotkeys.Globals.openCheatSheet();
            // Waiting for dialog to broadcast open event
            browser.sleep(1000);
            expect($('.cfp-hotkeys-container').getCssValue('visibility')).toBe('hidden');

            hotkeys.Globals.escape();
            // Waiting for dialog to broadcast closed event
            browser.sleep(1000);
            hotkeys.Globals.openCheatSheet();
            expect($('.cfp-hotkeys-container').getCssValue('visibility')).toBe('visible');
        });

        describe('Upload blueprint dialog', function(){
            beforeEach(function(){
                routeToBlueprints();
                hotkeys.UploadBlueprint();
            });

            //TODO: phantomjs bug don't focus label elements: https://github.com/ariya/phantomjs/issues/14250
            //it('should open file selection', function(){
            //    expect($('#uploadDialogContainer').isPresent()).toBe(true);
            //    hotkeys.Globals.tab();
            //    hotkeys.Globals.enter();
            //    // Closing the file selection dialog should keep the dialog open
            //    hotkeys.Globals.escape();
            //    expect($('#uploadDialogContainer').isPresent()).toBe(true);
            //    //Waiting for dialog selection to be closed
            //    browser.sleep(1000);
            //    hotkeys.Globals.escape();
            //    expect($('#uploadDialogContainer').isPresent()).toBe(false);
            //});

            it('should tab all through the dialog', function(){
                //autofocus input on open
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('inputText');
                sendKeys('http://awesomeBlueprint.com');

                //TODO: phantomjs bug don't focus label elements: https://github.com/ariya/phantomjs/issues/14250
                //hotkeys.Globals.tab();
                //expect(browser.driver.switchTo().activeElement().getAttribute('id')).toBe('browseBtn');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('blueprintUploadOpts.blueprint_id');
                sendKeys('awesome');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('blueprintUploadOpts.params.application_file_name');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('id')).toBe('uploadBtn');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('inputText');
            });
        });

        describe('Deploy blueprint dialog', function(){
            beforeEach(function(){
                routeToBlueprints();
            });

            it('should tab all through the dialog', function() {
                components.ui.blueprints.IndexPage.selectBlueprint(0);
                hotkeys.BlueprintActions.deploy();

                //autofocus input on open
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('deploymentId');
                sendKeys('deployment1');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('class')).toBe('btn btn-default active');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('class')).toBe('btn btn-default');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('name')).toBe('agent_private_key_path');
                sendKeys('awesome');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('name')).toBe('agent_user');
                sendKeys('stuff');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('name')).toBe('host_ip');
                sendKeys('!');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('id')).toBe('deployBtn');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('deploymentId');
            });

        });

        describe('Execute workflow dialog', function(){
            beforeEach(function(){
                routeToDeployments();
            });

            it('should use multiMenuSelection', function(){
                components.ui.deployments.IndexPage.selectDeployment(0);
                hotkeys.DeploymentActions.execute();

                hotkeys.Globals.tab();
                hotkeys.Globals.enter();
                hotkeys.Globals.arrowDown();
                browser.waitForAngular();
                hotkeys.Globals.enter();
                $('.multiSelectMenu t').getText(function(text){
                    expect(text).toBe('heal');
                });
                expect($('[form-raw-params]').isPresent()).toBe(true);
            });
        });
    });


    describe('Items navigation ', function(){
        it('should navigate items', function(){
            routeToBlueprints();

            hotkeys.ItemsNavigation.next();
            expect(components.ui.blueprints.IndexPage.getSelectedBlueprintIndex()).toBe(0);

            hotkeys.ItemsNavigation.next();
            expect(components.ui.blueprints.IndexPage.getSelectedBlueprintIndex()).toBe(1);

            hotkeys.ItemsNavigation.next();
            expect(components.ui.blueprints.IndexPage.getSelectedBlueprintIndex()).toBe(1);


            hotkeys.ItemsNavigation.prev();
            expect(components.ui.blueprints.IndexPage.getSelectedBlueprintIndex()).toBe(0);

            hotkeys.ItemsNavigation.prev();
            expect(components.ui.blueprints.IndexPage.getSelectedBlueprintIndex()).toBe(0);

            hotkeys.Globals.enter();
            expect(browser.getCurrentUrl()).toContain(config.anyBlueprint);

            browser.get('/#/deployments');
            browser.waitForAngular();

            hotkeys.ItemsNavigation.next();
            expect(components.ui.deployments.IndexPage.getSelectedDeploymentIndex()).toBe(0);

            hotkeys.ItemsNavigation.next();
            expect(components.ui.deployments.IndexPage.getSelectedDeploymentIndex()).toBe(1);

            hotkeys.ItemsNavigation.prev();
            expect(components.ui.deployments.IndexPage.getSelectedDeploymentIndex()).toBe(0);

            var deploymentName = config.notExecutingDeployment;
            components.ui.deployments.IndexPage.selectDeployment(deploymentName);
            hotkeys.Globals.enter();
            expect(browser.getCurrentUrl()).toContain(deploymentName);
        });

        it('should page', function(){
            //Todo check pagination for blueprints & deployments index as well
            routeToLogs();

            hotkeys.Paging.next();
            expect(components.ui.events.page.mainTable.pagination.isPageActive(2)).toBe(true);
            hotkeys.Paging.next();
            expect(components.ui.events.page.mainTable.pagination.isPageActive(2)).toBe(true);
            hotkeys.Paging.prev();
            expect(components.ui.events.page.mainTable.pagination.isPageActive(1)).toBe(true);
        });
    });

    describe('Tabs routing', function(){
        it('should route blueprint tabs', function(){
            var blueprintUrl = '/#/blueprint/'+config.anyBlueprint+'/';
            var blueprintSections = blueprintsConfig.blueprints.sections;
            browser.get(blueprintUrl+blueprintSections.topology.url);
            browser.waitForAngular();

            hotkeys.BlueprintNavigation.goToNodes();
            expect(browser.getCurrentUrl()).toContain(blueprintUrl+blueprintSections.nodes.url);
            hotkeys.BlueprintNavigation.goToSource();
            expect(browser.getCurrentUrl()).toContain(blueprintUrl+blueprintSections.source.url);
            hotkeys.BlueprintNavigation.goToTopology();
            expect(browser.getCurrentUrl()).toContain(blueprintUrl+blueprintSections.topology.url);
        });

        it('should route deployment tabs', function(){
            var deploymentUrl = '/#/deployment/'+config.notExecutingDeployment+'/';
            var deploymentSections = deploymentsConfig.deployment.sections;
            browser.get(deploymentUrl+deploymentSections.topology.url);
            browser.waitForAngular();

            hotkeys.DeploymentNavigation.goToNodes();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.nodes.url);
            hotkeys.DeploymentNavigation.goToExecutions();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.executions.url);
            hotkeys.DeploymentNavigation.goToInputsOutputs();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.inputs_outputs.url);
            hotkeys.DeploymentNavigation.goToSource();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.source.url);
            hotkeys.DeploymentNavigation.goToMonitoring();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.monitoring.url);
            hotkeys.DeploymentNavigation.goToTopology();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.topology.url);
        });
    });

    describe('forRawParams', function(){
        it('should switch between raw and params view', function(){
            routeToBlueprints();

            hotkeys.ItemsNavigation.next();
            hotkeys.BlueprintActions.deploy();
            hotkeys.Globals.tab();
            hotkeys.Globals.tab();
            hotkeys.Globals.enter();
            expect($('.inputsParameters.ng-hide').isPresent()).toBe(true);
            expect($('.inputsRaw.ng-hide').isPresent()).toBe(false);
            hotkeys.Globals.shiftTab();
            hotkeys.Globals.enter();
            expect($('.inputsParameters.ng-hide').isPresent()).toBe(false);
            expect($('.inputsRaw.ng-hide').isPresent()).toBe(true);
        });
    });

    describe('Quick search & blur', function(){
        it('should focus main search input and blur it', function(){
            routeToBlueprints();

            hotkeys.Globals.quickSearch();
            expect(browser.driver.switchTo().activeElement().getAttribute('id')).toBe('searchBlueprintByName');

            hotkeys.Globals.escape();
            expect(browser.driver.switchTo().activeElement().getAttribute('id')).toBe('');
        });
    });

    describe('Dialogs', function(){
        it('should pause and unpause hotkeys', function(){
            browser.get('/#/deployment/'+config.notExecutingDeployment+'/topology');
            browser.waitForAngular();

            hotkeys.Globals.openCheatSheet();
            expect($('.cfp-hotkeys-container').getCssValue('visibility')).toBe('visible');

            hotkeys.Globals.escape();
            hotkeys.DeploymentActions.execute();
            hotkeys.Globals.openCheatSheet();
            // Waiting for dialog to broadcast open event
            browser.sleep(1000);
            expect($('.cfp-hotkeys-container').getCssValue('visibility')).toBe('hidden');

            hotkeys.Globals.escape();
            // Waiting for dialog to broadcast closed event
            browser.sleep(1000);
            hotkeys.Globals.openCheatSheet();
            expect($('.cfp-hotkeys-container').getCssValue('visibility')).toBe('visible');
        });

        describe('Upload blueprint dialog', function(){
            beforeEach(function(){
                routeToBlueprints();
                hotkeys.UploadBlueprint();
            });

            //TODO: phantomjs bug don't focus label elements: https://github.com/ariya/phantomjs/issues/14250
            //it('should open file selection', function(){
            //    expect($('#uploadDialogContainer').isPresent()).toBe(true);
            //    hotkeys.Globals.tab();
            //    hotkeys.Globals.enter();
            //    // Closing the file selection dialog should keep the dialog open
            //    hotkeys.Globals.escape();
            //    expect($('#uploadDialogContainer').isPresent()).toBe(true);
            //    //Waiting for dialog selection to be closed
            //    browser.sleep(1000);
            //    hotkeys.Globals.escape();
            //    expect($('#uploadDialogContainer').isPresent()).toBe(false);
            //});

            it('should tab all through the dialog', function(){
                //autofocus input on open
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('inputText');
                sendKeys('http://awesomeBlueprint.com');

                //TODO: phantomjs bug don't focus label elements: https://github.com/ariya/phantomjs/issues/14250
                //hotkeys.Globals.tab();
                //expect(browser.driver.switchTo().activeElement().getAttribute('id')).toBe('browseBtn');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('blueprintUploadOpts.blueprint_id');
                sendKeys('awesome');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('blueprintUploadOpts.params.application_file_name');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('id')).toBe('uploadBtn');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('inputText');
            });
        });

        describe('Deploy blueprint dialog', function(){
            beforeEach(function(){
                routeToBlueprints();
            });

            it('should tab all through the dialog', function() {
                components.ui.blueprints.IndexPage.selectBlueprint(0);
                hotkeys.BlueprintActions.deploy();

                //autofocus input on open
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('$parent.deployment_id');
                sendKeys('deployment1');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('class')).toBe('btn btn-default active');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('class')).toBe('btn btn-default');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('name')).toBe('agent_private_key_path');
                sendKeys('awesome');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('name')).toBe('agent_user');
                sendKeys('stuff');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('name')).toBe('host_ip');
                sendKeys('!');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('id')).toBe('deployBtn');

                hotkeys.Globals.tab();
                expect(browser.driver.switchTo().activeElement().getAttribute('ng-model')).toBe('$parent.deployment_id');
            });

        });

        describe('Execute workflow dialog', function(){
            beforeEach(function(){
                routeToDeployments();
            });

            it('should use multiMenuSelection', function(){
                components.ui.deployments.IndexPage.selectDeployment(0);
                hotkeys.DeploymentActions.execute();

                hotkeys.Globals.tab();
                hotkeys.Globals.enter();
                hotkeys.Globals.arrowDown();
                browser.waitForAngular();
                hotkeys.Globals.enter();
                $('.multiSelectMenu t').getText(function(text){
                    expect(text).toBe('heal');
                });
                expect($('[form-raw-params]').isPresent()).toBe(true);
            });
        });
    });


    describe('Items navigation ', function(){
        it('should navigate items', function(){
            routeToBlueprints();

            hotkeys.ItemsNavigation.next();
            expect(components.ui.blueprints.IndexPage.getSelectedBlueprintIndex()).toBe(0);

            hotkeys.ItemsNavigation.next();
            expect(components.ui.blueprints.IndexPage.getSelectedBlueprintIndex()).toBe(1);

            hotkeys.ItemsNavigation.next();
            expect(components.ui.blueprints.IndexPage.getSelectedBlueprintIndex()).toBe(1);


            hotkeys.ItemsNavigation.prev();
            expect(components.ui.blueprints.IndexPage.getSelectedBlueprintIndex()).toBe(0);

            hotkeys.ItemsNavigation.prev();
            expect(components.ui.blueprints.IndexPage.getSelectedBlueprintIndex()).toBe(0);

            hotkeys.Globals.enter();
            expect(browser.getCurrentUrl()).toContain(config.anyBlueprint);

            browser.get('/#/deployments');
            browser.waitForAngular();

            hotkeys.ItemsNavigation.next();
            expect(components.ui.deployments.IndexPage.getSelectedDeploymentIndex()).toBe(0);

            hotkeys.ItemsNavigation.next();
            expect(components.ui.deployments.IndexPage.getSelectedDeploymentIndex()).toBe(1);

            hotkeys.ItemsNavigation.prev();
            expect(components.ui.deployments.IndexPage.getSelectedDeploymentIndex()).toBe(0);

            var deploymentName = config.notExecutingDeployment;
            components.ui.deployments.IndexPage.selectDeployment(deploymentName);
            hotkeys.Globals.enter();
            expect(browser.getCurrentUrl()).toContain(deploymentName);
        });

        it('should page', function(){
            //Todo check pagination for blueprints & deployments index as well
            routeToLogs();

            hotkeys.Paging.next();
            expect(components.ui.events.page.mainTable.pagination.isPageActive(2)).toBe(true);
            hotkeys.Paging.next();
            expect(components.ui.events.page.mainTable.pagination.isPageActive(2)).toBe(true);
            hotkeys.Paging.prev();
            expect(components.ui.events.page.mainTable.pagination.isPageActive(1)).toBe(true);
        });
    });

    describe('Tabs routing', function(){
        it('should route blueprint tabs', function(){
            var blueprintUrl = '/#/blueprint/'+config.anyBlueprint+'/';
            var blueprintSections = blueprintsConfig.blueprints.sections;
            browser.get(blueprintUrl+blueprintSections.topology.url);
            browser.waitForAngular();

            hotkeys.BlueprintNavigation.goToNodes();
            expect(browser.getCurrentUrl()).toContain(blueprintUrl+blueprintSections.nodes.url);
            hotkeys.BlueprintNavigation.goToSource();
            expect(browser.getCurrentUrl()).toContain(blueprintUrl+blueprintSections.source.url);
            hotkeys.BlueprintNavigation.goToTopology();
            expect(browser.getCurrentUrl()).toContain(blueprintUrl+blueprintSections.topology.url);
        });

        it('should route deployment tabs', function(){
            var deploymentUrl = '/#/deployment/'+config.notExecutingDeployment+'/';
            var deploymentSections = deploymentsConfig.deployment.sections;
            browser.get(deploymentUrl+deploymentSections.topology.url);
            browser.waitForAngular();

            hotkeys.DeploymentNavigation.goToNodes();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.nodes.url);
            hotkeys.DeploymentNavigation.goToExecutions();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.executions.url);
            hotkeys.DeploymentNavigation.goToInputsOutputs();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.inputs_outputs.url);
            hotkeys.DeploymentNavigation.goToSource();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.source.url);
            hotkeys.DeploymentNavigation.goToMonitoring();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.monitoring.url);
            hotkeys.DeploymentNavigation.goToTopology();
            expect(browser.getCurrentUrl()).toContain(deploymentUrl+deploymentSections.topology.url);
        });
    });

    describe('forRawParams', function(){
        it('should switch between raw and params view', function(){
            routeToBlueprints();

            hotkeys.ItemsNavigation.next();
            hotkeys.BlueprintActions.deploy();
            hotkeys.Globals.tab();
            hotkeys.Globals.tab();
            hotkeys.Globals.enter();
            expect($('.inputsParameters.ng-hide').isPresent()).toBe(true);
            expect($('.inputsRaw.ng-hide').isPresent()).toBe(false);
            hotkeys.Globals.shiftTab();
            hotkeys.Globals.enter();
            expect($('.inputsParameters.ng-hide').isPresent()).toBe(false);
            expect($('.inputsRaw.ng-hide').isPresent()).toBe(true);
        });
    });
});