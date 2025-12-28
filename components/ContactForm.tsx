'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Format message for WhatsApp
        const whatsappMessage = `Name: ${formData.name}\nContact: ${formData.contact}\nWhat brought you here: ${formData.message}`;
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // Open WhatsApp with the message
        const whatsappUrl = `https://wa.me/7259956780?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <section id="contact" className="relative py-12 md:py-[80px] px-6 max-w-xl mx-auto z-10">
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="frosted-glass p-4 md:p-6 rounded-[16px]"
            >
                <h3 className="text-[32px] font-black mb-4 text-center tracking-wide" style={{ fontFamily: 'var(--font-daylight), sans-serif', color: '#000000' }}>Let&apos;s Connect</h3>
                <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="text-[17px] font-bold ml-1" style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-primary)' }}>Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-[#d98f64] focus:outline-none focus:ring-2 focus:ring-[#a4bbd3]/60 transition-all placeholder:text-[#6a86a2]"
                            style={{ color: '#9d5a37', fontFamily: "'Shadows Into Light Two', sans-serif" }}
                            placeholder="Your name"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[17px] font-bold ml-1" style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-primary)' }}>Contact</label>
                        <input
                            type="tel"
                            required
                            value={formData.contact}
                            onChange={(e) => {
                                // Only allow numbers, spaces, +, -, and parentheses
                                const value = e.target.value.replace(/[^\d\s\+\-\(\)]/g, '');
                                setFormData({ ...formData, contact: value });
                            }}
                            className="w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-[#d98f64] focus:outline-none focus:ring-2 focus:ring-[#a4bbd3]/60 transition-all placeholder:text-[#6a86a2]"
                            style={{ color: '#9d5a37', fontFamily: "'Shadows Into Light Two', sans-serif" }}
                            placeholder="Phone number"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[17px] font-bold ml-1" style={{ fontFamily: "'Shadows Into Light Two', sans-serif", color: 'var(--text-primary)' }}>What brought you here</label>
                        <textarea
                            rows={3}
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-[#d98f64] focus:outline-none focus:ring-2 focus:ring-[#a4bbd3]/60 transition-all placeholder:text-[#6a86a2] resize-none"
                            style={{ color: '#9d5a37', fontFamily: "'Shadows Into Light Two', sans-serif" }}
                            placeholder=""
                        />
                    </div>

                    <motion.button
                        whileHover={{
                            y: -4,
                            scale: 1.02,
                            boxShadow: "12px 12px 24px rgba(157, 90, 55, 0.35), -6px -6px 16px rgba(164, 187, 211, 0.3)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full font-black py-3 rounded-[12px] transition-all mt-2 text-[22px]"
                        style={{ 
                            background: 'var(--accent-primary)',
                            color: '#faf1e5',
                            boxShadow: '6px 6px 12px rgba(157, 90, 55, 0.4), -3px -3px 8px rgba(164, 187, 211, 0.3)',
                            fontFamily: "'Shadows Into Light Two', sans-serif"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--accent-secondary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--accent-primary)';
                        }}
                    >
                        Send
                    </motion.button>
                </form>
            </motion.div>
        </section>
    );
}
