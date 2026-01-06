'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero2() {
    return (
        <section 
            id="about"
            className="brand-section relative w-full flex items-center justify-center px-6"
        >
            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center w-full"
            >
                {/* Icon Image */}
                <div className="brand-icon-wrapper">
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
                            className="brand-icon w-auto h-auto"
                            priority
                        />
                    </motion.div>
                </div>
                
                {/* Text Content */}
                <div className="text-center">
                    <motion.h2 
                        className="brand-title"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        Samepinchh
                    </motion.h2>
                    <h2 className="tagline">
                        {"Connect with folks who've been there".split(' ').map((word, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, margin: "-100px" }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: 0.4 + (index * 0.1), 
                                    ease: "easeOut" 
                                }}
                                className="tagline-word"
                            >
                                {word}
                                {index < "Connect with folks who've been there".split(' ').length - 1 && '\u00A0'}
                            </motion.span>
                        ))}
                    </h2>
                    <motion.p
                        className="text-sm md:text-[1.05rem] text-gray-500 mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
                    >
                        (Anonymously)
                    </motion.p>
                </div>
            </motion.div>
        </section>
    );
}

