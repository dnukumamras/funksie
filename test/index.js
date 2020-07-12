'use strict';

const Funksie = require('../');
const Hapi = require('@hapi/hapi');
const Scooter = require('@hapi/scooter');

const { expect } = require('@hapi/code');

const { describe, it } = exports.lab = require('@hapi/lab').script();

describe('Funksie', () => {

    it('loads as a plugin', async () => {

        const server = Hapi.server();
        await server.register([Scooter, Funksie]);
    });
    it('errors with invalid options', async () => {

        const server = Hapi.server();
        await expect(server.register([Scooter, {
            plugin: Funksie,
            options: {
                reportUri: true
            }
        }])).to.reject(Error, '"reportUri" must be a string');
    });
});
