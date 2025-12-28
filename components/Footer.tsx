'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="w-full py-4 text-center flex flex-col items-center gap-3"
        >
            <Image
                src="/SAmepinchh logo.webp"
                alt="Samepinchh"
                width={150}
                height={50}
                className="h-10 md:h-12 w-auto"
            />
            <p className="text-[17px] md:text-[19px] font-medium" style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-muted)' }}>
                Same people. Same understanding.
            </p>
        </motion.footer>
    );
}
