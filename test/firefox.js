'use strict';

const Agents = require('browser-agents');
const Funksie = require('../');
const Hapi = require('@hapi/hapi');
const Scooter = require('@hapi/scooter');

const { expect } = require('@hapi/code');

const { describe, it } = exports.lab = require('@hapi/lab').script();

const captureRoute = {
    method: 'GET',
    path: '/capture',
    config: {
        handler: (request, h) => {

            return 'capturing this';
        },
        plugins: {
            funksie: {
                cameraSrc: 'self'
            }
        }
    }
};

describe('Firefox', () => {

    it('sends feature-policy header for firefox', async () => {

        const server = Hapi.server();
        server.route(captureRoute);
        await server.register([Scooter, Funksie]);
        const res = await server.inject({
            method: 'GET',
            url: '/capture',
            headers: {
                'User-Agent': Agents.Firefox['74.0']
            }
        });

        expect(res.statusCode).to.equal(200);
        expect(res.headers).to.contain('feature-policy');
        expect(res.headers['feature-policy']).to.contain('camera \'self\'');
    });
});
