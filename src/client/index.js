const InfinityArcade = require('./app');
InfinityArcade.initialize().then(ia => {
    window.ia = ia;
    ia.sendEvent("ia-loaded");
});