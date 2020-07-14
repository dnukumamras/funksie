'use strict';

const Joi = require('@hapi/joi');

module.exports = Joi.object({
    accelerometerSrc: Joi.array().items(Joi.string()).single().default(['none']),
    ambientLightSensorSrc: Joi.array().items(Joi.string()).single(),
    autoplaySrc: Joi.array().items(Joi.string()).single(),
    batterySrc: Joi.array().items(Joi.string()).single().default(['none']),
    cameraSrc: Joi.array().items(Joi.string()).single().default(['none']),
    displayCaptureSrc: Joi.array().items(Joi.string()).single(),
    documentDomainSrc: Joi.array().items(Joi.string()).single(),
    encryptedMediaSrc: Joi.array().items(Joi.string()).single(),
    fullscreenSrc: Joi.array().items(Joi.string()).single(),
    geolocationSrc: Joi.array().items(Joi.string()).single().default(['none']),
    gyroscopeSrc: Joi.array().items(Joi.string()).single().default(['none']),
    layoutAnimationsSrc: Joi.array().items(Joi.string()).single(),
    legacyImageFormatsSrc: Joi.array().items(Joi.string()).single(),
    magnetometerSrc: Joi.array().items(Joi.string()).single().default(['none']),
    microphoneSrc: Joi.array().items(Joi.string()).single().default(['none']),
    midiSrc: Joi.array().items(Joi.string()).single(),
    oversizedImagesSrc: Joi.array().items(Joi.string()).single(),
    paymentSrc: Joi.array().items(Joi.string()).single().default(['none']),
    pictureInPictureSrc: Joi.array().items(Joi.string()).single(),
    publickeyCredentialsGetSrc: Joi.array().items(Joi.string()).single(),
    syncXhrSrc: Joi.array().items(Joi.string()).single(),
    usbSrc: Joi.array().items(Joi.string()).single(),
    vrSrc: Joi.array().items(Joi.string()).single(),
    wakeLockSrc: Joi.array().items(Joi.string()).single(),
    xrSpatialTrackingSrc: Joi.array().items(Joi.string()).single(),
    reportUri: Joi.string()
});
