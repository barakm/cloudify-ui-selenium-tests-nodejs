'use strict';

module.exports = function ActionsDropdown(base) {

    base = typeof base !== 'undefined' ? base : $('body');

    return {
        clickDefaultAction: function () {
            return base.element(by.css('#split-button')).click();
        },
        getMenuOption: function(option, required ){
            // open the dropdown list
            return base.element(by.css('[dropdown-toggle]'))
                .click()
                .then(function(){
                    return base.all(by.css('.dropdown-menu button')).filter(function (el) {
                        return el.getText().then(function (text) {
                            return text === option;
                        });
                    }).then(function( items ){
                        if ( required ){
                            expect(items.length).toBe(1,'expect action' + option + ' to exist');
                        }
                        return items.length > 0 ? items[0] : undefined;
                    });
                });
        },
        clickMenuOption: function (option) {
            return this.getMenuOption(option).then(function (item) {
                item.click();
                return browser.sleep(1000); // fade out/in
            });
        }
    };
};