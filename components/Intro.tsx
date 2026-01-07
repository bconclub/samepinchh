'use client';

import { motion } from 'framer-motion';

export default function Intro() {
    return (
        <section className="py-12 md:py-[80px] px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-[700px] mx-auto bg-white p-6 md:p-[40px] rounded-[16px] border-2 border-black"
                style={{ boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -4px -4px 12px rgba(0, 0, 0, 0.05)' }}
            >
                <div className="space-y-6 text-[22px] leading-[1.7] text-black" style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif" }}>
                    <p>
                        I&apos;ve been there. I know how it feels when no one really gets it.
                    </p>
                    <p>
                        This is a space for survivors to show up, talk, and be around people who understand.
                    </p>
                    <p>
                        No therapy. No fixing. Just real conversation.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
