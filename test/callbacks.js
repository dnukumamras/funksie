'use strict';

const Funksie = require('../');
const Hapi = require('@hapi/hapi');
const Scooter = require('@hapi/scooter');

const { expect } = require('@hapi/code');

const { describe, it } = exports.lab = require('@hapi/lab').script();

describe('Callbacks', () => {

    it('allows a callback as the only option', async () => {

        const fpCallback = function (req) {

            const options = {};
            options.cameraSrc = 'self';
            return options;
        };

        const server = Hapi.server();
        server.route({
            method: 'GET',
            path: '/',
            handler: () => {

                return 'callback';
            }
        });
        server.route({
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
        });

        await server.register([Scooter, {
            plugin: Funksie,
            options: fpCallback
        }]);

        const res = await server.inject({
            method: 'GET',
            url: '/capture'
        });

        expect(res.headers).to.contain('feature-policy');
        expect(res.headers['feature-policy']).to.contain('camera \'self');
    });

    it('errors appropriately and skips setting header if callback returns invalid options', async () => {

        const fpCallback = function (req) {

            const options = {};
            options.bananas = true;
            return options;
        };

        const server = Hapi.server();
        server.route({
            method: 'GET',
            path: '/capture',
            config: {
                handler: (request, h) => {

                    return 'callback';
                }
            }
        });

        await server.register([Scooter, {
            plugin: Funksie,
            options: fpCallback
        }]);

        const res = await server.inject({
            method: 'GET',
            url: '/capture'
        });

        expect(res.headers).to.not.contain('feature-policy');
    });
});
