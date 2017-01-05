'use strict';
var Input = require('../common/Input');
var UploadForm = require('../common/UploadForm');
var dialog = $('#update-deployment-dialog');
var confirmButton = dialog.$$('.confirmationButtons button').get(1);
var cancelButton = dialog.$$('.confirmationButtons button').get(0);

exports.clickConfirm = function(){
    confirmButton.click();
};

exports.clickCancel = function(){
    cancelButton.click();
};

exports.clickClose = function(){
    element.all(by.css('.ngdialog-close')).click();
};

exports.isConfirmDisabled = function(){
  return confirmButton.getAttribute('disabled').then(function(attr){
        return !!attr;
    });
};

var uploadForms = dialog.$$('upload-file-form');
exports.archive = new UploadForm(uploadForms.first());
exports.inputs = new UploadForm(uploadForms.get(1));

exports.fileName = new Input(dialog.$('.file-name input'));

var radioOptions = dialog.$$('.radio-option input[type=radio]');
exports.selectDefaultWorkflow = function(){
    radioOptions.first().click();
};

var checkboxOptions = dialog.$$('.option-content input[type=checkbox]');
exports.toggleInstallCheckbox = function(){
    checkboxOptions.first().click();
};

exports.toggleUninstallCheckbox = function(){
    checkboxOptions.get(1).click();
};

exports.selectCustomWorkflow = function () {
    radioOptions.get(1).click();
};

exports.workflowId = new Input(dialog.$('#workflow-id'));

exports.isUpdateError = function(){
    var errorMessage = dialog.$('.error-message');
    return errorMessage.isPresent();
};