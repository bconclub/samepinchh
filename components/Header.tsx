'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    return (
        <header 
            className="header fixed top-0 left-0 w-full border-b z-50" 
            style={{ 
                borderBottomColor: 'rgba(0, 0, 0, 0.2)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)'
            }}
        >
            <div className="header__container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link 
                    href="/" 
                    className="header__logo-link hover:opacity-80 transition-opacity cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }}
                >
                    <Image
                        src="/Samepinchh logo.png"
                        alt="Samepinchh"
                        width={150}
                        height={50}
                        className="header__logo h-10 md:h-12 w-auto cursor-pointer"
                        priority
                    />
                </Link>
                <nav className="header__nav flex items-center">
                    <Link 
                        href="#contact" 
                        className="px-6 py-2 rounded-[12px] font-bold text-base transition-all"
                        style={{ 
                            fontFamily: "'Shadows Into Light Two', sans-serif",
                            background: '#000000',
                            color: '#ffffff',
                            boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)'
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById('contact');
                            if (element) {
                                const headerHeight = 80;
                                const offset = headerHeight + 10;
                                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                                const offsetPosition = elementPosition - offset;
                                
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#333333';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#000000';
                        }}
                    >
                        Join Now
                    </Link>
                </nav>
            </div>
        </header>
    );
}



