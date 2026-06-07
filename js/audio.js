// Motor de Audio de la Plataforma Matemática (procedural)
const MathAudio = {
ctx: null,

initContext() {
    if (!this.ctx) {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
    this.ctx.resume();
    }
},

playWelcome() {
    this.initContext();
    const t = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, i) => {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0, t + i * 0.12);
    gain.gain.linearRampToValueAtTime(0.2, t + i * 0.12 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.4);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t + i * 0.12);
    osc.stop(t + i * 0.12 + 0.4);
    });
},

playCorrect() {
    this.initContext();
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0, t + i * 0.06);
    gain.gain.linearRampToValueAtTime(0.25, t + i * 0.06 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.35);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t + i * 0.06);
    osc.stop(t + i * 0.06 + 0.35);
    });
},

playIncorrect() {
    this.initContext();
    const t = this.ctx.currentTime;
    // Tono grave descendente tipo zumbido
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.3);
    
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
},

playClick() {
    this.initContext();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(1000, t + 0.05);
    
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
},

playWin() {
    this.initContext();
    const t = this.ctx.currentTime;
    // Fanfarria triunfal alegre
    const progression = [
    { f: [261.63, 329.63, 392.00], d: 0.15 }, // C4 chord
    { f: [293.66, 349.23, 440.00], d: 0.15 }, // Dm4 chord
    { f: [329.63, 392.00, 523.25], d: 0.30 }, // C5 chord
    { f: [349.23, 440.00, 587.33], d: 0.20 }, // F5 chord
    { f: [392.00, 493.88, 587.33, 783.99], d: 0.60 } // G7/C6 chord
    ];
    
    let timeOffset = 0;
    progression.forEach((chord) => {
    chord.f.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, t + timeOffset);
        gain.gain.linearRampToValueAtTime(0.15, t + timeOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + timeOffset + chord.d - 0.02);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + timeOffset);
        osc.stop(t + timeOffset + chord.d);
    });
    timeOffset += chord.d + 0.03;
    });
},

// TTS: Síntesis de voz en español
currentUtterance: null,

speak(text, buttonElement = null) {
    if (!('speechSynthesis' in window)) {
    console.warn("Este navegador no soporta Síntesis de Voz.");
    return;
    }

    // Cancelar cualquier lectura en curso
    window.speechSynthesis.cancel();
    if (this.currentUtterance) {
    this.currentUtterance = null;
    }
    
    // Quitar estados animados de otros botones de parlante
    document.querySelectorAll('.tts-button').forEach(btn => btn.classList.remove('playing'));

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    
    // Configurar idioma español
    utterance.lang = 'es-ES';
    
    // Intentar buscar una voz en español chileno o general
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(voice => voice.lang.includes('es-CL') || voice.lang.includes('es-ES') || voice.lang.includes('es-'));
    if (esVoice) {
    utterance.voice = esVoice;
    }
    
    utterance.rate = 1.0;  // velocidad normal tirando a infantil, pausada
    utterance.pitch = 1.25; // tono ligeramente agudo e infantil

    if (buttonElement) {
    buttonElement.classList.add('playing');
    }

    utterance.onend = () => {
    if (buttonElement) {
        buttonElement.classList.remove('playing');
    }
    this.currentUtterance = null;
    };

    utterance.onerror = (e) => {
    console.error("Error en lectura TTS:", e);
    if (buttonElement) {
        buttonElement.classList.remove('playing');
    }
    this.currentUtterance = null;
    };

    window.speechSynthesis.speak(utterance);
},

stopSpeaking() {
    if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    }
    document.querySelectorAll('.tts-button').forEach(btn => btn.classList.remove('playing'));
}
};

// Cargar voces en segundo plano (para navegadores como Chrome que las cargan asíncronamente)
if ('speechSynthesis' in window) {
window.speechSynthesis.onvoiceschanged = () => {
    // Solo inicializar voces
    window.speechSynthesis.getVoices();
};
}