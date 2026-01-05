'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ColorBlobs from '@/components/ColorBlobs';

function ThankYouContent() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        message: ''
    });

    useEffect(() => {
        // Get form data from URL params
        const name = searchParams.get('name') || '';
        const contact = searchParams.get('contact') || '';
        const message = searchParams.get('message') || '';
        
        setFormData({ name, contact, message });
    }, [searchParams]);

    return (
        <main className="min-h-screen relative overflow-hidden">
            <ColorBlobs />
            <Header />
            <section className="relative py-12 md:py-[80px] px-6 max-w-2xl mx-auto z-10 min-h-[80vh] flex items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="frosted-glass p-6 md:p-8 rounded-[16px] w-full"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="text-center mb-6"
                    >
                        <div className="text-6xl mb-4">✓</div>
                        <h1 
                            className="text-[36px] md:text-[42px] font-black mb-4 tracking-wide"
                            style={{ fontFamily: 'var(--font-classyvogue), sans-serif', color: '#000000' }}
                        >
                            Thank You!
                        </h1>
                        <p 
                            className="text-[18px] md:text-[20px] mb-6"
                            style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-primary)' }}
                        >
                            We&apos;ve received your message and will get back to you soon.
                        </p>
                    </motion.div>

                    {formData.name && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 p-4 rounded-[12px] border-2 border-black/20"
                            style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                        >
                            <h2 
                                className="text-[24px] font-bold mb-4"
                                style={{ fontFamily: 'var(--font-classyvogue), sans-serif', color: '#000000' }}
                            >
                                Confirmation Details
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p 
                                        className="text-[16px] font-bold mb-1"
                                        style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-muted)' }}
                                    >
                                        Name:
                                    </p>
                                    <p 
                                        className="text-[18px]"
                                        style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: '#000000' }}
                                    >
                                        {formData.name}
                                    </p>
                                </div>
                                {formData.contact && (
                                    <div>
                                        <p 
                                            className="text-[16px] font-bold mb-1"
                                            style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-muted)' }}
                                        >
                                            Contact:
                                        </p>
                                        <p 
                                            className="text-[18px]"
                                            style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: '#000000' }}
                                        >
                                            {formData.contact}
                                        </p>
                                    </div>
                                )}
                                {formData.message && (
                                    <div>
                                        <p 
                                            className="text-[16px] font-bold mb-1"
                                            style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-muted)' }}
                                        >
                                            What brought you here:
                                        </p>
                                        <p 
                                            className="text-[18px]"
                                            style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: '#000000' }}
                                        >
                                            {formData.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-center"
                    >
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 rounded-[12px] font-bold text-lg transition-all"
                                style={{
                                    background: '#000000',
                                    color: '#ffffff',
                                    fontFamily: "'Shadows Into Light Two', sans-serif",
                                    boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#333333';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#000000';
                                }}
                            >
                                Back to Home
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>
            <Footer />
        </main>
    );
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen relative overflow-hidden">
                <ColorBlobs />
                <Header />
                <section className="relative py-12 md:py-[80px] px-6 max-w-2xl mx-auto z-10 min-h-[80vh] flex items-center justify-center">
                    <div className="text-center">
                        <p style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: '#000000' }}>Loading...</p>
                    </div>
                </section>
                <Footer />
            </main>
        }>
            <ThankYouContent />
        </Suspense>
    );
}

