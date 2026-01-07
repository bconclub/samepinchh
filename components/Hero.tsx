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
            className="hero hero-section relative w-full flex items-center justify-center overflow-hidden"
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
                        className="hero__image hero-background-image object-cover"
                        priority
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
                        className="hero__image hero-background-image object-cover"
                        priority
                    />
                </motion.div>
            </div>
            
            {/* Dark Overlay */}
            <div className="hero__overlay hero-overlay absolute inset-0 z-0" />
            
            {/* Text Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hero__content hero-content-wrapper relative z-10 text-center max-w-[56rem] mx-6"
                style={{
                    y: titleY,
                    opacity: titleOpacity
                }}
            >
                <h1 className="hero__title hero-title mb-3">
                    {"Survived something that changed everything".split(' ').map((word, index) => {
                        // Capitalize first letter of each word
                        const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
                        // Check if word is "something" or "everything" (case-insensitive)
                        const isBold = word.toLowerCase() === 'something' || word.toLowerCase() === 'everything';
                        
                        return (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: index * 0.1, 
                                    ease: "easeOut" 
                                }}
                                className={`inline-block ${isBold ? 'font-black' : 'font-light'}`}
                                style={{
                                    fontWeight: isBold ? 900 : 300
                                }}
                            >
                                {capitalizedWord}
                                {index < "Survived something that changed everything".split(' ').length - 1 && '\u00A0'}
                            </motion.span>
                        );
                    })}
                </h1>
            </motion.div>

            {/* Scroll Indicator Arrow */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
                onClick={() => {
                    const nextSection = document.querySelector('.brand-section');
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
                        className="hero-scroll-indicator"
                    >
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
}
