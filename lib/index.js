'use strict';

const Schema = require('./schema');
const Hoek = require('@hapi/hoek');

const internals = {};


// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy#Directives
// Directives part Editor's Draft are excluded on purpose

internals.arrayValues = [
    'accelerometerSrc',
    'ambientLightSensorSrc',
    'autoplaySrc',
    'batterySrc',
    'cameraSrc',
    'displayCaptureSrc',
    'documentDomainSrc',
    'encryptedMediaSrc',
    'fullscreenSrc',
    'geolocationSrc',
    'gyroscopeSrc',
    'layoutAnimationsSrc',
    'legacyImageFormatsSrc',
    'magnetometerSrc',
    'microphoneSrc',
    'midiSrc',
    'oversizedImagesSrc',
    'paymentSrc',
    'pictureInPictureSrc',
    'publickeyCredentialsGetSrc',
    'syncXhrSrc',
    'usbSrc',
    'vrSrc',
    'wakeLockSrc',
    'xrSpatialTrackingSrc'
];

internals.stringValues = [
    'reportUri'
];

internals.directiveNames = internals.arrayValues.concat(internals.stringValues);

internals.directiveMap = {
    'accelerometerSrc': 'accelerometer',
    'ambientLightSensorSrc': 'ambient-light-sensor',
    'autoplaySrc': 'autoplay',
    'batterySrc': 'battery',
    'cameraSrc': 'camera',
    'displayCaptureSrc': 'display-capture',
    'documentDomainSrc': 'document-domain',
    'encryptedMediaSrc': 'encrypted-media',
    'fullscreenSrc': 'fullscreen',
    'geolocationSrc': 'geolocation',
    'gyroscopeSrc': 'gyroscope',
    'layoutAnimationsSrc': 'layout-animations',
    'legacyImageFormatsSrc': 'legacy-image-formats',
    'magnetometerSrc': 'magnetometer',
    'microphoneSrc': 'microphone',
    'midiSrc': 'midi',
    'oversizedImagesSrc': 'oversized-images',
    'paymentSrc': 'payment',
    'pictureInPictureSrc': 'picture-in-picture',
    'publickeyCredentialsGetSrc': 'publickey-credentials-get',
    'syncXhrSrc': 'sync-xhr',
    'usbSrc': 'usb',
    'vrSrc': 'vr',
    'wakeLockSrc': 'wake-lock',
    'xrSpatialTrackingSrc': 'xr-spatial-tracking',
    'reportUri': 'report-uri'
};

internals.allHeaders = [
    'Feature-Policy'
];

internals.needQuotes = [
    'self',
    'none',
    'src'
];

internals.generatePolicy = function (options, request) {

    const policy = [];

    // map the camel case names to proper directive names
    // and join their values into strings
    internals.directiveNames.forEach((key) => {

        if (!options[key]) {
            return;
        }

        const directive = internals.directiveMap[key];

        policy.push(`${directive} ${options[key].join(' ')}`);
    });

    return policy.join(';');
};


internals.addHeaders = function (request, h) {

    const contentType = (request.response.headers || request.response.output.headers)['content-type'];

    if (request.method === 'options' ||
        request.route.settings.plugins.funksie === false ||
        (contentType && contentType !== 'text/html')) {

        return h.continue;
    }

    let options;

    if (request.route.settings.plugins.funksie) {
        options = internals.validateOptions(request.route.settings.plugins.funksie);

        if (options instanceof Error) {
            request.server.log(['error', 'funksie'], `Invalid funksie configuration on route: ${request.route.path}`);
            return h.continue;
        }
    }
    else if (internals.fpCallback) {
        options = internals.fpCallback(request);

        options = internals.validateOptions(options);
        if (options instanceof Error) {
            request.server.log(['error', 'funksie'], 'Invalid funksie configuration from FP Callback');
            return h.continue;
        }
    }
    else {
        options = Hoek.clone(internals.options);
    }

    // const userAgent = request.plugins.scooter || {};
    const headerName = 'Feature-Policy';
    const policy = internals.generatePolicy(options, request);


    if (!request.response.isBoom) {
        request.response.headers[headerName] = policy;
    }
    else {
        request.response.output.headers[headerName] = policy;
    }

    return h.continue;
};


internals.validateOptions = function (options) {

    const { error, value } = Schema.validate(options);

    if (error) {
        return error;
    }

    internals.arrayValues.forEach((key) => {

        if (value[key] !== undefined) {

            value[key] = value[key].map((val) => {

                if (internals.needQuotes.indexOf(val) !== -1) {
                    return `'${val}'`;
                }

                return val;
            });
        }
    });

    return value;
};

exports.plugin = {
    register: function (server, options) {

        internals.fpCallback = null;

        if (typeof options === 'function') {
            internals.fpCallback = options;
        }
        else {
            internals.options = internals.validateOptions(options);
            if (internals.options instanceof Error) {
                throw internals.options;
            }
        }

        server.ext('onPreResponse', internals.addHeaders);
    },
    dependencies: ['@hapi/scooter'],
    once: true,
    pkg: require('../package.json')
};
