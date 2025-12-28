'use client';

import { motion } from 'framer-motion';

export default function WhyThisExists() {
    return (
        <section className="relative py-12 md:py-[80px] px-6 max-w-4xl mx-auto z-10">
            <motion.div
                initial={{ opacity: 0, y: 20, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 2 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative frosted-glass p-8 md:p-12 shadow-lg"
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
                <h2 
                    className="text-[36px] md:text-[42px] mb-6"
                    style={{ 
                        fontFamily: "'Shadows Into Light Two', sans-serif",
                        color: 'var(--text-primary)',
                        fontWeight: '900'
                    }}
                >
                    The hardest part isn&apos;t the injury
                </h2>
                
                <div className="space-y-5 text-[22px] leading-[1.8]" style={{ color: 'var(--text-primary)' }}>
                    <p>
                        It&apos;s explaining it to people who nod but don&apos;t really get it. The isolation. The feeling that you&apos;re stuck in a language no one else speaks.
                    </p>
                    <p className="font-semibold">
                        Samepinchh is for the people who speak that language.
                    </p>
                    <p>
                        No experts. No agenda. Just survivors who&apos;ve been there, ready to listen, share, or just sit with you.
                    </p>
                    <p className="font-semibold italic">
                        You don&apos;t need to be &quot;healed&quot; to show up. You just need to show up.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}

