'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

export default function HeroVideo() {
    // Vimeo video ID from URL: https://vimeo.com/1149850498
    const vimeoVideoId = '1149850498';
    const [isPlaying, setIsPlaying] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const handlePlayClick = () => {
        if (iframeRef.current) {
            // Send play command to Vimeo player with volume set to 1 (unmuted)
            iframeRef.current.contentWindow?.postMessage('{"method":"play"}', 'https://player.vimeo.com');
            iframeRef.current.contentWindow?.postMessage('{"method":"setVolume","value":1}', 'https://player.vimeo.com');
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
            iframeRef.current.contentWindow?.postMessage('{"method":"setVolume","value":1}', 'https://player.vimeo.com');
            setIsPlaying(true);
        }
    };

    return (
        <section className="hero-video relative py-12 md:py-[80px] px-6 max-w-6xl mx-auto z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hero-video__container relative"
            >
                {/* Title above video */}
                <div className="hero-video__header mb-6 text-center">
                    <h2 
                        className="hero-video__title text-[36px] md:text-[42px] font-bold mb-4 tracking-wide"
                        style={{ fontFamily: 'var(--font-classyvogue), sans-serif', color: '#000000' }}
                    >
                        What is Samepinchh
                    </h2>
                </div>

                {/* Video */}
                <div className="hero-video__wrapper relative flex justify-center">
                    <div 
                        className="hero-video__player relative overflow-hidden border-2 w-[100%] md:w-[56%] frosted-glass cursor-pointer transition-all duration-500"
                        style={{ 
                            aspectRatio: '4/3', 
                            borderRadius: '25px',
                            borderColor: 'var(--text-primary)',
                            filter: isPlaying ? 'grayscale(0%)' : 'grayscale(100%)'
                        }}
                        onClick={handleVideoClick}
                    >
                        <iframe
                            ref={iframeRef}
                            src={`https://player.vimeo.com/video/${vimeoVideoId}?loop=0&controls=0&title=0&byline=0&portrait=0`}
                            className="hero-video__iframe w-full h-full pointer-events-none"
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
                                // Set volume to 1 (unmuted) when iframe loads
                                if (iframeRef.current) {
                                    setTimeout(() => {
                                        iframeRef.current?.contentWindow?.postMessage('{"method":"setVolume","value":1}', 'https://player.vimeo.com');
                                    }, 500);
                                }
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
                                                // Ensure volume is always 1 when playing
                                                if (iframeRef.current) {
                                                    iframeRef.current.contentWindow?.postMessage('{"method":"setVolume","value":1}', 'https://player.vimeo.com');
                                                }
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
                                className="hero-video__play-overlay absolute inset-0 flex items-end justify-end cursor-pointer z-10 p-4"
                                onClick={handlePlayClick}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="hero-video__play-button flex items-center justify-center"
                                >
                                    <svg 
                                        className="hero-video__play-icon w-6 h-6 md:w-10 md:h-10" 
                                        style={{ color: 'white', stroke: 'white', fill: 'white', strokeWidth: '0' }}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" fill="currentColor"/>
                                    </svg>
                                </motion.div>
                            </motion.div>
                        )}

                    </div>
                </div>
            </motion.div>
        </section>
    );
}

