try {
    new Function('async function anon() {return \'async func\'}'); //Async function
    new Function('() => {}'); //Arrow function
    new Function('(a = 0) => a'); //Default parameter
    if ((typeof fetch) === 'undefined') { // noinspection ExceptionCaughtLocallyJS
        throw 'No fetch API';
    }
} catch (err) {

    // Redirect if bad browser (IE) or not EMCAScript6 compliant
    location = 'https://itty.bitty.site/#Vault_Notice/?XQAAAAIpAQAAAAAAAAAeGQknmB2F1uoOy18OxGndvhm0KFwsc/oUtjUM5MublVl5JrHNkwo3X1OChSmieYCAPsGbHd22OT7kHDiLsVtQFgc35hky30XQeAE8sGEXjS6U/eUs5BaYlTHnUxJ5BfCCIIwcsY9ahZrtNWPvJAhtrt8HNavnZM1RGbLr3BWRE3CRYZV9KWuk06xRyTOwbFfPh5hR5s3xNXrIrjDoUz5HvCSGngj18BbvlmdOI9wP62/k8sniq7P/VIe0AA==';
}
document.getElementById('browser-checker').remove();