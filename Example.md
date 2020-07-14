### Example of a Hapi app using the Funksie plugin

This example depends on [scooter](https://github.com/hapijs/scooter) and [funksie](https://github.com/dnukumamras/funksie) to function.

```javascript
'use strict';

const Hapi = require('@hapi/hapi');
const Scooter = require('@hapi/scooter');
const Funksie = require('funksie');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register([Scooter, {
        plugin: Funksie,
        options: {} // specify options here
    }]);

    // This endpoint gets the default configuration for funksie
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World!';
        }
     });

    // This endpoint has a route specific configuration where autoplay: 'www.example.com'
    server.route({
    method: 'GET',
    path: '/something',
    config: {
        handler: (request, h) => {

            return h.response('these settings are changed').header('X-Custom', 'some-value');
        },
        plugins: {
            funksie: {
                autoplaySrc: 'www.example.com'
                }
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
```
