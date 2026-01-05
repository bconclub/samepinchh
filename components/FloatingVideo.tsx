'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';

export default function FloatingVideo() {
    const vimeoVideoId = '1149850498';
    const [isPlaying, setIsPlaying] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Parallax scroll effect - video moves up as user scrolls through Hero section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    // Video moves up as you scroll through the first section
    const videoY = useTransform(scrollYProgress, [0, 0.5, 1], ['0%', '-30%', '-60%']);

    const handlePlayClick = () => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage('{"method":"play"}', 'https://player.vimeo.com');
            iframeRef.current.contentWindow?.postMessage('{"method":"setVolume","value":1}', 'https://player.vimeo.com');
            setIsPlaying(true);
        }
    };

    const handleVideoClick = () => {
        if (iframeRef.current && isPlaying) {
            iframeRef.current.contentWindow?.postMessage('{"method":"pause"}', 'https://player.vimeo.com');
            setIsPlaying(false);
        } else if (iframeRef.current && !isPlaying) {
            iframeRef.current.contentWindow?.postMessage('{"method":"play"}', 'https://player.vimeo.com');
            iframeRef.current.contentWindow?.postMessage('{"method":"setVolume","value":1}', 'https://player.vimeo.com');
            setIsPlaying(true);
        }
    };

    return (
        <div 
            ref={containerRef}
            className="floating-video-container relative w-full z-20" 
            style={{ 
                marginTop: '-120px', 
                marginBottom: '-120px',
                position: 'relative'
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="floating-video-wrapper relative flex justify-center px-4 md:px-6"
                style={{ y: videoY, marginTop: '10px' }}
            >
                <div 
                    className="floating-video__player relative overflow-hidden cursor-pointer transition-all duration-500"
                    style={{ 
                        aspectRatio: '4/3', 
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: 'min(90vw, 600px)',
                        filter: isPlaying ? 'grayscale(0%)' : 'grayscale(100%)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: '#000'
                    }}
                    onClick={handleVideoClick}
                >
                    <iframe
                        ref={iframeRef}
                        src={`https://player.vimeo.com/video/${vimeoVideoId}?loop=0&controls=0&title=0&byline=0&portrait=0`}
                        className="floating-video__iframe w-full h-full pointer-events-none"
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
                            borderRadius: '16px'
                        }}
                        onLoad={() => {
                            setIsPlaying(false);
                            if (iframeRef.current) {
                                setTimeout(() => {
                                    iframeRef.current?.contentWindow?.postMessage('{"method":"setVolume","value":1}', 'https://player.vimeo.com');
                                }, 500);
                            }
                            window.addEventListener('message', (event) => {
                                if (event.origin !== 'https://player.vimeo.com') return;
                                if (typeof event.data === 'string') {
                                    try {
                                        const data = JSON.parse(event.data);
                                        if (data.event === 'ended') {
                                            setIsPlaying(false);
                                        } else if (data.event === 'play') {
                                            setIsPlaying(true);
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
                    {!isPlaying && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="floating-video__play-overlay absolute inset-0 flex items-center justify-center cursor-pointer z-10 bg-black/20 rounded-[16px]"
                            onClick={handlePlayClick}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="floating-video__play-button flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full p-4 md:p-6"
                            >
                                <svg 
                                    className="floating-video__play-icon w-12 h-12 md:w-16 md:h-16" 
                                    style={{ color: 'white', stroke: 'white', fill: 'white', strokeWidth: '0' }}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" fill="currentColor"/>
                                </svg>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

