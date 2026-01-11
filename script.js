const contentDisplay = document.getElementById('content-display');
const statusDiv = document.getElementById('app-status');
const activateBtn = document.getElementById('activate-btn');

const sampleText = `
Bienvenue dans cette démonstration de lecture vocale intelligente. 
Ceci est une application web expérimentale conçue pour tester les interactions vocales avancées.
Vous pouvez contrôler la lecture simplement en parlant. 
Si vous dites "Stop" ou "Pause", je m'arrêterai immédiatement.
Si vous dites "Start", je reprendrai là où je m'étais arrêté.
La commande "Recommence" permet de relire le texte depuis le tout début.
Et enfin, la commande "Répète" me fera relire la phrase précédente, idéale si vous avez manqué une information.
Nous espérons que cette expérience vous plaira.
Essayez de me donner un ordre maintenant.
`;

// Logic: Split text into sentences for easier navigation
const sentences = sampleText.split(/[.!?]/).filter(s => s.trim().length > 0).map(s => s.trim());
let currentSentenceIndex = 0;
let isReading = false;
let recognition;
const synth = window.speechSynthesis;

// Init Display
function initDisplay() {
    contentDisplay.innerHTML = '';
    sentences.forEach((text, index) => {
        const span = document.createElement('span');
        span.textContent = text + ". ";
        span.classList.add('sentence');
        span.id = `sentence-${index}`;
        span.onclick = () => {
            currentSentenceIndex = index;
            highlightSentence(index);
            speakSentence(index);
        };
        contentDisplay.appendChild(span);
    });
}

function highlightSentence(index) {
    document.querySelectorAll('.sentence').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(`sentence-${index}`);
    if (el) {
        el.classList.add('active');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Speech Synthesis
function speakSentence(index) {
    if (index >= sentences.length) {
        isReading = false;
        updateStatus("Lecture terminée.");
        return;
    }

    // Cancel current speech if any
    synth.cancel();

    currentSentenceIndex = index;
    highlightSentence(index);
    isReading = true;
    updateStatus("Lecture en cours...");

    const utterance = new SpeechSynthesisUtterance(sentences[index]);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;

    utterance.onend = () => {
        if (isReading) { // If not paused manually
            // Move to next sentence
            currentSentenceIndex++;
            speakSentence(currentSentenceIndex);
        }
    };

    utterance.onerror = (e) => {
        console.error("Erreur synthèse", e);
        isReading = false;
    };

    synth.speak(utterance);
}

function stopReading() {
    isReading = false;
    synth.cancel();
    updateStatus("Pause. Dites 'Start' pour reprendre.");
}

// Command Recognition
function initVoiceControl() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = false;
    // maxAlternatives 1 helps speed

    recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.trim().toLowerCase();
        console.log("Commande reçue:", command);

        // Simple fuzzy matching
        if (command.includes('stop') || command.includes('pause') || command.includes('arrête')) {
            stopReading();
        } else if (command.includes('start') || command.includes('commence') || command.includes('continue')) {
            if (!isReading) speakSentence(currentSentenceIndex);
        } else if (command.includes('recommence') || command.includes('début')) {
            currentSentenceIndex = 0;
            speakSentence(0);
        } else if (command.includes('répète') || command.includes('arrière') || command.includes('repas')) {
            // Rewind 1 sentence (approx 10s logic)
            // If currently reading, we want to go back to PREVIOUS one.
            // Current index is the one BEING read. So index - 1.
            let target = currentSentenceIndex - 1;
            if (target < 0) target = 0;
            speakSentence(target);
        }
    };

    recognition.onend = () => {
        // Always restart recognition to keep listening for commands
        console.log("Recognition ended, restarting...");
        try {
            recognition.start();
        } catch (e) { /* ignore if already started */ }
    };

    recognition.onerror = (e) => {
        console.warn("Recognition error", e.error);
    };

    try {
        recognition.start();
        updateStatus("Écoute des commandes activée.");
        activateBtn.style.display = 'none'; // Hide button once active
    } catch (e) {
        console.error(e);
    }
}

function updateStatus(msg) {
    statusDiv.textContent = msg;
    if (msg.includes("Lecture")) {
        statusDiv.className = "status-indicator status-active";
    } else {
        statusDiv.className = "status-indicator";
    }
}

// Initial Setup
initDisplay();

activateBtn.addEventListener('click', () => {
    initVoiceControl();
    // Auto-start reading? Optional. Let's wait for "Start" command or user click on text.
    // Better UX: Just activate mic.
});
