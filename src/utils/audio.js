export function createSfx() {
  let context = null;

  function ensureContext() {
    if (!context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      context = new AudioContextClass();
    }
    return context;
  }

  function tone({ frequency = 440, duration = 0.08, type = 'sine', gain = 0.04 }) {
    const audioContext = ensureContext();
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    volume.gain.value = gain;
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  return {
    click() {
      tone({ frequency: 620, duration: 0.05, type: 'square', gain: 0.02 });
    },
    win() {
      tone({ frequency: 523.25, duration: 0.07, type: 'sine', gain: 0.03 });
      setTimeout(() => tone({ frequency: 659.25, duration: 0.07, type: 'sine', gain: 0.03 }), 80);
      setTimeout(() => tone({ frequency: 783.99, duration: 0.09, type: 'sine', gain: 0.03 }), 160);
    },
    fail() {
      tone({ frequency: 196, duration: 0.18, type: 'sawtooth', gain: 0.03 });
    },
    tick() {
      tone({ frequency: 880, duration: 0.03, type: 'triangle', gain: 0.015 });
    },
  };
}
