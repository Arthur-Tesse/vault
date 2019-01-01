let getLatestObjects = () => fetch('/api/object/latest')
    .then(response => response.json());

let getObjects = () => fetch('/api/object/all')
    .then(response => response.json());

let getObject = (uuid) => fetch(`/api/object/${uuid}`)
    .then(response => response.json());

let searchObjects = (query, offset = 0) => fetch(`/api/object/all?query=${query}&offset=${offset}`)
    .then(response => response.json());

export default {

    getLatestObjects: getLatestObjects,
    getObject: getObject,
    getAllObjects: getObjects,
    searchObjects: searchObjects
};