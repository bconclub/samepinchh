'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function FloatingVideo() {
    const vimeoVideoId = '1149850498';
    const [isPlaying, setIsPlaying] = useState(false);
    const [maxWidth, setMaxWidth] = useState('min(63vw, 420px)');
    const [isDesktop, setIsDesktop] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    
    // Track scroll progress - video moves up until it reaches center, then sticks
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });
    
    // On desktop: video moves up from initial position until it reaches center
    // The transform combines: moving up (based on scroll) + centering (-50%)
    // Initial margin-top: calc(10px + 28vh), target center: 50vh
    // Move up by: calc((10px + 28vh - 50vh) * progress) = calc((10px - 22vh) * progress)
    const videoTransform = useTransform(scrollYProgress, (progress: number) => {
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            // Desktop: combine scroll movement with centering
            // Use calc to properly combine the values
            return `translateY(calc(${progress} * (10px - 22vh) - 50%))`;
        }
        // Mobile: just center
        return 'translateY(-50%)';
    });

    // Set responsive maxWidth and desktop flag
    useEffect(() => {
        const updateResponsive = () => {
            const isDesktopSize = window.innerWidth >= 768;
            setIsDesktop(isDesktopSize);
            if (isDesktopSize) {
                // Desktop: original size
                setMaxWidth('min(90vw, 600px)');
            } else {
                // Mobile: 30% smaller
                setMaxWidth('min(63vw, 420px)');
            }
        };

        updateResponsive();
        window.addEventListener('resize', updateResponsive);
        return () => window.removeEventListener('resize', updateResponsive);
    }, []);

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
        >
            <motion.div
                ref={wrapperRef}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="floating-video-wrapper sticky-video flex justify-center"
                style={{ 
                    transform: videoTransform,
                }}
            >
                <div 
                    className={`floating-video__player floating-video-player relative overflow-hidden cursor-pointer ${
                        isPlaying ? 'floating-video-player-playing' : ''
                    }`}
                    style={{ 
                        maxWidth: maxWidth
                    }}
                    onClick={handleVideoClick}
                >
                    <iframe
                        ref={iframeRef}
                        src={`https://player.vimeo.com/video/${vimeoVideoId}?loop=0&controls=0&title=0&byline=0&portrait=0`}
                        className="floating-video__iframe floating-video-iframe w-full h-full pointer-events-none"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
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
                            className="floating-video__play-overlay floating-video-play-overlay absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                            onClick={handlePlayClick}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="floating-video__play-button floating-video-play-button flex items-center justify-center"
                            >
                                <svg 
                                    className="floating-video__play-icon floating-video-play-icon" 
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

