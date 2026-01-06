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
            transformStyle: 'preserve-3d'
        }}
        className="details__card details-card frosted-glass"
    >
        <h3 className="details__card-title details-card-title">{title}</h3>
        <p className="details__card-description details-card-description">{description}</p>
    </motion.div>
);

export default function Details() {
    return (
        <section id="about" className="details details-section relative px-6 max-w-5xl mx-auto z-10">
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
