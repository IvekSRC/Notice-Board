const { Leopard } = require('@picovoice/leopard-node');
const { ACCESS_KEY, AUDIO_PATH } = require("../../config");

var transcript = (audioName) => {
    const handle = new Leopard(ACCESS_KEY);
    const transcriptedSpeech = handle.processFile(AUDIO_PATH + audioName);
    return transcriptedSpeech;
}

module.exports = {
    transcript
}