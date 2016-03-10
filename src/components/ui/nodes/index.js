'use strict';

exports.route = function(){
    browser.get('/#/nodes-instances');
};

exports.filters = require('./Filters');
exports.mainTable = require('./MainTable');