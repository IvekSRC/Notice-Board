const { Leopard } = require('@picovoice/leopard-node');
const { ACCESS_KEY } = require("../../config");

var transcript = (audioName) => {
    const handle = new Leopard(ACCESS_KEY);
    const transcriptedSpeech = handle.processFile("C:/Users/ncoded/Desktop/Diplomski/Notice-Board/public/audios/" + audioName);
    return transcriptedSpeech;
}

module.exports = {
    transcript
}