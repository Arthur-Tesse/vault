const removeFromDOM = element => element.parentElement.removeChild(element);

const removeTagsRelated = () => {

    removeFromDOM(document.getElementById('tags'));
    removeFromDOM(document.getElementById('tags_header'));
};

const removeMetadataRelated = () => {

    removeFromDOM(document.getElementById('metadata'));
    removeFromDOM(document.getElementById('metadata_header'));
};

const removeContentDiv = () => removeFromDOM(document.getElementById('content'));

export default {

    removeTagsRelated: removeTagsRelated,
    removeMetadataRelated: removeMetadataRelated,
    removeContentDiv: removeContentDiv
};