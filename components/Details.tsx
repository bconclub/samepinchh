'use client';

import { motion } from 'framer-motion';

const DetailCard = ({ title, description, delay }: { title: string, description: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        whileHover={{
            rotateY: 2,
            scale: 1.02,
            boxShadow: "12px 12px 24px rgba(0, 0, 0, 0.2), -6px -6px 16px rgba(0, 0, 0, 0.1)"
        }}
        style={{ 
            transformStyle: 'preserve-3d',
            borderLeftColor: 'var(--accent-primary)'
        }}
        className="details__card frosted-glass p-6 md:p-[40px] rounded-[16px] border-l-[4px]"
    >
        <h3 className="details__card-title text-[32px] font-black mb-4 tracking-wide" style={{ fontFamily: 'var(--font-classyvogue), sans-serif', color: '#000000' }}>{title}</h3>
        <p className="details__card-description text-[22px] leading-[1.7]" style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-primary)' }}>{description}</p>
    </motion.div>
);

export default function Details() {
    return (
        <section id="about" className="details relative py-12 md:py-[80px] px-6 max-w-5xl mx-auto z-10" style={{ perspective: '1000px' }}>
            <div className="details__grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <DetailCard
                    title="What:"
                    description="Not therapy, just real talks for brain injury, cancer, depression beaters who lost their world but found strength"
                    delay={0.1}
                />
                <DetailCard
                    title="Who:"
                    description="Anyone who survived something that changed everything and wants to be around people who get it."
                    delay={0.2}
                />
            </div>
        </section>
    );
}
