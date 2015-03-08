'use strict';

var q = require('q');
var driver = require('../../driver');
var logger = require('log4js').getLogger('Deployments.Actions');
var css = require('selenium-webdriver').By.css;
var async = require('async');

/**
 * Deployment Actions menu
 * @constructor
 */
var Actions = function() {

    /**
     * Open Menu and select one option
     * @param {element} actionsHook - element container which include the actions elements
     * @param {string} action - option name to choose
     * @returns {promise}
     */
    this.selectAction = function(actionsHook, action) {
        var deferred = q.defer();
        // find the multi select menu element
        actionsHook.findElement(css('.multiSelectMenu')).then(function(actionMenu){
            // now we click on the menu to open it
            actionMenu.click().then(function(){
                // selection all the options inside the menu to search for the select option
                actionMenu.findElements(css('ul li')).then(function(list){
                    // run over the options and looking for the right match to select
                    async.each(list, function(option, callback){
                        // get the text of each option to compere it to the selected option
                        option.getText().then(function(actionText){
                            // if we have a match
                            if(actionText === action) {
                                // click on the option to mark it as selected
                                option.click().then(function(){
                                    callback();
                                });
                            }
                            else {
                                callback();
                            }
                        });
                    }, function(){
                        // async complete the running of all the option
                        deferred.resolve();
                    });
                });
            });
        });
        return deferred.promise;
    };

    /**
     * Clicking on enabled play action button
     * @param {element} actionsHook - element container which include the actions elements
     * @returns {promise}
     */
    this.playAction = function(actionsHook) {
        var deferred = q.defer();
        // wait for the play button to be enabled
        driver.get().wait(function(){
            // when the button become enabled it returns the element
            return actionsHook.findElement(css('i.deployment-play.play')).then(function(playButton){
                return playButton;
            });
        }, 10000).then(function(playButton){
            // after the element is found as enabled we can click on it
            playButton.click().then(function(){
                deferred.resolve(null);
            });
        }).thenCatch(function(){
            // in case the time is out without enabled play button
            deferred.resolve('deployment-play undetected!');
        });
        return deferred.promise;
    };

    /**
     * Clicking on buttons in confirmation dialog which become open after clicking on play button
     * @param {string} action - name of action to choose ( Cancel / Confirm / etc.. )
     * @returns {promise}
     */
    this.playConfirmation = function(action) {
        var deferred = q.defer();
        // find all the buttons on the confirmation dialog
        driver.get().findElements(css('#confirmationDialogContainer .confirmationButtons button')).then(function(confirmButtons){
            // run over all the buttons and search for the right match
            async.each(confirmButtons, function(button, callback){
                button.getText().then(function(buttonText){
                    // if we have h match
                    if(buttonText === action) {
                        // click on the button
                        button.click().then(function(){
                            callback();
                        });
                    }
                    else {
                        callback();
                    }
                });
            }, function(){
                // async complete the running of all the buttons
                deferred.resolve();
            });
        });
        return deferred.promise;
    };

};

module.exports = Actions;
