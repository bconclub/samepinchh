'use client';

import { motion } from 'framer-motion';

export default function Tagline() {
    return (
        <section className="py-20 flex justify-center items-center">
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-2xl text-center border border-orange-50/50"
            >
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B35] to-orange-400 inline-block">
                    Same pinch. Same tea. Same room.
                </h2>
            </motion.div>
        </section>
    );
}
