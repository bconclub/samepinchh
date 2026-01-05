'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    // Parallax effect - background moves slower than scroll
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    
    // Title animation - moves up and fades out while scrolling
    const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <section 
            ref={sectionRef}
            className="hero relative w-full flex items-center justify-center overflow-hidden"
            style={{ 
                minHeight: '100vh',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                scrollMarginTop: '0px'
            }}
        >
            {/* Background Image - Mobile */}
            <div className="hero__background hero__background--mobile absolute inset-0 w-full h-full md:hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="hero__background-wrapper relative w-full h-full"
                    style={{
                        y: backgroundY,
                        scale: backgroundScale
                    }}
                >
                    <Image
                        src="/HEro Mobile.webp"
                        alt="Hero"
                        fill
                        className="hero__image object-cover"
                        priority
                        style={{ filter: 'brightness(0.6)' }}
                    />
                </motion.div>
            </div>
            
            {/* Background Image - Desktop */}
            <div className="hero__background hero__background--desktop absolute inset-0 w-full h-full hidden md:block">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="hero__background-wrapper relative w-full h-full"
                    style={{
                        y: backgroundY,
                        scale: backgroundScale
                    }}
                >
                    <Image
                        src="/Hero Desktop.webp"
                        alt="Hero"
                        fill
                        className="hero__image object-cover"
                        priority
                        style={{ filter: 'brightness(0.6)' }}
                    />
                </motion.div>
            </div>
            
            {/* Dark Overlay */}
            <div className="hero__overlay absolute inset-0 bg-black/30 z-0" />
            
            {/* Text Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hero__content relative z-10 text-center max-w-[56rem] translate-y-[20%] mx-6"
                style={{
                    y: titleY,
                    opacity: titleOpacity
                }}
            >
                <h1 className="hero__title text-[42px] md:text-[86px] tracking-wide mb-3" style={{ fontFamily: 'var(--font-classyvogue), sans-serif', color: '#D9D9D9', fontWeight: 700, lineHeight: '1.2' }}>
                    {"Survived something that changed everything".split(' ').map((word, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                duration: 0.5, 
                                delay: index * 0.1, 
                                ease: "easeOut" 
                            }}
                            className="inline-block"
                        >
                            {word}
                            {index < "Survived something that changed everything".split(' ').length - 1 && '\u00A0'}
                        </motion.span>
                    ))}
                </h1>
            </motion.div>

            {/* Scroll Indicator Arrow */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
                onClick={() => {
                    const nextSection = document.querySelector('.hero2');
                    if (nextSection) {
                        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        window.scrollTo({
                            top: window.innerHeight,
                            behavior: 'smooth'
                        });
                    }
                }}
            >
                <motion.div
                    animate={{
                        y: [0, 10, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="flex flex-col items-center"
                >
                    <svg 
                        width="32" 
                        height="32" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ color: '#D9D9D9' }}
                    >
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
}
