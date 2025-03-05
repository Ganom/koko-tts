let currentlyPlaying = null;

/**
 * Checks if a file exists at the given URL
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Whether the file exists
 */
async function fileExists(url) {
    try {
        const response = await fetch(url, {method: 'HEAD'});
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Sets up audio players for all play buttons
 */
export function setupAudioPlayers() {
    document.querySelectorAll('.play-button').forEach(async button => {
        const voiceName = button.dataset.voice;
        const audioPath = `audio/${voiceName}.mp3`;
        const audio = new Audio(audioPath);
        audio.volume = 0.5;

        const exists = await fileExists(audioPath);
        if (!exists) {
            console.error(`Missing audio file: ${audioPath}`);
            disableButton(button, 'Audio file not available');
            return;
        }

        button.addEventListener('click', () => {
            handlePlayButtonClick(button, audio, voiceName);
        });

        audio.addEventListener('ended', () => {
            button.classList.remove('playing');
            currentlyPlaying = null;
        });

        audio.addEventListener('error', (e) => {
            console.error(`Error loading audio file ${audioPath}:`, e.target.error);
            disableButton(button, 'Error loading audio file');
        });
    });
}

/**
 * Handles play button click events
 * @param {HTMLElement} button - The clicked button
 * @param {HTMLAudioElement} audio - The audio element
 * @param {string} voiceName - The voice name
 */
function handlePlayButtonClick(button, audio, voiceName) {
    if (currentlyPlaying && currentlyPlaying !== audio) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
        document.querySelector(`.play-button[data-voice="${currentlyPlaying.src.split('/').pop().split('.')[0]}"]`)
            ?.classList.remove('playing');
    }

    if (audio.paused) {
        audio.play().catch(error => {
            console.error(`Error playing ${voiceName}:`, error);
        });
        button.classList.add('playing');
        currentlyPlaying = audio;
    } else {
        audio.pause();
        audio.currentTime = 0;
        button.classList.remove('playing');
        currentlyPlaying = null;
    }
}

/**
 * Disables a button with visual indication
 * @param {HTMLElement} button - The button to disable
 * @param {string} reason - The reason for disabling
 */
function disableButton(button, reason) {
    button.disabled = true;
    button.style.backgroundColor = '#666';
    button.title = reason;
}
