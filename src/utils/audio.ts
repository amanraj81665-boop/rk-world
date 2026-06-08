let audioCtx: AudioContext | null = null;
let isUnlocked = false;

export const unlockAudio = () => {
  if (isUnlocked) return;
  
  try {
    // Unlock Web Audio
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass && !audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Unlock SpeechSynthesis
    const msg = new SpeechSynthesisUtterance('');
    msg.volume = 0;
    window.speechSynthesis.speak(msg);

    isUnlocked = true;
  } catch (e) {
    console.error("Audio unlock failed", e);
  }
};

export const playCinematicGreeting = () => {
  try {
    // 1. Synthesize Cinematic Sub-Bass Drop (Web Audio API)
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    
    if (audioCtx) {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine'; // Deep, clean bass
      
      // Frequency drop: Sweep from 150Hz down to 30Hz
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 1.5);
      
      // Volume fade out for 3 seconds
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 3);
    }
  } catch (e) {
    console.error("Audio Context failed", e);
  }

  // 2. Play Speech Greeting with a slight delay so it overlaps the bass drop
  setTimeout(() => {
    const msg = new SpeechSynthesisUtterance("Welcome to R K World. R K World mein aapka swagat hai.");
    msg.lang = 'hi-IN';
    msg.rate = 0.85; // Slightly slow and clear
    msg.pitch = 0.8; // Lower pitch for maturity, but not too low to distort
    msg.volume = 1.0;
    
    // Try to grab the premium Google Hindi voice
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const premiumVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('hi')) || 
                           voices.find(v => v.lang === 'hi-IN');
      if (premiumVoice) {
        msg.voice = premiumVoice;
      }
      window.speechSynthesis.speak(msg);
    };

    // Browsers load voices asynchronously
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    }
  }, 600); // 600ms delay after the "Bhaammm" starts
};
