'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function VideoWall() {
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // After first user interaction, enable autoplay
        const handleInteraction = () => {
            setHasInteracted(true);
            videoRefs.current.forEach((video) => {
                if (video) {
                    video.play().catch(() => {
                        // Autoplay may be blocked by browser
                    });
                }
            });
        };

        // Listen for any user interaction
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('scroll', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('scroll', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    // Placeholder video sources - replace with your actual video URLs
    const videos = [
        { src: '/videos/video1.mp4', title: 'Video 1' },
        { src: '/videos/video2.mp4', title: 'Video 2' },
        { src: '/videos/video3.mp4', title: 'Video 3' },
        { src: '/videos/video4.mp4', title: 'Video 4' },
        { src: '/videos/video5.mp4', title: 'Video 5' },
        { src: '/videos/video6.mp4', title: 'Video 6' },
    ];

    return (
        <section className="py-12 md:py-[80px] px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-8"
            >
                <h2 
                    className="text-[36px] md:text-[42px] font-bold text-black mb-4 tracking-wide"
                    style={{ fontFamily: 'var(--font-classyvogue), sans-serif' }}
                >
                    Our Stories
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {videos.map((video, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="relative aspect-video rounded-lg overflow-hidden border-2 border-black"
                        style={{ 
                            boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.08), -3px -3px 8px rgba(0, 0, 0, 0.04)'
                        }}
                    >
                        <video
                            ref={(el) => {
                                videoRefs.current[index] = el;
                            }}
                            src={video.src}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            onLoadedData={(e) => {
                                if (hasInteracted) {
                                    e.currentTarget.play().catch(() => {
                                        // Autoplay may be blocked
                                    });
                                }
                            }}
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

