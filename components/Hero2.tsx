'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero2() {
    return (
        <section 
            className="hero2 relative w-full flex items-center justify-center py-16 md:py-24 px-6"
            style={{ 
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                scrollMarginTop: '0px',
                paddingTop: '200px',
                marginTop: '-10px'
            }}
        >
            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center"
            >
                {/* Icon Image */}
                <div className="mb-6 md:mb-8">
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 2, -2, 0],
                        }}
                        transition={{
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            },
                            rotate: {
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                    >
                        <Image
                            src="/Same icon black.png"
                            alt="Same Pinch Icon"
                            width={200}
                            height={200}
                            className="w-auto h-auto max-w-[150px] md:max-w-[200px]"
                            priority
                        />
                    </motion.div>
                </div>
                
                {/* Text Content */}
                <div className="text-center">
                    <motion.h2 
                        className="text-[58px] md:text-[86px] tracking-wide mb-2" 
                        style={{ 
                            fontFamily: 'var(--font-classyvogue), sans-serif', 
                            color: '#000000', 
                            fontWeight: 700, 
                            lineHeight: '1.2' 
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        Samepinchh
                    </motion.h2>
                    <h2 
                        className="text-[48px] md:text-[72px] tracking-wide" 
                        style={{ 
                            fontFamily: 'var(--font-classyvogue), sans-serif', 
                            color: '#000000', 
                            fontWeight: 300, 
                            lineHeight: '1.2' 
                        }}
                    >
                        {"Connect with folks who've been there".split(' ').map((word, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: 0.4 + (index * 0.1), 
                                    ease: "easeOut" 
                                }}
                                className="inline-block"
                            >
                                {word}
                                {index < "Connect with folks who've been there".split(' ').length - 1 && '\u00A0'}
                            </motion.span>
                        ))}
                    </h2>
                </div>
            </motion.div>
        </section>
    );
}

