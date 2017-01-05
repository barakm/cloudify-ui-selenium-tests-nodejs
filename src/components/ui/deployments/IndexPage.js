'use strict';

var logger = require('log4js').getLogger('DeploymentIndexPage');
var common = require('../common');
var utils = require('../../Utils');

exports.getDeployments = function(){
    return element.all(by.css('#deploymentTable tbody'));
};

/**
 * @typedef {object} DeploymentOpts
 * @property {string} id
 */

/**
 *
 * @description returns a promise the fulfills with the first deployment found according to opts specification.
 * <p>
 * for example:
 * if opts.id = 'X' - then it will return the first deployment with name X.
 * </p>
 *
 * @param {DeploymentOpts} opts contains information to find the deployment
 * @returns {webdriver.promise.Deferred.promise|*}
 */
exports.getDeployment = function( opts, optional ){
    logger.trace('getting deployment by ', opts );
    return exports.getDeployments().filter(function(deployment){
        return deployment.element(by.css('.id')).getText().then(function( text ){
            return text === opts.id;
        });
    }).then(function(filtered){
        if ( !optional ) {
            expect(filtered.length).toBe(1, 'deployment ' + JSON.stringify(opts) + ' should exist');
        }
        return filtered.length > 0 ? filtered[0] : undefined;
    });

};

/**
 *
 * @param {DeploymentOpts} opts
 * @returns {*}
 */
exports.goToDeployment = function( opts ){
    return exports.getDeployment(opts).then(function(deployment){
        return deployment.element(by.css('.id a')).click();
    });
};

/**
 *
 * @param {DeploymentOpts} opts
 * @returns {*}
 */
exports.deleteDeployment = function(opts) {
    return exports.getDeployment(opts).then(function(deployment){
        new common.ActionsDropdown(deployment).clickMenuOption('Delete');
    });
};


/**
 *
 * @param {DeploymentOpts} opts
 * @returns {*}
 */
exports.executeWorkflow = function(opts) {
    return exports.getDeployment(opts).then(function(deployment){
        new common.ActionsDropdown(deployment).clickMenuOption('Execute Workflow');
        browser.sleep(3000); //fade in
    });
};


exports.route = function(){
    browser.get('/#/deployments');
    browser.waitForAngular();
};






/**
 *
 * assumption: execution must be still running when reaching here!
 *
 * @param {DeploymentOpts} opts
 */
//
exports.waitForExecutionToFinish = function(opts){

    var progress = null;
    exports.getDeployment(opts).then(function(d){
        progress = d.$('[ng-show="showProgress"]');
    });

    browser.wait(function(){
        try {
            return progress.isPresent();
        }catch(e){
            return false;
        }
    },10000);

    browser.sleep(1).then(function(){
        logger.info('progress is displayed');
    });

    browser.wait(function(){
        try{
            return progress.isDisplayed().then(function(p){ return !p; });
        }catch(e){
            return true;
        }
    },600000); // 10 minutes for installation
    browser.sleep(1).then(function(){
        logger.info('installation finished');
    });

};

/**
 * @description
 *  - loads page
 *  - opens execute workflow on given deployment
 *  - fills in dialog
 *  - runs the execution
 *  - waits until it is done
 *
 * @param {object} opts
 * @param {DeploymentOpts} opts.deployment
 * @param {string} opts.workflow name of workflow
 */
exports.executeWorkflowAndWaitUntilDone = function(opts){

    var executeWorkflowDialog = require('./ExecuteWorkflowDialog');
    exports.route();
    exports.executeWorkflow(opts.deployment);
    executeWorkflowDialog.workflows.select(opts.workflow);
    executeWorkflowDialog.submit();
    exports.waitForExecutionToFinish(opts.deployment);

};

exports.executeWorkflowWithoutWaitingUntilDone = function(opts){

    var executeWorkflowDialog = require('./ExecuteWorkflowDialog');
    exports.route();
    exports.executeWorkflow(opts.deployment);
    executeWorkflowDialog.workflows.select(opts.workflow);
    executeWorkflowDialog.submit();
};

exports.executeWorkflow = function(opts, isWaitUntilDone){

    var executeWorkflowDialog = require('./ExecuteWorkflowDialog');
    exports.route();
    exports.executeWorkflow(opts.deployment);
    executeWorkflowDialog.workflows.select(opts.workflow);
    executeWorkflowDialog.submit();
    if (isWaitUntilDone) {
        exports.waitForExecutionToFinish(opts.deployment);
    }
};

exports.selectDeployment = function(indexOrName){
    if( typeof indexOrName === 'number'){
        $$('[ng-click="select(deployment)"]').get(indexOrName).click();
    }else {
        utils.filters.filterByText($$('[ng-click="select(deployment)"] .id'), indexOrName).first().element(by.xpath('ancestor::tr')).click();
    }
};

exports.getSelectedDeploymentIndex = common.IndexTable.getSelectedItemIndex;

exports.isDeploymentUpdating = function(indexOrName){
    if( typeof indexOrName === 'number') {
        $$('.deployment-action-selector').get(indexOrName).$('.executingWorkflow span[ng-if="currentUpdate"]').isPresent();
    }else {
        var deploymentIndex;
        return $$('[ng-click="select(deployment)"] .id a').each(function(ele, index){
            ele.getText().then(function(text){
                if(text === indexOrName){
                    deploymentIndex = index;
                }
            });
        }).then(function(){
            return $$('.deployment-action-selector').get(deploymentIndex).$('.executingWorkflow span[ng-if="currentUpdate"]').isPresent();
        });
    }
};