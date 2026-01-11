const contentDisplay = document.getElementById('content-display');
const statusDiv = document.getElementById('app-status');
const activateBtn = document.getElementById('activate-btn');
const chatHistory = document.getElementById('chat-history');

// Settings Modal
const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const closeModal = document.getElementById('close-modal');
const saveSettings = document.getElementById('save-settings');
const apiKeyInput = document.getElementById('api-key-input');
const voiceSelect = document.getElementById('voice-select');
const modeWebSpeech = document.getElementById('mode-webspeech');
const modeOpenAI = document.getElementById('mode-openai');
const apiKeyGroup = document.getElementById('api-key-group');
const voiceSelectGroup = document.getElementById('voice-select-group');

// Configuration
let useOpenAI = false;
let openaiApiKey = localStorage.getItem('openai_api_key') || '';
let selectedVoice = localStorage.getItem('tts_voice') || 'nova';
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

// Load saved settings
if (openaiApiKey) {
    apiKeyInput.value = openaiApiKey;
    useOpenAI = true;
    modeOpenAI.classList.add('active');
    modeWebSpeech.classList.remove('active');
}
voiceSelect.value = selectedVoice;

// Toggle API key visibility
function updateAPIFieldVisibility() {
    if (useOpenAI) {
        apiKeyGroup.style.display = 'block';
        voiceSelectGroup.style.display = 'block';
    } else {
        apiKeyGroup.style.display = 'none';
        voiceSelectGroup.style.display = 'none';
    }
}

modeWebSpeech.onclick = () => {
    useOpenAI = false;
    modeWebSpeech.classList.add('active');
    modeOpenAI.classList.remove('active');
    updateAPIFieldVisibility();
};

modeOpenAI.onclick = () => {
    useOpenAI = true;
    modeOpenAI.classList.add('active');
    modeWebSpeech.classList.remove('active');
    updateAPIFieldVisibility();
};

settingsBtn.onclick = () => {
    settingsModal.classList.remove('hidden');
    updateAPIFieldVisibility();
};

closeModal.onclick = () => settingsModal.classList.add('hidden');

saveSettings.onclick = () => {
    if (useOpenAI) {
        openaiApiKey = apiKeyInput.value.trim();
        if (!openaiApiKey) {
            alert('Veuillez entrer une clé API OpenAI valide.');
            return;
        }
        localStorage.setItem('openai_api_key', openaiApiKey);
    }
    selectedVoice = voiceSelect.value;
    localStorage.setItem('tts_voice', selectedVoice);
    settingsModal.classList.add('hidden');
    updateStatus(`Configuration sauvegardée (${useOpenAI ? 'OpenAI' : 'Web Speech'})`);
};

// Mode Management
let appMode = 'reader';
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

async function speakSentence(index) {
    if (index >= sentences.length) {
        isReading = false;
        updateStatus("Lecture terminée.");
        return;
    }

    currentSentenceIndex = index;
    highlightSentence(index);
    isReading = true;
    updateStatus("Lecture en cours...");

    await speakText(sentences[index]);

    if (isReading) {
        currentSentenceIndex++;
        speakSentence(currentSentenceIndex);
    }
}

function stopReading() {
    isReading = false;
    if (useOpenAI) {
        // Stop any playing audio
        const audio = document.querySelector('audio');
        if (audio) audio.pause();
    } else {
        window.speechSynthesis.cancel();
    }
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

async function handleAssistantInput(text) {
    addChatMessage(text, 'user');
    const response = getAssistantResponse(text);
    setTimeout(async () => {
        addChatMessage(response, 'assistant');
        await speakText(response);
    }, 500);
}

// OpenAI Whisper STT
async function transcribeAudio(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'fr');

    try {
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: formData
        });

        const data = await response.json();
        return data.text || '';
    } catch (error) {
        console.error('Whisper error:', error);
        return '';
    }
}

// OpenAI TTS
async function speakWithOpenAI(text) {
    try {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'tts-1',
                voice: selectedVoice,
                input: text
            })
        });

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        return new Promise((resolve) => {
            audio.onended = resolve;
            audio.play();
        });
    } catch (error) {
        console.error('TTS error:', error);
    }
}

// Unified speak function
async function speakText(text) {
    if (useOpenAI && openaiApiKey) {
        await speakWithOpenAI(text);
    } else {
        // Fallback to Web Speech
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            utterance.onend = resolve;
            window.speechSynthesis.speak(utterance);
        });
    }
}

// Voice Recognition
function initVoiceControl() {
    if (useOpenAI && openaiApiKey) {
        initWhisperRecognition();
    } else {
        initWebSpeechRecognition();
    }
    updateStatus("Commandes vocales actives.");
    activateBtn.style.display = 'none';
}

// Web Speech Recognition (fallback)
function initWebSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = true;

    recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.trim().toLowerCase();
        handleVoiceCommand(command);
    };

    recognition.onend = () => {
        try { recognition.start(); } catch (e) { }
    };

    recognition.start();
}

// Whisper-based Recognition
function initWhisperRecognition() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                audioChunks = [];

                const text = await transcribeAudio(audioBlob);
                if (text) {
                    console.log('Whisper:', text);
                    handleVoiceCommand(text.toLowerCase());
                }

                // Restart recording
                if (isRecording) {
                    audioChunks = [];
                    mediaRecorder.start();
                    setTimeout(() => {
                        if (mediaRecorder.state === 'recording') {
                            mediaRecorder.stop();
                        }
                    }, 3000); // Record 3s chunks
                }
            };

            isRecording = true;
            mediaRecorder.start();
            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }, 3000);
        })
        .catch(err => {
            console.error('Microphone error:', err);
            alert('Impossible d\'accéder au microphone.');
        });
}

function handleVoiceCommand(command) {
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
        if (command.includes('lecteur') || command.includes('mode lecture')) {
            switchMode('reader');
        } else {
            handleAssistantInput(command);
        }
    }
}

function updateStatus(msg) {
    statusDiv.textContent = msg;
    statusDiv.className = "status-indicator " + (msg.includes("cours") || msg.includes("activ") ? "status-active" : "");
}

initDisplay();
activateBtn.onclick = initVoiceControl;
