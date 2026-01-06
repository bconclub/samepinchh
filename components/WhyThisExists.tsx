'use client';

import { motion } from 'framer-motion';

export default function WhyThisExists() {
    return (
        <section className="why-this-exists why-this-exists-section relative px-6 max-w-4xl mx-auto z-10">
            <motion.div
                initial={{ opacity: 0, y: 20, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="why-this-exists__container why-this-exists-container relative frosted-glass shadow-lg"
                style={{
                    fontFamily: "'Shadows Into Light Two', sans-serif",
                    transform: 'rotate(2deg)',
                    backgroundImage: `
                        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
                        linear-gradient(90deg, rgba(0,0,0,0.02) 0%, transparent 50%, rgba(0,0,0,0.02) 100%)
                    `,
                    clipPath: 'polygon(0% 0%, 98% 1%, 100% 4%, 97% 8%, 100% 12%, 98% 16%, 100% 20%, 97% 24%, 100% 28%, 98% 32%, 100% 36%, 97% 40%, 100% 44%, 98% 48%, 100% 52%, 97% 56%, 100% 60%, 98% 64%, 100% 68%, 97% 72%, 100% 76%, 98% 80%, 100% 84%, 97% 88%, 100% 92%, 98% 96%, 100% 99%, 98% 100%, 0% 100%, 2% 99%, 0% 96%, 3% 92%, 0% 88%, 2% 84%, 0% 80%, 3% 76%, 0% 72%, 2% 68%, 0% 64%, 3% 60%, 0% 56%, 2% 52%, 0% 48%, 3% 44%, 0% 40%, 2% 36%, 0% 32%, 3% 28%, 0% 24%, 2% 20%, 0% 16%, 3% 12%, 0% 8%, 2% 4%, 0% 1%)',
                    border: 'none'
                }}
            >
                <div className="why-this-exists__content why-this-exists-content">
                    <p className="why-this-exists__paragraph">
                        Not therapy, just real talks for brain injury, cancer, depression beaters who lost their world but found strength
                    </p>
                </div>
            </motion.div>
        </section>
    );
}

