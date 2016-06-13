'use strict';

var fs = require('fs');
var logger = require('log4js').getLogger('plugins_spec');
var components = require('../../src/components/index');

var tempFolderPath = '/tmp';
// var tempFolderPath = 'C:\\Users\\Alex\\AppData\\Local\\Temp\\'; // Windows

describe('plugins page', function() {
    var testPlugin = {package_name: 'cloudify-ldap-plugin'};

    beforeEach(function() { logger.info('running from ' + __filename); });

    beforeAll(function() { components.ui.LoginPage.goTo().login('admin', 'admin'); });
    beforeEach(function() { components.ui.layout.goToPlugins(); });

    it('should upload plugin', function(done) {
        var uploadedPlugin = {plugin_location: 'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.3.1/sp-RELEASE/cloudify_ldap_plugin-1.0-py27-none-linux_x86_64-centos-Core.wgn'};
        var numberOfPlugins;

        element.all(by.repeater('plugin in displayedPlugins')).then(function(plugins) {
            numberOfPlugins = plugins.length;
        });

        components.ui.plugins.IndexPage.clickUploadPlugin();
        components.ui.common.Dialog.close();

        expect(components.ui.plugins.UploadPluginDialog.getUploadForm().isPresent()).toBe(false);

        components.ui.plugins.IndexPage.clickUploadPlugin(); // reopen

        expect(components.ui.plugins.UploadPluginDialog.getUploadForm().isPresent()).toBe(true);

        components.ui.plugins.UploadPluginDialog.setDetails(uploadedPlugin);
        components.ui.plugins.UploadPluginDialog.submit();

        element.all(by.repeater('plugin in displayedPlugins')).then(function(plugins) {
            expect(plugins.length).toBe(numberOfPlugins + 1);
        });

        browser.sleep(1000).then(done);
    });

    // todo: turn this on when a better way of getting plugin usage is ready
    //it('should go to a single plugin view', function(done) {
    //    element.all(by.repeater('plugin in displayedPlugins'))
    //        .first()
    //        .element(by.css('.id')).getText()
    //        .then(function(pluginId) {
    //            components.ui.plugins.IndexPage.goToPlugin({id: pluginId});
    //
    //            expect(browser.getCurrentUrl()).toContain(pluginId);
    //        });
    //
    //    browser.sleep(1000).then(done);
    //});

    // todo: download functionality doesn't work in phantomjs
    xit('should download plugin', function(done) {
        components.ui.plugins.IndexPage.getPlugin(testPlugin)
            .then(function(plugin) {
                plugin.element(by.css('.id')).getText()
                    .then(function(pluginId) {
                        var path = tempFolderPath + pluginId + '.tar.gz';

                        components.ui.plugins.IndexPage.downloadPlugin(testPlugin);

                        browser.driver.wait(function() {
                            return fs.existsSync(path);
                        }, 10000).then(function() {
                            expect(fs.existsSync(path)).toBe(true);
                            done();
                        });
                    });
            });
    });

    it('should delete plugin', function(done) {
        components.ui.plugins.IndexPage.deletePlugin(testPlugin);
        browser.sleep(10000).then(function() {
            expect(components.ui.plugins.IndexPage.getPlugin(testPlugin, true)).toBeUndefined('delete plugin should refresh plugins');
            done();
        });
    });
});
