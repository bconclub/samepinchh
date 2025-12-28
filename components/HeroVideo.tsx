'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

export default function HeroVideo() {
    // Vimeo video ID from URL: https://vimeo.com/1149850498
    const vimeoVideoId = '1149850498';
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const handlePlayClick = () => {
        if (iframeRef.current) {
            // Send play command to Vimeo player
            iframeRef.current.contentWindow?.postMessage('{"method":"play"}', 'https://player.vimeo.com');
            setIsPlaying(true);
        }
    };

    const handleVideoClick = () => {
        if (iframeRef.current && isPlaying) {
            // Toggle pause/play when clicking on video
            iframeRef.current.contentWindow?.postMessage('{"method":"pause"}', 'https://player.vimeo.com');
            setIsPlaying(false);
        } else if (iframeRef.current && !isPlaying) {
            iframeRef.current.contentWindow?.postMessage('{"method":"play"}', 'https://player.vimeo.com');
            setIsPlaying(true);
        }
    };

    const handleMuteToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering video click
        if (iframeRef.current) {
            // Toggle mute using Vimeo API
            const command = isMuted 
                ? '{"method":"setVolume","value":1}' 
                : '{"method":"setVolume","value":0}';
            iframeRef.current.contentWindow?.postMessage(command, 'https://player.vimeo.com');
            setIsMuted(!isMuted);
        }
    };

    return (
        <section className="relative py-12 md:py-[80px] px-6 max-w-6xl mx-auto z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
            >
                {/* Title above video */}
                <div className="mb-6 text-center">
                    <h2 
                        className="text-[36px] md:text-[42px] font-bold mb-4 tracking-wide"
                        style={{ fontFamily: 'var(--font-daylight), sans-serif', color: '#000000' }}
                    >
                        What is Samepinchh
                    </h2>
                </div>

                {/* Video */}
                <div className="relative flex justify-center">
                    <div 
                        className="relative overflow-hidden border-2 w-[100%] md:w-[56%] frosted-glass cursor-pointer"
                        style={{ 
                            aspectRatio: '4/3', 
                            borderRadius: '25px',
                            borderColor: 'var(--text-primary)'
                        }}
                        onClick={handleVideoClick}
                    >
                        <iframe
                            ref={iframeRef}
                            src={`https://player.vimeo.com/video/${vimeoVideoId}?loop=0&controls=0&title=0&byline=0&portrait=0`}
                            className="w-full h-full pointer-events-none"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            style={{ 
                                position: 'absolute', 
                                top: 0,
                                left: '52%',
                                width: '133.33%',
                                height: '133.33%',
                                transform: 'translate(-45%, 0) scale(1.4)',
                                objectFit: 'cover',
                                borderRadius: '25px'
                            }}
                            onLoad={() => {
                                setIsPlaying(false);
                                // Listen for video end event
                                window.addEventListener('message', (event) => {
                                    if (event.origin !== 'https://player.vimeo.com') return;
                                    if (typeof event.data === 'string') {
                                        try {
                                            const data = JSON.parse(event.data);
                                            if (data.event === 'ended') {
                                                setIsPlaying(false);
                                            } else if (data.event === 'play') {
                                                setIsPlaying(true);
                                            } else if (data.event === 'pause') {
                                                setIsPlaying(false);
                                            }
                                        } catch (e) {
                                            // Not JSON, ignore
                                        }
                                    }
                                });
                            }}
                        />
                        
                        {/* Play Overlay */}
                        {!isPlaying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                                onClick={handlePlayClick}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center"
                                >
                                    <svg 
                                        className="w-12 h-12 md:w-20 md:h-20" 
                                        style={{ color: 'white', stroke: 'white', fill: 'white', strokeWidth: '0' }}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" fill="currentColor"/>
                                    </svg>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Mute Control Button */}
                        {isPlaying && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleMuteToggle}
                                className="absolute bottom-4 right-4 z-20 bg-black/60 hover:bg-black/80 rounded-full p-3 transition-all"
                                style={{ borderRadius: '50%' }}
                            >
                                {isMuted ? (
                                    <svg 
                                        className="w-6 h-6 text-white" 
                                        fill="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                    </svg>
                                ) : (
                                    <svg 
                                        className="w-6 h-6 text-white" 
                                        fill="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                    </svg>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

