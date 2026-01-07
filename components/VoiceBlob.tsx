'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface VoiceBlobProps {
  isRecording: boolean;
  audioStream: MediaStream | null;
}

export default function VoiceBlob({ isRecording, audioStream }: VoiceBlobProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    if (!isRecording || !audioStream) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setAudioLevel(0);
      return;
    }

    // Set up Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(audioStream);
    
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    microphone.connect(analyser);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    // Draw waveform
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!isRecording || !analyser || !dataArray) return;

      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average audio level
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const normalizedLevel = average / 255;
      setAudioLevel(normalizedLevel);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw waveform
      const barWidth = canvas.width / bufferLength;
      let x = 0;
      
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)'; // Red with transparency
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isRecording, audioStream]);

  // Calculate blob scale and opacity based on audio level
  const scale = 1 + (audioLevel * 0.3); // Scale from 1.0 to 1.3
  const opacity = 0.6 + (audioLevel * 0.4); // Opacity from 0.6 to 1.0

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated blob */}
      <motion.div
        className="absolute rounded-full bg-red-500"
        style={{
          width: '80px',
          height: '80px',
          filter: 'blur(20px)',
        }}
        animate={{
          scale: isRecording ? scale : 1,
          opacity: isRecording ? opacity : 0.3,
        }}
        transition={{
          duration: 0.1,
          ease: 'easeOut',
        }}
      />
      
      {/* Waveform canvas (hidden, used for visualization) */}
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="hidden"
      />
    </div>
  );
}

