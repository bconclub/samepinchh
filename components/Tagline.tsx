'use client';

import { motion } from 'framer-motion';

export default function Tagline() {
    return (
        <section className="py-20 flex justify-center items-center">
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-2xl text-center border border-black/10"
            >
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 inline-block" style={{ fontFamily: "'Helvetica', 'Helvetica Neue', Arial, sans-serif" }}>
                    Same pinch. Same tea. Same room.
                </h2>
            </motion.div>
        </section>
    );
}
