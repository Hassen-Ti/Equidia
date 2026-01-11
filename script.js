const contentDisplay = document.getElementById('content-display');
const statusDiv = document.getElementById('app-status');
const activateBtn = document.getElementById('activate-btn');
const chatHistory = document.getElementById('chat-history');

// Mode Management
let appMode = 'reader'; // 'reader' or 'assistant'
const readerView = document.getElementById('reader-view');
const assistantView = document.getElementById('assistant-view');
const readerCmds = document.getElementById('reader-commands');
const assistantCmds = document.getElementById('assistant-commands');
const modeReaderBtn = document.getElementById('mode-reader-btn');
const modeAssistantBtn = document.getElementById('mode-assistant-btn');

function switchMode(newMode) {
    appMode = newMode;
    if (newMode === 'reader') {
        readerView.classList.remove('hidden');
        assistantView.classList.add('hidden');
        readerCmds.classList.remove('hidden');
        assistantCmds.classList.add('hidden');
        modeReaderBtn.classList.add('active');
        modeAssistantBtn.classList.remove('active');
        stopReading();
        updateStatus("Mode Lecteur activé.");
    } else {
        readerView.classList.add('hidden');
        assistantView.classList.remove('hidden');
        readerCmds.classList.add('hidden');
        assistantCmds.classList.remove('hidden');
        modeReaderBtn.classList.remove('active');
        modeAssistantBtn.classList.add('active');
        stopReading();
        updateStatus("Mode Assistant activé.");
    }
}

modeReaderBtn.onclick = () => switchMode('reader');
modeAssistantBtn.onclick = () => switchMode('assistant');

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

// Reader Logic
const sentences = sampleText.split(/[.!?]/).filter(s => s.trim().length > 0).map(s => s.trim());
let currentSentenceIndex = 0;
let isReading = false;
let recognition;
const synth = window.speechSynthesis;

function initDisplay() {
    contentDisplay.innerHTML = '';
    sentences.forEach((text, index) => {
        const span = document.createElement('span');
        span.textContent = text + ". ";
        span.classList.add('sentence');
        span.id = `sentence-${index}`;
        span.onclick = () => {
            if (appMode !== 'reader') switchMode('reader');
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

function speakSentence(index) {
    if (index >= sentences.length) {
        isReading = false;
        updateStatus("Lecture terminée.");
        return;
    }
    synth.cancel();
    currentSentenceIndex = index;
    highlightSentence(index);
    isReading = true;
    updateStatus("Lecture en cours...");

    const utterance = new SpeechSynthesisUtterance(sentences[index]);
    utterance.lang = 'fr-FR';
    utterance.onend = () => {
        if (isReading) {
            currentSentenceIndex++;
            speakSentence(currentSentenceIndex);
        }
    };
    synth.speak(utterance);
}

function stopReading() {
    isReading = false;
    synth.cancel();
    updateStatus("Pause.");
}

// Assistant Logic
function addChatMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.textContent = text;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function getAssistantResponse(input) {
    const lowInput = input.toLowerCase();

    if (lowInput.includes("bonjour") || lowInput.includes("salut")) {
        return "Bonjour ! Comment puis-je vous aider ?";
    }
    if (lowInput.includes("heure")) {
        return `Il est actuellement ${new Date().toLocaleTimeString('fr-FR')}.`;
    }
    if (lowInput.includes("qui es-tu") || lowInput.includes("ton nom")) {
        return "Je suis votre assistant vocal Equidia. Je peux lire du texte ou discuter avec vous.";
    }
    if (lowInput.includes("aide") || lowInput.includes("faire")) {
        return "Je peux lire le texte de gauche, vous donner l'heure, ou simplement discuter. Dites 'Active le lecteur' pour changer de mode.";
    }
    if (lowInput.includes("lecteur") || lowInput.includes("lire")) {
        setTimeout(() => switchMode('reader'), 1000);
        return "Très bien, je passe en mode lecteur.";
    }
    if (lowInput.includes("merci")) {
        return "De rien ! À votre service.";
    }

    return "Désolé, je n'ai pas compris. Pouvez-vous répéter ?";
}

function handleAssistantInput(text) {
    addChatMessage(text, 'user');
    const response = getAssistantResponse(text);
    setTimeout(() => {
        addChatMessage(response, 'assistant');
        speakText(response);
    }, 500);
}

function speakText(text) {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    synth.speak(utterance);
}

// Voice Recognition
function initVoiceControl() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = true;

    recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.trim().toLowerCase();
        console.log("Reconnu:", command);

        if (appMode === 'reader') {
            if (command.includes('stop') || command.includes('pause')) {
                stopReading();
            } else if (command.includes('start') || command.includes('commence')) {
                speakSentence(currentSentenceIndex);
            } else if (command.includes('recommence')) {
                speakSentence(0);
            } else if (command.includes('répète')) {
                let target = currentSentenceIndex - 1;
                speakSentence(target < 0 ? 0 : target);
            } else if (command.includes('assistant')) {
                switchMode('assistant');
            }
        } else {
            // Mode Assistant
            if (command.includes('lecteur') || command.includes('mode lecture')) {
                switchMode('reader');
            } else {
                handleAssistantInput(command);
            }
        }
    };

    recognition.onend = () => {
        if (!synth.speaking) try { recognition.start(); } catch (e) { }
    };

    recognition.start();
    updateStatus("Commandes vocales actives.");
    activateBtn.style.display = 'none';
}

function updateStatus(msg) {
    statusDiv.textContent = msg;
    statusDiv.className = "status-indicator " + (msg.includes("cours") || msg.includes("activ") ? "status-active" : "");
}

initDisplay();
activateBtn.onclick = initVoiceControl;
