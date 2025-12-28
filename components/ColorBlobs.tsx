'use client';

export default function ColorBlobs() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Blob 1 - Top Left - Blush Pink */}
            <div 
                className="absolute"
                style={{
                    width: '600px',
                    height: '600px',
                    top: '-200px',
                    left: '-150px',
                    background: 'radial-gradient(circle, rgba(250, 229, 241, 0.2) 0%, rgba(250, 229, 241, 0.05) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    transform: 'rotate(-15deg)',
                }}
            />
            
            {/* Blob 2 - Top Right - Soft Blue */}
            <div 
                className="absolute"
                style={{
                    width: '700px',
                    height: '700px',
                    top: '-250px',
                    right: '-200px',
                    background: 'radial-gradient(circle, rgba(164, 187, 211, 0.25) 0%, rgba(164, 187, 211, 0.08) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(90px)',
                    transform: 'rotate(25deg)',
                }}
            />
            
            {/* Blob 3 - Center Left - Creamy Peach */}
            <div 
                className="absolute"
                style={{
                    width: '550px',
                    height: '550px',
                    top: '30%',
                    left: '-100px',
                    background: 'radial-gradient(circle, rgba(250, 241, 229, 0.18) 0%, rgba(250, 241, 229, 0.06) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(75px)',
                    transform: 'rotate(10deg)',
                }}
            />
            
            {/* Blob 4 - Center Right - Warm Peach Orange */}
            <div 
                className="absolute"
                style={{
                    width: '650px',
                    height: '650px',
                    top: '25%',
                    right: '-150px',
                    background: 'radial-gradient(circle, rgba(217, 143, 100, 0.22) 0%, rgba(217, 143, 100, 0.07) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(85px)',
                    transform: 'rotate(-20deg)',
                }}
            />
            
            {/* Blob 5 - Bottom Left - Blush Pink */}
            <div 
                className="absolute"
                style={{
                    width: '580px',
                    height: '580px',
                    bottom: '-180px',
                    left: '-120px',
                    background: 'radial-gradient(circle, rgba(250, 229, 241, 0.15) 0%, rgba(250, 229, 241, 0.05) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(70px)',
                    transform: 'rotate(30deg)',
                }}
            />
            
            {/* Blob 6 - Bottom Center - Soft Blue */}
            <div 
                className="absolute"
                style={{
                    width: '600px',
                    height: '600px',
                    bottom: '-200px',
                    left: '35%',
                    background: 'radial-gradient(circle, rgba(164, 187, 211, 0.2) 0%, rgba(164, 187, 211, 0.06) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    transform: 'rotate(-25deg)',
                }}
            />
            
            {/* Blob 7 - Middle Center - Creamy Peach */}
            <div 
                className="absolute"
                style={{
                    width: '500px',
                    height: '500px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(15deg)',
                    background: 'radial-gradient(circle, rgba(250, 241, 229, 0.12) 0%, rgba(250, 241, 229, 0.04) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(65px)',
                }}
            />
            
            {/* Blob 8 - Top Center - Warm Peach Orange */}
            <div 
                className="absolute"
                style={{
                    width: '520px',
                    height: '520px',
                    top: '15%',
                    left: '45%',
                    background: 'radial-gradient(circle, rgba(217, 143, 100, 0.18) 0%, rgba(217, 143, 100, 0.06) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(72px)',
                    transform: 'rotate(-10deg)',
                }}
            />
        </div>
    );
}
