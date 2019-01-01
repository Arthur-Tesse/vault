import TaggedObjectType from './tagged-object-type.js';

function objectTypeTransformer(typeString) {

    switch (typeString.toUpperCase()) {
        case 'ANIME':
            return TaggedObjectType.ANIME;
        case 'GAME':
            return TaggedObjectType.GAME;
        case 'POST':
            return TaggedObjectType.POST;
        default:
            throw 'Unknown tagged object type: ' + typeString;
    }
}

function valueOrNA(value) {

    return value === undefined || value == null
        ? 'N/A'
        : value;
}

function exceptionReasonToMessage(reason) {

    switch (valueOrNA(reason).toUpperCase()) {

        case 'DB_CONNECTION_ERROR':
            return 'MongoDB connection error (maybe timeout or down)';
        case 'NO_RESULTS':
            return 'No results were returned';
        default:
            return 'Unknown error';
    }
}

export default {

    transformType: objectTypeTransformer,
    transformExceptionMessage: exceptionReasonToMessage,
};