'use client';

import { motion, AnimatePresence, useMotionValue, PanInfo } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const testimonials = [
    {
        id: 1,
        quote: 'Finally found people who get it.',
        attribution: 'Anonymous, Bangalore'
    },
    {
        id: 2,
        quote: 'No one understood until I came here. Just being in the room helped.',
        attribution: 'Survivor, Karnataka'
    },
    {
        id: 3,
        quote: 'I didn\'t have to explain. They already knew.',
        attribution: 'Anonymous, Koramangala'
    },
    {
        id: 4,
        quote: 'It\'s not therapy. It\'s just... real. That\'s what I needed.',
        attribution: 'Brain injury survivor, Bangalore'
    }
];

export default function SocialProof() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState(0);
    const x = useMotionValue(0);
    const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const AUTO_PLAY_DURATION = 5000; // 5 seconds per testimonial

    // Reset x position when card changes
    useEffect(() => {
        x.set(0);
    }, [currentIndex, x]);

    // Auto-play carousel - loops through all testimonials
    useEffect(() => {
        if (isPaused) {
            return;
        }

        const interval = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prevIndex) => 
                prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
            );
        }, AUTO_PLAY_DURATION);

        return () => clearInterval(interval);
    }, [isPaused]);

    // Pause auto-play on user interaction, resume after 5 seconds
    const pauseAutoPlay = () => {
        if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
        }
        setIsPaused(true);
        resumeTimeoutRef.current = setTimeout(() => {
            setIsPaused(false);
            resumeTimeoutRef.current = null;
        }, 5000);
    };

    const swipeConfidenceThreshold = 100;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        pauseAutoPlay();
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            return newDirection === 1 
                ? (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1)
                : (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1);
        });
    };

    const slideVariants = {
        enter: {
            opacity: 0,
            zIndex: 1
        },
        center: {
            zIndex: 2,
            x: 0,
            opacity: 1
        },
        exit: {
            zIndex: 1,
            opacity: 0
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <section className="social-proof social-proof-section relative px-6 max-w-2xl mx-auto z-10 my-12">
            <div className="relative w-full overflow-hidden" style={{ minHeight: '200px' }}>
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentIndex}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        style={{ 
                            x, 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            width: '100%', 
                            touchAction: 'pan-x'
                        }}
                        transition={{
                            opacity: { duration: 0.3, ease: "easeInOut" }
                        }}
                        drag="x"
                        dragConstraints={{ left: -200, right: 200 }}
                        dragElastic={0.2}
                        dragMomentum={false}
                        onDragEnd={(e, { offset, velocity }: PanInfo) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold || offset.x < -50) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold || offset.x > 50) {
                                paginate(-1);
                            } else {
                                // Snap back if swipe wasn't strong enough
                                x.set(0);
                            }
                        }}
                        onDragStart={() => pauseAutoPlay()}
                        className="cursor-grab active:cursor-grabbing"
                        whileDrag={{ cursor: 'grabbing' }}
                    >
                        <div className="social-proof__card frosted-glass rounded-[16px] p-6 md:p-8 text-center">
                            <div className="social-proof__testimonial">
                                <blockquote className="text-lg md:text-xl text-gray-900 italic mb-2">
                                    &ldquo;{testimonials[currentIndex].quote}&rdquo;
                                </blockquote>
                                <p className="text-sm md:text-base text-gray-600">
                                    — {testimonials[currentIndex].attribution}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}

