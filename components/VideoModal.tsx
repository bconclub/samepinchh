'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    vimeoVideoId: string;
}

export default function VideoModal({ isOpen, onClose, vimeoVideoId }: VideoModalProps) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Pause video when modal closes
    useEffect(() => {
        if (!isOpen && iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage('{"method":"pause"}', 'https://player.vimeo.com');
        }
    }, [isOpen]);

    // Listen for video play events and ensure volume stays at 50%
    useEffect(() => {
        if (!isOpen) return;

        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://player.vimeo.com') return;
            if (typeof event.data === 'string') {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === 'play' && iframeRef.current) {
                        // Set volume to 50% when video plays
                        setTimeout(() => {
                            iframeRef.current?.contentWindow?.postMessage('{"method":"setVolume","value":0.5}', 'https://player.vimeo.com');
                        }, 100);
                    }
                } catch (e) {
                    // Not JSON, ignore
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl" style={{ 
                            maxHeight: '81vh',
                            maxWidth: 'min(81vw, calc(81vh * 9 / 16))',
                            width: 'min(81vw, calc(81vh * 9 / 16))'
                        }}>
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                                aria-label="Close modal"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            {/* Video Container - 9:16 aspect ratio, constrained to viewport */}
                            <div className="relative w-full" style={{ 
                                paddingBottom: '177.78%'
                            }}>
                                <iframe
                                    ref={iframeRef}
                                    src={`https://player.vimeo.com/video/${vimeoVideoId}?autoplay=1&loop=0&controls=0&title=0&byline=0&portrait=0`}
                                    className="absolute top-0 left-0 w-full h-full"
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    onLoad={() => {
                                        // Set volume to 50% when iframe loads
                                        if (iframeRef.current) {
                                            setTimeout(() => {
                                                iframeRef.current?.contentWindow?.postMessage('{"method":"setVolume","value":0.5}', 'https://player.vimeo.com');
                                            }, 500);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

