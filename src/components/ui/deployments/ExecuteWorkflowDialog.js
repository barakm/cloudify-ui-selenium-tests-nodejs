'use strict';



exports.selectWorkflow = function( name ){
    var workflowName = element(by.model('workflowName'));
    workflowName.$('.msArrow').click();
    workflowName.$$('li').filter(function(item){
        return item.getText().then(function(text){
            return text.toLowerCase().trim() === name.toLowerCase();
        });
    }).first().click();
};

/**
 *
 * @param {object} opts
 * @param {string} opts.name name of workflow
 */
exports.setDetails = function( opts ){
    if ( !opts.name ) {
        exports.selectWorkflow(opts.name);
    }
};

exports.submit = function(){
    return $('.ngdialog .buttonsContainer button:last-child').click();
};