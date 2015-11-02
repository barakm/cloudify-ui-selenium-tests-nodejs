'use strict';

var logger = require('log4js').getLogger('Actions');

/**
 * @description selects a dropdown option according to the opts specification
 *
 * @param {object} opts contains information to find the option in the dropdown
 * @param {string} opts.optionName the name of the option
 * @param {string} opts.repeater the dropdown repeater (optional - defaults to 'option in options').
 * @param {object} opts.base the base element (the dropdown)
 *
 */
exports.selectDropdownOption = function( opts ) {
    logger.trace('selecting dropdown by', opts.optionName );

    var openBtn = opts.base.element(by.css('.msArrow'));
    openBtn.click();

    if (!opts.repeater) {
        opts.repeater = 'option in options';
    }

    opts.base.all(by.repeater(opts.repeater)).filter(function(option) {
        return option.getText().then(function (text) {
            return text === opts.optionName;
        });
    }).then(function(filtered) {
        filtered[0].click();
        openBtn.click();
    });
};

/**
 * @description unchecks all dropdown options according to the opts specification
 *
 * @param {object} opts contains information to find the option in the dropdown
 * @param {object} opts.base the base element (the dropdown)
 *
 */
exports.uncheckAllDropdownOptions = function(opts) {
    logger.trace('unselecting all options');

    var openBtn = opts.base.all(by.css('.msArrow'));
    openBtn.click();

    opts.base.all(by.css('[checked=checked]')).click();
    openBtn.click();

};
//This function opens the drop down list But does not closes it!
//so you can perform actions such as getText while the elements are visible.
/**
 * @description gets all dropdown options that are selected
 *
 * @param {object} multiSelectElement is the the multi select element
 *
 */
exports.getSelectedOptions = function(multiSelectElement) {
    multiSelectElement.element(by.css('.msArrow')).click();
    return multiSelectElement.all(by.css('li')).filter(function(item){
        return item.all(by.css('input[checked=checked]')).count().then(function(count){
            return count > 0;
        });
    });
};