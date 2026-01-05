'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';

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
    const x = useMotionValue(0);
    const controls = useAnimation();
    
    // Reset x position when card changes
    useEffect(() => {
        x.set(0);
    }, [currentIndex, x]);

    // Mark initial mount as complete after first render
    useEffect(() => {
        setIsInitialMount(false);
    }, []);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            if (newDirection === 1) {
                return prevIndex === cards.length - 1 ? 0 : prevIndex + 1;
            } else {
                return prevIndex === 0 ? cards.length - 1 : prevIndex - 1;
            }
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
                        <h3 className="info-carousel__card-title text-[32px] font-black mb-4 tracking-wide" style={{ fontFamily: 'var(--font-classyvogue), sans-serif', color: '#000000' }}>
                            {card.title}:
                        </h3>
                        <p className="info-carousel__card-description text-[22px] leading-[1.7]" style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-primary)' }}>
                            {card.content}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Mobile: Swipeable carousel */}
            <div className="md:hidden relative w-full" style={{ minHeight: '400px', display: 'block', visibility: 'visible' }}>
                <div className="relative overflow-hidden w-full" style={{ minHeight: '400px', position: 'relative' }}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial={isInitialMount ? "center" : "enter"}
                            animate="center"
                            exit="exit"
                            style={{ x, position: 'absolute', top: 0, left: 0, right: 0, width: '100%', height: '100%' }}
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            drag="x"
                            dragConstraints={{ left: -300, right: 300 }}
                            dragElastic={0.3}
                            onDragEnd={(e, { offset, velocity }: PanInfo) => {
                                const swipe = swipePower(offset.x, velocity.x);

                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1);
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1);
                                } else {
                                    // Snap back if swipe wasn't strong enough
                                    controls.start({ x: 0 });
                                }
                            }}
                            animate={controls}
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
                                <h3 className="info-carousel__card-title text-[32px] font-black mb-4 tracking-wide" style={{ fontFamily: 'var(--font-classyvogue), sans-serif', color: '#000000' }}>
                                    {cards[currentIndex].title}:
                                </h3>
                                <p className="info-carousel__card-description text-[22px] leading-[1.7] mb-4" style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-primary)' }}>
                                    {cards[currentIndex].content}
                                </p>
                                
                                {/* Timeline Bar at bottom of card */}
                                <div className="absolute bottom-4 left-6 right-6 h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="flex h-full">
                                        {cards.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDirection(index > currentIndex ? 1 : -1);
                                                    setCurrentIndex(index);
                                                }}
                                                className={`flex-1 h-full transition-all duration-300 ${
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
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 shadow-sm transition-all z-10 touch-manipulation opacity-60 hover:opacity-100"
                    aria-label="Previous card"
                    style={{ touchAction: 'manipulation' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <button
                    onClick={() => paginate(1)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 shadow-sm transition-all z-10 touch-manipulation opacity-60 hover:opacity-100"
                    aria-label="Next card"
                    style={{ touchAction: 'manipulation' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            </div>
        </section>
    );
}

