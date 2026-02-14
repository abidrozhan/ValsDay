const fs = require('fs');

// Generate a simple placeholder WAV audio file
const sampleRate = 44100;
const duration = 5;
const numSamples = sampleRate * duration;
const dataSize = numSamples * 2;
const buffer = Buffer.alloc(44 + dataSize);

// WAV header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Generate a gentle sine wave that fades
for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 261.63 + 130 * Math.sin(2 * Math.PI * 0.25 * t);
    const val = Math.round(2000 * Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 0.15));
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, val)), 44 + i * 2);
}

if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

fs.writeFileSync('public/romantic-music.mp3', buffer);
console.log('Placeholder audio file created at public/romantic-music.mp3');
