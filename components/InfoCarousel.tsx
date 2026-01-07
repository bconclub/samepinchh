'use client';

import { motion, AnimatePresence, useMotionValue, PanInfo } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const cards = [
    {
        id: 1,
        title: 'What',
        content: 'Not therapy. Just real talks for brain injury, cancer, and depression survivors who lost their world but found their strength in the survival.'
    },
    {
        id: 2,
        title: 'Who',
        content: 'Anyone who survived something that changed everything and wants to be around people who actually understand what that means.'
    },
    {
        id: 3,
        title: 'When',
        content: 'Weekly offline and online spaces every Saturday. Show up when you\'re ready. No pressure, no rules, just people who understand.'
    }
];

export default function InfoCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isInitialMount, setIsInitialMount] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const x = useMotionValue(0);
    const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const AUTO_PLAY_DURATION = 8000; // 8 seconds
    
    // Reset x position and progress when card changes
    useEffect(() => {
        x.set(0);
        setProgress(0);
    }, [currentIndex, x]);

    // Mark initial mount as complete after first render
    useEffect(() => {
        setIsInitialMount(false);
    }, []);


    // Progress bar animation
    useEffect(() => {
        if (isPaused) {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
            return;
        }

        setProgress(0);
        const startTime = Date.now();
        const updateInterval = 50; // Update every 50ms for smooth animation
        
        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / AUTO_PLAY_DURATION) * 100, 100);
            setProgress(newProgress);
            
            if (newProgress >= 100) {
                if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                    progressIntervalRef.current = null;
                }
            }
        }, updateInterval);

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
        };
    }, [currentIndex, isPaused]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
            }
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, []);

    // Auto-play carousel - loops through all 3 cards
    useEffect(() => {
        if (isPaused) {
            return;
        }

        const interval = setInterval(() => {
            // Always move forward for seamless infinite loop
            setDirection(1);
            setCurrentIndex((prevIndex) => {
                return prevIndex === cards.length - 1 ? 0 : prevIndex + 1;
            });
        }, AUTO_PLAY_DURATION); // Change card every 8 seconds

        return () => {
            clearInterval(interval);
        };
    }, [isPaused]);

    // Pause auto-play on user interaction, resume after 8 seconds
    const pauseAutoPlay = () => {
        if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
        }
        setIsPaused(true);
        resumeTimeoutRef.current = setTimeout(() => {
            setIsPaused(false);
            resumeTimeoutRef.current = null;
        }, 8000);
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

    const swipeConfidenceThreshold = 100;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        pauseAutoPlay();
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            return newDirection === 1 
                ? (prevIndex === cards.length - 1 ? 0 : prevIndex + 1)
                : (prevIndex === 0 ? cards.length - 1 : prevIndex - 1);
        });
    };


    return (
        <section className="info-carousel relative py-12 md:py-[80px] px-6 max-w-5xl mx-auto z-10 overflow-visible">
            {/* Desktop: Show all 3 cards in a grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        whileHover={{
                            rotateY: 2,
                            scale: 1.02,
                            boxShadow: "12px 12px 24px rgba(0, 0, 0, 0.2), -6px -6px 16px rgba(0, 0, 0, 0.1)"
                        }}
                        style={{ 
                            transformStyle: 'preserve-3d',
                            borderLeftColor: 'var(--accent-primary)'
                        }}
                        className="info-carousel__card frosted-glass p-6 md:p-[40px] rounded-[16px] border-l-[4px] w-full max-w-full"
                    >
                        <h3 className="info-carousel__card-title text-[32px] font-black mb-4 tracking-wide" style={{ color: '#000000' }}>
                            {card.title}:
                        </h3>
                        <p className="info-carousel__card-description text-[22px] leading-[1.7]" style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif", color: 'var(--text-primary)' }}>
                            {card.content}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Mobile: Swipeable carousel */}
            <div className="md:hidden relative w-full overflow-hidden" style={{ minHeight: '400px' }}>
                <div className="relative w-full overflow-hidden" style={{ minHeight: '400px', position: 'relative' }}>
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentIndex}
                            variants={slideVariants}
                            initial={isInitialMount ? "center" : "enter"}
                            animate="center"
                            exit="exit"
                            style={{ 
                                x, 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                right: 0, 
                                width: '100%', 
                                height: '100%', 
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
                            className="cursor-grab active:cursor-grabbing flex items-center justify-center px-4"
                            whileDrag={{ cursor: 'grabbing' }}
                        >
                            <div
                                style={{ 
                                    transformStyle: 'preserve-3d',
                                    borderLeftColor: 'var(--accent-primary)'
                                }}
                                className="info-carousel__card frosted-glass p-6 rounded-[16px] border-l-[4px] w-full mx-auto relative"
                            >
                                <div className="pb-20">
                                    <h3 className="info-carousel__card-title text-[32px] font-black mb-4 tracking-wide" style={{ color: '#000000' }}>
                                        {cards[currentIndex].title}:
                                    </h3>
                                    <p className="info-carousel__card-description text-[22px] leading-[1.7] mb-4" style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif", color: 'var(--text-primary)' }}>
                                        {cards[currentIndex].content}
                                    </p>
                                </div>
                                
                                {/* Progress Timer Bar at bottom of card */}
                                <div className="absolute bottom-4 left-6 right-6">
                                    {/* Progress fill bar */}
                                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                                        <motion.div
                                            className="h-full bg-black rounded-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.05, ease: 'linear' }}
                                        />
                                    </div>
                                    {/* Indicator dots */}
                                    <div className="flex gap-2 justify-center">
                                        {cards.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    pauseAutoPlay();
                                                    setDirection(index > currentIndex ? 1 : -1);
                                                    setCurrentIndex(index);
                                                }}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    index === currentIndex 
                                                        ? 'bg-black' 
                                                        : 'bg-gray-300 hover:bg-gray-400'
                                                }`}
                                                aria-label={`Go to ${cards[index].title}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Subtle Navigation Arrows */}
                <button
                    onClick={() => paginate(-1)}
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 shadow-sm transition-all z-30 touch-manipulation opacity-60 hover:opacity-100"
                    aria-label="Previous card"
                    style={{ touchAction: 'manipulation', pointerEvents: 'auto' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <button
                    onClick={() => paginate(1)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 shadow-sm transition-all z-30 touch-manipulation opacity-60 hover:opacity-100"
                    aria-label="Next card"
                    style={{ touchAction: 'manipulation', pointerEvents: 'auto' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            </div>
        </section>
    );
}

