'use strict';
var components = require('../../src/components/index');
var nodesInstances = components.ui.nodesInstances;
var config = components.config.tests.sanity.nodes_spec;

describe('nodes instances page', function() {
    beforeEach(function() {
        nodesInstances.route();
    });

    describe('on load', function(){
        it('should automatically select the first blueprint',function(){
            expect(nodesInstances.filters.blueprints.getSelectedText()).toBe(config.firstBlueprint);
        });

       it('should not show undeployed blueprints', function(){
            expect(nodesInstances.filters.blueprints.getOptionsTexts()).toEqual(config.deployedBlueprints);
        });
    });

    describe('filtering',function(){
        it('should filter by selecting a blueprint', function(){
            //since there is only one blueprint who is chosen automatically
            nodesInstances.filters.clearFilters();
            var currentNodesCount = nodesInstances.mainTable.getNumOfNodes();
            nodesInstances.filters.blueprints.select(config.firstBlueprint);
            var filteredNodesCount = nodesInstances.mainTable.getNumOfNodes();

            expect(currentNodesCount).not.toBe(filteredNodesCount);
        });

        it('should filter by selecting a deployment', function(){
            var currentNodesCount = nodesInstances.mainTable.getNumOfNodes();
            nodesInstances.filters.deployments.select(config.installedDeployment);
            var filteredNodesCount = nodesInstances.mainTable.getNumOfNodes();

            expect(currentNodesCount).not.toBe(filteredNodesCount);
        });

        it('should filter by selecting a type', function(){
            var currentNodesCount = nodesInstances.mainTable.getNumOfNodes();
            nodesInstances.filters.types.select(config.computeType);
            var filteredNodesCount = nodesInstances.mainTable.getNumOfNodes();

            expect(currentNodesCount).not.toBe(filteredNodesCount);
        });

        it('should filter by free text', function(){
            var currentNodesCount = nodesInstances.mainTable.getNumOfNodes();
            nodesInstances.filters.freeText.type('mongo');
            var filteredNodesCount = nodesInstances.mainTable.getNumOfNodes();

            expect(currentNodesCount).not.toBe(filteredNodesCount);
        });

        it('should clear all filters', function(){
            //nodesInstances.filters.blueprints.select(config.firstBlueprint);
            nodesInstances.filters.deployments.select(config.installedDeployment);
            nodesInstances.filters.types.select(config.computeType);
            nodesInstances.filters.freeText.type('mongo');

            nodesInstances.filters.clearFilters();

            expect(nodesInstances.filters.blueprints.getSelectedText()).toBe('Choose a blueprint');
            //deployments is disabled until a blueprint is chosen
            nodesInstances.filters.blueprints.select(config.firstBlueprint);
            expect(nodesInstances.filters.deployments.getSelectedText()).toEqual([]);
            expect(nodesInstances.filters.types.getSelectedText()).toEqual([]);
            expect(nodesInstances.filters.freeText.getText()).toBe('');
        });
    });
});
