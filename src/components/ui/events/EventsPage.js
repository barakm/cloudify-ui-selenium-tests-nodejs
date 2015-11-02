'use strict';

//var logger = require('log4js').getLogger('IndexPage');
var actions = require('../common/Actions');

exports.route = function(){
    browser.get('/#/logs');
};

exports.filters = require('./Filters');
exports.mainTable = require('./MainTable');


