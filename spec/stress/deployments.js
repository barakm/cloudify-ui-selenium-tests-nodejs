/**
 * Created by krzysztof on 21.01.16.
 */
'use strict';

var logger = require('log4js').getLogger('deployments_stress');
var http = require('http');

/**
 * this test assumes there's a blueprint called nodecellar1
 * run this test suite with 'grunt protract:stress
 */
describe('deployments stress test', function () {

    var authCookie;
    var deployments = [];
    var loops = 50;
    var baseUrl = browser.baseUrl.replace(/:[0-9]{1,4}.(.*)/, '').replace(/^[a-z]{4}\:\/{2}/, '');
    var port = browser.baseUrl.match(/:+[0-9]{1,4}/)[0].replace(':','');

    function makeRequest(opts, body) {
        //logger.trace(opts);

        if (body) {
            opts.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
        }

        var resBody = '';
        var defer = protractor.promise.defer();

        var req = http.request(opts, function (res) {
            res.setEncoding('utf8');

            res.on('end', function () {
                defer.fulfill({headers: res.headers, body: resBody});
            });
            res.on('data', function (chunk) {
                //logger.trace(chunk);
                resBody += chunk;
            });
        });

        req.on('error', function (data) {
            logger.trace('oh well', data);
        });

        if (body) {
            logger.trace(JSON.stringify(body));
            req.write(JSON.stringify(body));
        }
        req.end();

        return defer;
    }

    function createNewDeployment() {
        var newDeploymentName = 'new-deployment-' + new Date().getTime();
        var data = {
            'blueprint_id': 'nodecellar1',
            'inputs': {
                'agent_private_key_path': 'agent',
                'host_ip': 'host',
                'agent_user': 'user'
            }
        };

        var opts = {
            host: baseUrl,
            path: '/backend/cloudify-api/deployments/' + newDeploymentName,
            port: port,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'cookie': authCookie
            }
        };

        makeRequest(opts, data);

        return newDeploymentName;
    }

    function getExecutions() {
        logger.trace('getting executions');
        var body = {
            _include: 'id,workflow_id,status,deployment_id',
            status: ['pending', 'started']
        };
        var opts = {
            host: baseUrl,
            path: '/backend/cloudify-api/executions',
            port: port,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'cookie': authCookie
            }
        };

        return makeRequest(opts, body);
    }

    function deleteDeployment(id) {
        var opts = {
            host: baseUrl,
            path: '/backend/cloudify-api/deployments/' + id,
            port: port,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'cookie': authCookie
            }
        };
        logger.trace('deleting');
        return makeRequest(opts);
    }

    beforeEach(function () {

        var req = makeRequest({
            host: baseUrl,
            path: '/backend/login',
            port: port,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {username: 'admin', password: 'admin'});

        req.then(function (res) {
            var setcookie = res.headers['set-cookie'];
            if (setcookie) {
                setcookie.forEach(
                    function (cookiestr) {
                        authCookie = cookiestr;
                    }
                );
            }
        });

        browser.sleep(3000);
    });

    function findExecutionsByDeployments(executions, deployments) {
        var foundExecutions = [];
        for (var i = 0; i < executions.length; i++) {
            for (var j = 0; j < deployments.length; j++) {
                if (executions[i].deployment_id === deployments[j]) {
                    foundExecutions.push(executions[i]);
                    break;
                }
            }
            if (foundExecutions.length === deployments.length) {
                break;
            }
        }

        return foundExecutions;
    }

    function loopme() {
        var defer = protractor.promise.defer();
        var flow = protractor.promise.controlFlow();
        //// the loop needs to be in one test.
        //// after creating 2 deployments probe the server with getDeployment requests
        //// if too much time passed and they have not been initialized, fail the test
        //// if they have been initialized, stop probing and delete
        //// get both deployments to see if they have been deleted
        //// (probing)
        //// repeat 50 times

        deployments[0] = createNewDeployment();
        browser.sleep(1000).then(function () {
            deployments[1] = createNewDeployment();
        });

        browser.sleep(5000).then(function () {

            return flow.await(getExecutions());
        }).then(function (data) {

            expect(findExecutionsByDeployments(JSON.parse(data.body).items, deployments).length).toEqual(2);
            return browser.sleep(90000);
        }).then(function () {

            return flow.await(deleteDeployment(deployments[0]));
        }).then(function () {

            return flow.await(deleteDeployment(deployments[1]));
        }).then(function () {

            return browser.sleep(10000);
        }).then(function () {

            return flow.await(getExecutions());
        }).then(function (data) {

            expect(findExecutionsByDeployments(JSON.parse(data.body).items, deployments).length).toEqual(0);
            loops--;
            if (loops > 0) {
                logger.trace(loops);
                loopme();
            } else {
                defer.fulfill('sth');
            }
        });

        return defer;
    }

    it('should create and delete multiple deployments', function () {

        loopme();

    });
});

