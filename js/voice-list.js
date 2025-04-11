/**
 * Renders the voice list from the provided voices data
 * @param {Object} voices - The voices data object
 */
export function renderVoiceList(voices) {
    const voiceList = document.getElementById('voice-list');
    voiceList.innerHTML = '';

    const groupedVoices = {};
    const premiumVoices = [];

    Object.entries(voices).forEach(([name, data]) => {
        const cost = data.cost;
        if (cost >= 1000) {
            premiumVoices.push({name, ...data});
        } else {
            if (!groupedVoices[cost]) groupedVoices[cost] = [];
            groupedVoices[cost].push({name, ...data});
        }
    });

    premiumVoices.sort((a, b) => b.cost - a.cost);

    if (premiumVoices.length > 0) {
        renderVoiceSection('Premium Voices', premiumVoices, voiceList);
    }

    Object.keys(groupedVoices)
        .sort((a, b) => parseInt(a) + parseInt(b))
        .forEach(cost => {
            let sortedVoices = groupedVoices[cost];
            sortedVoices.sort((a, b) => a.name.localeCompare(b.name))
            renderVoiceSection(`${cost} Bits`, sortedVoices, voiceList);
        });
}

/**
 * Renders a section of voices with expandable/collapsible header
 * @param {string} title - The section title
 * @param {Array} voices - The array of voice objects for this section
 * @param {HTMLElement} container - The container to append to
 */
function renderVoiceSection(title, voices, container) {
    const section = document.createElement('div');
    section.className = 'voice-section';

    const header = document.createElement('button');
    header.className = 'bit-tier-header';
    header.innerHTML = `${title} <span class="chevron">▼</span>`;

    const content = document.createElement('div');
    content.className = 'voice-list';

    voices.forEach(voice => {
        const voiceItem = document.createElement('div');
        voiceItem.className = 'voice-item';

        let tierBadge = '';
        if (voice.cost <= 500) {
            tierBadge = '<div class="tier-badge">T1 Resub</div>';
        } else if (voice.cost <= 1000) {
            tierBadge = '<div class="tier-badge">T2 Resub</div>';
        } else if (voice.cost <= 2500) {
            tierBadge = '<div class="tier-badge">T3 Resub</div>';
        }

        voiceItem.innerHTML = `
            <img src="icons/${voice.name.toLowerCase()}.webp" alt="${voice.name} icon" class="voice-icon">
            ${tierBadge}
            <div class="bit-cost">${voice.cost} Bits</div>
            <h2>${voice.name}</h2>
            <button class="play-button" data-voice="${voice.name.toLowerCase()}"></button>
            <p>[${voice.name.toLowerCase()}] ${voice.text}</p>
        `;
        content.appendChild(voiceItem);
    });

    header.addEventListener('click', () => {
        content.classList.toggle('collapsed');
        header.querySelector('.chevron').style.transform =
            content.classList.contains('collapsed') ? 'rotate(-90deg)' : 'rotate(0deg)';
    });

    section.appendChild(header);
    section.appendChild(content);
    container.appendChild(section);
}
