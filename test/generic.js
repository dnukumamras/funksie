'use strict';

const Funksie = require('../');
const Hapi = require('@hapi/hapi');
const Scooter = require('@hapi/scooter');

const { expect } = require('@hapi/code');

const { describe, it } = exports.lab = require('@hapi/lab').script();

const defaultRoute = {
    method: 'GET',
    path: '/',
    handler: () => {

        return 'defaults';
    }
};

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

describe('Generic headers', () => {

    it('sends default headers', async () => {

        const server = Hapi.server();
        server.route(captureRoute);
        await server.register([Scooter, Funksie]);
        const res = await server.inject({
            method: 'GET',
            url: '/capture'
        });

        expect(res.statusCode).to.equal(200);
        expect(res.headers).to.contain('feature-policy');
        expect(res.headers['feature-policy']).to.contain('camera \'self');
    });

    it('sets headers when content-type is set and is text/html', async () => {

        const server = Hapi.server();
        server.route({
            method: 'GET',
            path: '/capture',
            config: {
                handler: (request, h) => {

                    return h.response('test').type('text/html');
                },
                plugins: {
                    funksie: {
                        cameraSrc: 'self'
                    }
                }
            }
        });

        await server.register([Scooter, Funksie]);
        const res = await server.inject({
            method: 'GET',
            url: '/capture'
        });

        expect(res.statusCode).to.equal(200);
        expect(res.headers).to.contain('feature-policy');
    });

    it('does not set headers when content-type is set and is not text/html', async () => {

        const server = Hapi.server();
        server.route({
            method: 'GET',
            path: '/capture',
            config: {
                handler: (request, h) => {

                    return h.response('test').type('application/json');
                },
                plugins: {
                    funksie: {
                        cameraSrc: 'self'
                    }
                }
            }
        });

        await server.register([Scooter, Funksie]);
        const res = await server.inject({
            method: 'GET',
            url: '/capture'
        });

        expect(res.statusCode).to.equal(200);
        expect(res.headers).to.not.contain('feature-policy');
    });

    it('sends default headers when scooter is not loaded', async () => {

        const server = Hapi.server();
        server.route(captureRoute);
        await server.register(Funksie);
        const res = await server.inject({
            method: 'GET',
            url: '/capture'
        });

        expect(res.statusCode).to.equal(200);
        expect(res.headers).to.contain('feature-policy');
        expect(res.headers['feature-policy']).to.contain('camera \'self\'');
    });

    it('does not crash when responding with an error', async () => {

        const server = Hapi.server();
        server.route({
            method: 'GET',
            path: '/capture',
            config: {
                handler: (request, h) => {

                    throw new Error('broken!');
                },
                plugins: {
                    funksie: {
                        cameraSrc: 'self'
                    }
                }
            }
        });
        await server.register([Scooter, Funksie]);
        const res = await server.inject({
            method: 'GET',
            url: '/capture'
        });

        expect(res.statusCode).to.equal(500);
        expect(res.headers).to.contain('feature-policy');
        expect(res.headers['feature-policy']).to.contain('camera \'self\'');
    });

    it('allows setting array directives to a single string', async () => {

        const server = Hapi.server();
        server.route(defaultRoute);
        await server.register([Scooter, {
            plugin: Funksie,
            options: {
                cameraSrc: '*'
            }
        }]);

        const res = await server.inject({
            method: 'GET',
            url: '/'
        });

        expect(res.statusCode).to.equal(200);
        expect(res.headers).to.contain('feature-policy');
        expect(res.headers['feature-policy']).to.contain('camera *');
    });

    it('allows setting array directives to an array of strings', async () => {

        const server = Hapi.server();
        server.route(defaultRoute);
        await server.register([Scooter, {
            plugin: Funksie,
            options: {
                cameraSrc: ['*', 'self']
            }
        }]);

        const res = await server.inject({
            method: 'GET',
            url: '/'
        });

        expect(res.statusCode).to.equal(200);
        expect(res.headers).to.contain('feature-policy');
        expect(res.headers['feature-policy']).to.contain('camera * \'self\'');
    });

    it('skips headers on OPTIONS requests', async () => {

        const server = Hapi.server();
        const options = {
            cameraSrc: 'none'
        };
        server.route({
            method: 'OPTIONS',
            path: '/',
            handler: () => {

                return '';
            }
        });
        await server.register([Scooter, { plugin: Funksie, options }]);
        const res = await server.inject({
            method: 'OPTIONS',
            url: '/'
        });

        expect(res.statusCode).to.equal(204);
        expect(res.headers).to.not.include('feature-policy');
    });

    it('can be disabled on a single route', async () => {

        const server = Hapi.server();
        server.route(captureRoute);
        server.route({
            method: 'GET',
            path: '/disabled',
            config: {
                handler: () => {

                    return 'disabled';
                },
                plugins: {
                    funksie: false
                }
            }
        });
        await server.register([Scooter, Funksie]);
        const res = await server.inject({
            method: 'GET',
            url: '/capture'
        });

        expect(res.statusCode).to.equal(200);
        expect(res.headers).to.contain('feature-policy');
        expect(res.headers['feature-policy']).to.contain('camera \'self\'');

        const res2 = await server.inject({
            method: 'GET',
            url: '/disabled'
        });

        expect(res2.statusCode).to.equal(200);
        expect(res2.headers).to.not.contain('feature-policy');
    });

    it('can be overridden on a single route', async () => {

        const server = Hapi.server();
        server.route(captureRoute);
        server.route({
            method: 'GET',
            path: '/overridden',
            config: {
                handler: () => {

                    return 'overridden';
                },
                plugins: {
                    funksie: {
                        batterySrc: 'www.google.com'
                    }
                }
            }
        });
        await server.register([Scooter, Funksie]);
        const res = await server.inject({
            method: 'GET',
            url: '/capture'
        });

        expect(res.statusCode).to.equal(200);
        expect(res.headers).to.contain('feature-policy');
        expect(res.headers['feature-policy']).to.contain('camera \'self\'');

        const res2 = await server.inject({
            method: 'GET',
            url: '/overridden'
        });

        expect(res2.statusCode).to.equal(200);
        expect(res2.headers).to.contain('feature-policy');
        expect(res2.headers['feature-policy']).to.contain('battery www.google.com');
    });
});
