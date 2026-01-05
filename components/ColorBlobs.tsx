'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ColorBlobs() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Different parallax speeds for different blobs to create depth
    const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const blob1X = useTransform(scrollYProgress, [0, 1], [0, 30]);
    const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -40]);
    const blob2X = useTransform(scrollYProgress, [0, 1], [0, -25]);
    const blob3Y = useTransform(scrollYProgress, [0, 1], [0, 35]);
    const blob3X = useTransform(scrollYProgress, [0, 1], [0, 20]);
    const blob4Y = useTransform(scrollYProgress, [0, 1], [0, -30]);
    const blob4X = useTransform(scrollYProgress, [0, 1], [0, -15]);
    const blob5Y = useTransform(scrollYProgress, [0, 1], [0, 45]);
    const blob5X = useTransform(scrollYProgress, [0, 1], [0, 25]);
    const blob6Y = useTransform(scrollYProgress, [0, 1], [0, -35]);
    const blob6X = useTransform(scrollYProgress, [0, 1], [0, 20]);
    const blob7Y = useTransform(scrollYProgress, [0, 1], [-250, -230]);
    const blob7X = useTransform(scrollYProgress, [0, 1], [-250, -235]);
    const blob8Y = useTransform(scrollYProgress, [0, 1], [0, -25]);
    const blob8X = useTransform(scrollYProgress, [0, 1], [0, 18]);

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Blob 1 - Top Left - Blush Pink */}
            <motion.div 
                className="absolute"
                style={{
                    width: '600px',
                    height: '600px',
                    top: '-200px',
                    left: '-150px',
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.03) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    rotate: -15,
                    x: blob1X,
                    y: blob1Y,
                }}
            />
            
            {/* Blob 2 - Top Right - Soft Blue */}
            <motion.div 
                className="absolute"
                style={{
                    width: '700px',
                    height: '700px',
                    top: '-250px',
                    right: '-200px',
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.04) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(90px)',
                    rotate: 25,
                    x: blob2X,
                    y: blob2Y,
                }}
            />
            
            {/* Blob 3 - Center Left - Creamy Peach */}
            <motion.div 
                className="absolute"
                style={{
                    width: '550px',
                    height: '550px',
                    top: '30%',
                    left: '-100px',
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.09) 0%, rgba(0, 0, 0, 0.03) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(75px)',
                    rotate: 10,
                    x: blob3X,
                    y: blob3Y,
                }}
            />
            
            {/* Blob 4 - Center Right - Warm Peach Orange */}
            <motion.div 
                className="absolute"
                style={{
                    width: '650px',
                    height: '650px',
                    top: '25%',
                    right: '-150px',
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.11) 0%, rgba(0, 0, 0, 0.035) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(85px)',
                    rotate: -20,
                    x: blob4X,
                    y: blob4Y,
                }}
            />
            
            {/* Blob 5 - Bottom Left - Blush Pink */}
            <motion.div 
                className="absolute"
                style={{
                    width: '580px',
                    height: '580px',
                    bottom: '-180px',
                    left: '-120px',
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.025) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(70px)',
                    rotate: 30,
                    x: blob5X,
                    y: blob5Y,
                }}
            />
            
            {/* Blob 6 - Bottom Center - Soft Blue */}
            <motion.div 
                className="absolute"
                style={{
                    width: '600px',
                    height: '600px',
                    bottom: '-200px',
                    left: '35%',
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.03) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    rotate: -25,
                    x: blob6X,
                    y: blob6Y,
                }}
            />
            
            {/* Blob 7 - Middle Center - Creamy Peach */}
            <motion.div 
                className="absolute"
                style={{
                    width: '500px',
                    height: '500px',
                    top: '50%',
                    left: '50%',
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0.02) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(65px)',
                    rotate: 15,
                    x: blob7X,
                    y: blob7Y,
                }}
            />
            
            {/* Blob 8 - Top Center - Warm Peach Orange */}
            <motion.div 
                className="absolute"
                style={{
                    width: '520px',
                    height: '520px',
                    top: '15%',
                    left: '45%',
                    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.09) 0%, rgba(0, 0, 0, 0.03) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(72px)',
                    rotate: -10,
                    x: blob8X,
                    y: blob8Y,
                }}
            />
        </div>
    );
}
