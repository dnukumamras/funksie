## Funksie

A Feature Policy plugin for [hapi](https://github.com/hapijs/hapi).

## Why the Name Funksie?

In Afrikaans the word Funksie means feature and it sounds similar to [blankie](https://github.com/nlf/blankie) a repo from which a lot of the code was taken

## What is Feature Policy?

Feature policy is a HTTP response [header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy) that when set allows you to control which origins can use which features, both in the top-level page and in embedded frames.

Feature Policy provides a mechanism to explicitly declare what functionality is used (or not used), throughout your website. With Feature Policy, you opt-in to a set of "policies" for the browser to enforce on specific features used throughout a website. These policies restrict what APIs the site can access or modify the browser's default behavior for certain features.

Examples of what you can do with Feature Policy:

- Change the default behavior of autoplay on mobile and third party videos.
- Restrict a site from using sensitive APIs like magnetometer or microphone.
- Controls whether the current document is allowed to use the Payment Request API. All our products and services at Credit Karma is free so we can set this to block

Here's a [link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy#Directives) to the complete list.

### Usage

This plugin depends on [scooter](https://github.com/hapijs/scooter) to function.

To use it:

```javascript
'use strict';

const Hapi = require('@hapi/hapi');
const Funksie = require('funksie');
const Scooter = require('@hapi/scooter');

const internals = {};

const server = Hapi.server();

internals.init = async () => {

    await server.register([Scooter, {
        plugin: Funksie,
        options: {} // specify options here
    }]);

    await server.start();
};

internals.init().catch((err) => {

    throw err;
});
```

Options may also be set on a per-route basis:

```javascript
'use strict';

const Hapi = require('@hapi/hapi');
const Funksie = require('funksie');
const Scooter = require('@hapi/scooter');

const server = Hapi.server();

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
```

Note that this setting will *NOT* be merged with your server-wide settings.

You may also set `config.plugins.funksie` equal to `false` on a route to disable Feature-Policy headers completely for that route.

### Options

* `accelerometerSrc`: Values for the `accelerometer` directive. Defaults to 'none'.
* `ambientLightSensorSrc`: Values for the `ambient-light-sensor` directive.
* `autoplaySrc`: Values for the `autoplay` directive.
* `batterySrc`: Values for the `battery` directive. Defaults to 'none'.
* `cameraSrc`: Values for the `camera` directive. Defaults to 'none'.
* `displayCaptureSrc`: Values for the `display-capture` directive.
* `documentDomainSrc`: Values for the `document-domain` directive.
* `encryptedMediaSrc`: Values for the `encrypted-media` directive.
* `fullscreenSrc`: Values for the `fullscreen` directive.
* `geolocationSrc`: Values for the `geolocation` directive. Defaults to 'none'.
* `gyroscopeSrc`: Values for the `gyroscope` directive. Defaults to 'none'.
* `layoutAnimationsSrc`: Values for the `layout-animations` directive.
* `legacyImageFormatsSrc`: Values for the `legacy-image-formats` directive.
* `magnetometerSrc`: Values for the `magnetometer` directive. Defaults to 'none'.
* `microphoneSrc`: Values for the `microphone` directive. Defaults to 'none'.
* `midiSrc`: Values for the `midi` directive.
* `oversizedImagesSrc`: Values for the `oversized-images` directive.
* `paymentSrc`: Values for the `payment` directive. Defaults to 'none'.
* `pictureInPictureSrc`: Values for the `picture-in-picture` directive.
* `publickeyCredentialsGetSrc`: Values for the `publickey-credentials-get` directive.
* `syncXhrSrc`: Values for the `sync-xhr` directive.
* `usbSrc`: 'Values for the `usb` directive.
* `vrSrc`: Values for the `vr` directive.
* `wakeLockSrc`: Values for the `wake-lock` directive.
* `xrSpatialTrackingSrc`: Values for the `xr-spatial-tracking` directive.
* `reportUri`: Value for the `report-uri` directive. This should be the path to a route that accepts Feature-Policy violation reports.
