import transition from '/assets/js/third-party/transitionjs/transition.js';

function removeOverlay() {

    transition.begin(document.getElementsByClassName('wait-overlay')[0], {
        property: 'opacity',
        from: '1',
        to: '0',
        duration: '350ms',
        timingFunction: 'ease-in-out',
        onTransitionEnd: function (_, finished) {

            if (!finished) return;

            document.getElementById('overlay-style')
                .remove();
            document.getElementsByClassName('wait-overlay')[0]
                .remove();
        }
    });
}

function addOnLoadRemove() {

    addEventListener('load', removeOverlay());
}

export default {

    addLoadedEventListener: addOnLoadRemove,
    removeOverlay: removeOverlay
};