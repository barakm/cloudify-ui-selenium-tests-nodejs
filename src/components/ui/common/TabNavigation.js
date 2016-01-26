'use strict';

/**
 * @description
 * <strong> How to use this? </strong>
 *
 * <pre>
 *     <code>
 *         TabNavigation( $('.buttons-group.sections') ).goTo( 'Topology' );
 *     </code>
 * </pre>
 * @param base - base element for component
 * @constructor
 */

module.exports = function TabNavigation(base) {

    return {
        getSections : function(){
            return base.all(by.css('a, button'));
        },
        goTo : function( sectionName ){
            var sections = this.getSections().filter(function (section) {
                return section.getAttribute('value').then(function (text) {
                    return text === sectionName;
                }).then(function(attrEq){
                    // todo: resign from getText checking because it's dependent on translation
                    return section.getText().then(function(text){
                        return attrEq || text === sectionName;
                    });
                });
            });
            expect(sections.count()).toBe(1, 'section ' + sectionName + ' should exist');
            sections.click();
        },
        getCurrentSection : function(){
            return base.element(by.css('a.active')).getText();
        }
    };
};