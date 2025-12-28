'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
    return (
        <section 
            className="hero-section relative w-full flex items-center justify-center overflow-hidden"
            style={{ 
                minHeight: '50vh'
            }}
        >
            {/* Background Image - Full Screen */}
            <div className="absolute inset-0 w-full h-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full h-full"
                >
                    <Image
                        src="/00001111.webp"
                        alt="Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
            </div>
            
            {/* Text Overlay with Frosted Glass */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 px-3 py-2 md:px-4 md:py-3 rounded-2xl text-center max-w-lg translate-y-[20%] mx-6"
                style={{
                    background: 'rgba(250, 241, 229, 0.7)',
                    backdropFilter: 'blur(5px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                    border: '2px solid rgba(217, 143, 100, 0.4)',
                    boxShadow: '0 8px 32px 0 rgba(157, 90, 55, 0.25)'
                }}
            >
                <h1 className="text-[43px] md:text-[58px] font-bold tracking-wide" style={{ fontFamily: 'var(--font-daylight), sans-serif', color: '#000000' }}>
                    You&apos;re Not Alone
                </h1>
                <p className="text-[21px] md:text-[23px] font-semibold leading-[1.7] -mt-2" style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-primary)' }}>
                    Not Therapy, Only Real Conversations
                </p>
            </motion.div>
        </section>
    );
}
