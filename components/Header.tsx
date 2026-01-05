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
                    className="header__logo-link hover:opacity-80 transition-opacity"
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
                        className="header__logo h-10 md:h-12 w-auto"
                        priority
                    />
                </Link>
                <nav className="header__nav flex items-center gap-8">
                    <Link 
                        href="#about" 
                        className="header__nav-link transition-colors font-medium"
                        style={{ 
                            fontFamily: "'Shadows Into Light Two', sans-serif",
                            color: '#000000'
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById('about');
                            if (element) {
                                const headerHeight = 80; // Approximate header height
                                const offset = headerHeight + 10; // 10px above the section
                                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                                const offsetPosition = elementPosition - offset;
                                
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#000000';
                            e.currentTarget.style.opacity = '0.7';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#000000';
                            e.currentTarget.style.opacity = '1';
                        }}
                    >
                        About
                    </Link>
                    <Link 
                        href="#contact" 
                        className="header__nav-link transition-colors font-medium"
                        style={{ 
                            fontFamily: "'Shadows Into Light Two', sans-serif",
                            color: '#000000'
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById('contact');
                            if (element) {
                                const headerHeight = 80; // Approximate header height
                                const offset = headerHeight + 10; // 10px above the section
                                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                                const offsetPosition = elementPosition - offset;
                                
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#000000';
                            e.currentTarget.style.opacity = '0.7';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#000000';
                            e.currentTarget.style.opacity = '1';
                        }}
                    >
                        Contact
                    </Link>
                </nav>
            </div>
        </header>
    );
}



