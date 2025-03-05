import {renderVoiceList} from './voice-list.js';
import {setupAudioPlayers} from './audio-player.js';

async function init() {
    try {
        const response = await fetch('./js/voices.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const voices = await response.json();
        renderVoiceList(voices);
        setupAudioPlayers();
    } catch (error) {
        console.error('Failed to load voices data:', error);
        document.getElementById('voice-list').innerHTML =
            '<div class="info-box">Error loading voice data. Please try refreshing the page.</div>';
    }
}

document.addEventListener('DOMContentLoaded', init);
