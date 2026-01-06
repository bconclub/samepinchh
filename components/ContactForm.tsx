'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Lock, Heart, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';

// @ts-ignore - react-datepicker types conflict with Next.js dynamic import  
const DatePicker: any = dynamic(
    () => import('react-datepicker').then((mod: any) => {
        // Ensure CSS is loaded
        if (typeof window !== 'undefined') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/react-datepicker@4.25.0/dist/react-datepicker.css';
            if (!document.querySelector(`link[href="${link.href}"]`)) {
                document.head.appendChild(link);
            }
        }
        return mod.default || mod;
    }),
    { 
        ssr: false,
        loading: () => (
            <input
                readOnly
                required
                className="contact-form__input contact-form-input w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500"
                value=""
                placeholder="Select a Saturday"
            />
        ),
    }
);

type RecordingState = 'idle' | 'recording' | 'stopped';

// Helper functions for IST timezone (UTC+5:30)
const getISTNow = (): Date => {
    // Return current time (Date objects are always in UTC internally)
    // Use getISTComponents() to get IST-specific components
    return new Date();
};

// Get date components in IST timezone
const getISTComponents = (date: Date) => {
    // Fallback if Intl API is not available (SSR)
    if (typeof window === 'undefined' || !Intl || !Intl.DateTimeFormat) {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
            day: date.getDay(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds()
        };
    }
    
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const parts = formatter.formatToParts(date);
    const dayNames: { [key: string]: number } = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    
    const yearPart = parts.find(p => p.type === 'year');
    const monthPart = parts.find(p => p.type === 'month');
    const dayPart = parts.find(p => p.type === 'day');
    const weekdayPart = parts.find(p => p.type === 'weekday');
    const hourPart = parts.find(p => p.type === 'hour');
    const minutePart = parts.find(p => p.type === 'minute');
    const secondPart = parts.find(p => p.type === 'second');
    
    if (!yearPart || !monthPart || !dayPart || !weekdayPart || !hourPart || !minutePart || !secondPart) {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
            day: date.getDay(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds()
        };
    }
    
    return {
        year: parseInt(yearPart.value),
        month: parseInt(monthPart.value) - 1,
        date: parseInt(dayPart.value),
        day: dayNames[weekdayPart.value] ?? date.getDay(),
        hours: parseInt(hourPart.value),
        minutes: parseInt(minutePart.value),
        seconds: parseInt(secondPart.value)
    };
};

const createISTDate = (year: number, month: number, day: number, hours: number = 0, minutes: number = 0, seconds: number = 0): Date => {
    // Create date string in IST format (UTC+5:30)
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}+05:30`;
    return new Date(dateStr);
};

const setISTHours = (date: Date, hours: number, minutes: number = 0, seconds: number = 0): Date => {
    // Get date components in IST and create new date with specified time
    const components = getISTComponents(date);
    return createISTDate(components.year, components.month, components.date, hours, minutes, seconds);
};

const getISTDateOnly = (date: Date): Date => {
    // Get date at midnight IST
    const components = getISTComponents(date);
    return createISTDate(components.year, components.month, components.date, 0, 0, 0);
};

export default function ContactForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        selectedDate: null as Date | null,
        message: ''
    });
    const [isMounted, setIsMounted] = useState(false);
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [micPermissionDenied, setMicPermissionDenied] = useState(false);
    const [mediaRecorderSupported, setMediaRecorderSupported] = useState(true);
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    
    // Calculate initial next Saturday date in IST
    const calculateNextSaturday = () => {
        const now = getISTNow();
        const nowComponents = getISTComponents(now);
        
        // Calculate days until next Saturday (6 is Saturday)
        let daysUntilSaturday = (6 - nowComponents.day + 7) % 7 || 7;
        
        // Create a date object for the target Saturday
        let targetDate = new Date(nowComponents.year, nowComponents.month, nowComponents.date + daysUntilSaturday);
        let targetComponents = getISTComponents(targetDate);
        
        // Create next Saturday date in IST at 7 PM
        let nextSaturday = createISTDate(
            targetComponents.year, 
            targetComponents.month, 
            targetComponents.date, 
            19, 0, 0
        );
        
        // If we've passed this Saturday 7 PM IST, get next Saturday
        if (now.getTime() > nextSaturday.getTime()) {
            // Add 7 days to the target date
            targetDate = new Date(targetComponents.year, targetComponents.month, targetComponents.date + 7);
            targetComponents = getISTComponents(targetDate);
            nextSaturday = createISTDate(
                targetComponents.year,
                targetComponents.month,
                targetComponents.date,
                19, 0, 0
            );
        }
        
        return nextSaturday;
    };
    
    const [nextSpaceDate, setNextSpaceDate] = useState<Date>(calculateNextSaturday());
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check MediaRecorder support on mount and load datepicker CSS
    useEffect(() => {
        // Set isMounted immediately - this is a client component so window will be defined
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            if (!window.MediaRecorder) {
                setMediaRecorderSupported(false);
            }
            // Load datepicker CSS
            // @ts-ignore - CSS import
            import('react-datepicker/dist/react-datepicker.css');
        }
    }, []);

    // Countdown timer to next Saturday 7 PM IST
    useEffect(() => {
        const updateCountdown = () => {
            const now = getISTNow();
            const nowComponents = getISTComponents(now);
            
            // Calculate days until next Saturday (6 is Saturday)
            let daysUntilSaturday = (6 - nowComponents.day + 7) % 7 || 7;
            
            // Create a date object for the target Saturday
            let targetDate = new Date(nowComponents.year, nowComponents.month, nowComponents.date + daysUntilSaturday);
            let targetComponents = getISTComponents(targetDate);
            
            // Create next Saturday date in IST at 7 PM
            let nextSaturday = createISTDate(
                targetComponents.year, 
                targetComponents.month, 
                targetComponents.date, 
                19, 0, 0
            );
            
            // If we've passed this Saturday 7 PM IST, get next Saturday
            if (now.getTime() > nextSaturday.getTime()) {
                // Add 7 days to the target date
                targetDate = new Date(targetComponents.year, targetComponents.month, targetComponents.date + 7);
                targetComponents = getISTComponents(targetDate);
                nextSaturday = createISTDate(
                    targetComponents.year,
                    targetComponents.month,
                    targetComponents.date,
                    19, 0, 0
                );
            }
            
            setNextSpaceDate(nextSaturday);
            
            const diff = nextSaturday.getTime() - now.getTime();
            
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                setCountdown({ days, hours, minutes, seconds });
            } else {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };
        
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        
        return () => clearInterval(interval);
    }, []);
    
    const formatDate = (date: Date): string => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        
        // Get ordinal suffix (st, nd, rd, th)
        const getOrdinalSuffix = (n: number): string => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        
        return `${day}${getOrdinalSuffix(day)} ${month}, ${dayName} 7PM IST`;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            // Reset previous recording and clear text if present
            setAudioBlob(null);
            setRecordingTime(0);
            setShowWarning(false);
            chunksRef.current = [];
            // Clear text when starting to record (user chooses audio over text)
            if (formData.message.trim()) {
                setFormData({ ...formData, message: '' });
            }

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } 
            });
            streamRef.current = stream;

            // Determine supported MIME type
            let mimeType = 'audio/webm';
            if (!MediaRecorder.isTypeSupported('audio/webm')) {
                if (MediaRecorder.isTypeSupported('audio/ogg')) {
                    mimeType = 'audio/ogg';
                } else {
                    mimeType = 'audio/webm'; // Fallback, browser will choose
                }
            }

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType
            });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                setAudioBlob(blob);
                
                // Stop all tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }
            };

            mediaRecorder.start(100); // Collect data every 100ms
            setRecordingState('recording');
            setMicPermissionDenied(false);

            // Start timer
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime((prev) => {
                    const newTime = prev + 1;
                    
                    // Show warning at 50 seconds
                    if (newTime === 50) {
                        setShowWarning(true);
                    }
                    
                    // Auto-stop at 60 seconds
                    if (newTime >= 60) {
                        setTimeout(() => stopRecording(), 0);
                    }
                    
                    return newTime;
                });
            }, 1000);

        } catch (error: any) {
            console.error('Error accessing microphone:', error);
            setMicPermissionDenied(true);
            setRecordingState('idle');
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recordingState === 'recording') {
            mediaRecorderRef.current.stop();
            setRecordingState('stopped');
            
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
            
            setShowWarning(false);
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setRecordingTime(0);
        setRecordingState('idle');
        setShowWarning(false);
        chunksRef.current = [];
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getUTMParameters = () => {
        if (typeof window === 'undefined') return {};
        
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams: any = {};
        
        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        utmKeys.forEach(key => {
            const value = urlParams.get(key);
            if (value) {
                utmParams[key] = value;
            }
        });
        
        return utmParams;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate that either text or audio is provided
        if (!audioBlob && !formData.message.trim()) {
            alert('Please either type a message or record audio');
            return;
        }
        
        // Format selected date
        const dateStr = formData.selectedDate 
            ? formData.selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
            }) + ' at 7 PM'
            : 'Not selected';
        
        // Get UTM parameters
        const utmParams = getUTMParameters();
        
        // Prepare form data for PHP upload endpoint
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('contact', formData.contact);
        formDataToSend.append('date', dateStr);
        
        // Add UTM parameters if present
        Object.keys(utmParams).forEach(key => {
            formDataToSend.append(key, utmParams[key]);
        });
        
        // Handle audio or text message
        if (audioBlob) {
            // Determine file extension based on MIME type
            let extension = 'webm';
            if (audioBlob.type.includes('ogg')) {
                extension = 'ogg';
            } else if (audioBlob.type.includes('mp3') || audioBlob.type.includes('mpeg')) {
                extension = 'mp3';
            } else if (audioBlob.type.includes('wav')) {
                extension = 'wav';
            }
            
            // Create a File object from the Blob
            const audioFile = new File([audioBlob], `recording.${extension}`, {
                type: audioBlob.type,
                lastModified: Date.now()
            });
            
            formDataToSend.append('audio', audioFile);
        } else {
            formDataToSend.append('story', formData.message);
        }
        
        // Send to PHP upload endpoint
        await sendToUploadEndpoint(formDataToSend, {
            name: formData.name,
            contact: formData.contact,
            selectedDate: dateStr,
            hasAudio: !!audioBlob,
            audioDuration: audioBlob ? recordingTime : undefined,
            message: audioBlob ? `[Audio recording - ${formatTime(recordingTime)}]` : formData.message,
            ...utmParams
        });
    };
    
    const sendToUploadEndpoint = async (formData: FormData, payload: any) => {
        try {
            // Get upload endpoint URL from environment variable or use default
            // Use absolute URL to avoid path issues with static exports
            const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 
                (typeof window !== 'undefined' 
                    ? `${window.location.origin}/api/submit.php`
                    : '/api/submit.php');
            
            console.log('Uploading to:', uploadUrl);
            console.log('Form data keys:', Array.from(formData.keys()));
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
                // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
            });
            
            console.log('Response status:', response.status, response.statusText);
            
            // Try to get response text first to see what we're dealing with
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse JSON response:', parseError);
                throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`);
            }
            
            if (!response.ok) {
                const errorMsg = result.error || result.message || `Upload failed: ${response.statusText}`;
                const debugInfo = result.debug ? `\n\nDebug info: ${JSON.stringify(result.debug, null, 2)}` : '';
                throw new Error(errorMsg + debugInfo);
            }
            
            if (!result.success) {
                const errorMsg = result.error || result.message || 'Upload failed';
                const debugInfo = result.debug ? `\n\nDebug info: ${JSON.stringify(result.debug, null, 2)}` : '';
                throw new Error(errorMsg + debugInfo);
            }
            
            // Redirect to thank you page with file information
            redirectToThankYou({
                ...payload,
                audioFile: result.audio_file || null
            });
        } catch (error: any) {
            console.error('Error uploading file:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            // Show detailed error message
            const errorMessage = error.message || 'Please try again';
            alert(`Failed to submit form:\n\n${errorMessage}\n\nPlease check the browser console for more details.`);
            // Optionally still redirect to thank you page even if upload fails
            // redirectToThankYou(payload);
        }
    };
    
    const redirectToThankYou = (payload: any) => {
        const params = new URLSearchParams({
            name: payload.name,
            contact: payload.contact,
            selectedDate: payload.selectedDate,
            message: payload.message || '',
            hasAudio: payload.hasAudio ? 'true' : 'false',
            ...(payload.audioDuration && { audioDuration: payload.audioDuration.toString() }),
            ...(payload.audioFile && { audioFile: payload.audioFile })
        });
        router.push(`/thank-you?${params.toString()}`);
    };

    return (
        <section id="contact" className="contact-form contact-form-section relative px-6 max-w-xl mx-auto z-10">
            <div className="meetup-banner bg-black text-white text-center py-3 px-4 rounded-lg mb-6" style={{ fontFamily: 'var(--font-classyvogue), sans-serif' }}>
                <div className="flex flex-col items-center gap-2">
                    {/* Mobile: Three lines */}
                    <div className="flex flex-col items-center gap-1 sm:hidden">
                        <p className="font-black text-[23px]" style={{ letterSpacing: '0.05em' }}>
                            Next Space in
                        </p>
                        <p className="font-black text-[23px]" style={{ letterSpacing: '0.05em' }}>
                            {countdown.days} {countdown.days === 1 ? 'day' : 'days'} {countdown.hours} {countdown.hours === 1 ? 'hour' : 'hours'}
                        </p>
                        <p className="font-bold text-white text-[21px]">
                            {formatDate(nextSpaceDate)}
                        </p>
                    </div>
                    {/* Desktop: Two lines */}
                    <div className="hidden sm:flex flex-col items-center gap-2">
                        <p className="font-black text-[25px]" style={{ letterSpacing: '0.05em' }}>
                            Next Space in {countdown.days} {countdown.days === 1 ? 'day' : 'days'} and {countdown.hours} {countdown.hours === 1 ? 'hour' : 'hours'}
                        </p>
                        <p className="font-bold text-white text-[23px]">
                            {formatDate(nextSpaceDate)}
                        </p>
                    </div>
                </div>
            </div>
            <div className="text-center text-sm text-gray-600 mb-6">
                7 slots left
            </div>
            <div
                className="contact-form__container contact-form-container frosted-glass rounded-[16px]"
            >
                <div className="text-center" style={{ lineHeight: '1.2' }}>
                    <h3 className="contact-form__title contact-form-title" style={{ marginBottom: '4px' }}>Join Your Space</h3>
                    <p style={{ fontFamily: 'var(--font-classyvogue), sans-serif', fontSize: '20px', letterSpacing: '0.05em', marginTop: '0' }}>(Online)</p>
                </div>
                <form className="contact-form__form space-y-3" onSubmit={handleSubmit}>
                    <div className="contact-form__field space-y-1">
                        <label className="contact-form__label contact-form-label">Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="contact-form__input contact-form-input w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500"
                            placeholder="Your name"
                        />
                    </div>

                    <div className="contact-form__field space-y-1">
                        <label className="contact-form__label contact-form-label">Contact</label>
                        <input
                            type="tel"
                            required
                            value={formData.contact}
                            onChange={(e) => {
                                // Only allow numbers, spaces, +, -, and parentheses
                                const value = e.target.value.replace(/[^\d\s\+\-\(\)]/g, '');
                                setFormData({ ...formData, contact: value });
                            }}
                            className="contact-form__input contact-form-input w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500"
                            placeholder="Phone number"
                        />
                    </div>

                    <div className="contact-form__field space-y-1">
                        <label className="contact-form__label contact-form-label">Select your date</label>
                        {isMounted ? (
                            <div className="react-datepicker-wrapper">
                                <DatePicker
                                    selected={formData.selectedDate}
                                    onChange={(date: Date | null) => {
                                        if (date) {
                                            // Ensure time is set to 7 PM
                                            date.setHours(19, 0, 0, 0);
                                        }
                                        setFormData({ ...formData, selectedDate: date });
                                    }}
                                    filterDate={(date: Date) => {
                                        // Only allow Saturdays (day 6) and dates in the future
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return date.getDay() === 6 && date >= today;
                                    }}
                                    minDate={new Date()}
                                    maxDate={(() => {
                                        const maxDate = new Date();
                                        maxDate.setDate(maxDate.getDate() + (8 * 7)); // 8 weeks from today
                                        return maxDate;
                                    })()}
                                    dateFormat="EEEE, MMM d, h:mm aa"
                                    placeholderText="Select a Saturday"
                                    className="contact-form__input contact-form-input w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500"
                                    calendarClassName="saturday-date-picker"
                                    dayClassName={(date: Date) => {
                                        const isSaturday = date.getDay() === 6;
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const isPast = date < today;
                                        
                                        if (isPast) {
                                            return 'react-datepicker__day--disabled';
                                        }
                                        if (isSaturday) {
                                            return 'saturday-day';
                                        }
                                        return 'disabled-day';
                                    }}
                                    showPopperArrow={false}
                                    required
                                    withPortal={false}
                                />
                            </div>
                        ) : (
                            <input
                                readOnly
                                required
                                className="contact-form__input contact-form-input w-full px-3 py-2 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500"
                                value=""
                                placeholder="Select a Saturday"
                            />
                        )}
                    </div>

                    <div className="contact-form__field space-y-1">
                        <label className="contact-form__label contact-form-label">What brought you here</label>
                        <div className="relative">
                            <textarea
                                rows={3}
                                required={!audioBlob}
                                value={formData.message}
                                onChange={(e) => {
                                    setFormData({ ...formData, message: e.target.value });
                                    // If user types, clear audio recording
                                    if (e.target.value.trim() && audioBlob) {
                                        resetRecording();
                                    }
                                }}
                                className="contact-form__textarea contact-form-textarea w-full px-3 py-2 pr-12 rounded-[12px] frosted-glass border-2 border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-gray-500 resize-none"
                                placeholder={audioBlob ? "" : ""}
                                disabled={recordingState === 'recording'}
                            />
                            {mediaRecorderSupported && (
                                <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
                                    {recordingState === 'recording' && (
                                        <div className="text-xs font-bold text-red-600">
                                            {formatTime(recordingTime)}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (recordingState === 'idle') {
                                                startRecording();
                                            } else if (recordingState === 'recording') {
                                                stopRecording();
                                            } else if (recordingState === 'stopped') {
                                                resetRecording();
                                            }
                                        }}
                                        disabled={micPermissionDenied || (recordingState === 'recording' && recordingTime >= 60)}
                                        className={`contact-form__mic-button p-2 rounded-full transition-all ${
                                            recordingState === 'recording'
                                                ? 'bg-red-500 text-white animate-pulse'
                                                : recordingState === 'stopped'
                                                ? 'bg-gray-400 text-white'
                                                : micPermissionDenied
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                        }`}
                                        title={
                                            micPermissionDenied
                                                ? 'Microphone access denied'
                                                : recordingState === 'recording'
                                                ? 'Stop recording'
                                                : recordingState === 'stopped'
                                                ? 'Re-record'
                                                : 'Start recording'
                                        }
                                    >
                                        {micPermissionDenied ? (
                                            <MicOff size={20} />
                                        ) : (
                                            <Mic size={20} />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                        {showWarning && recordingState === 'recording' && (
                            <div className="text-xs text-orange-600 font-semibold animate-pulse">
                                ⚠️ 10 seconds remaining
                            </div>
                        )}
                        {recordingState === 'stopped' && audioBlob && (
                            <div className="flex items-center justify-between text-xs text-green-600 font-semibold">
                                <span>✓ Audio recorded ({formatTime(recordingTime)})</span>
                                <button
                                    type="button"
                                    onClick={resetRecording}
                                    className="text-red-600 hover:text-red-800 underline"
                                >
                                    Delete & re-record
                                </button>
                            </div>
                        )}
                        {micPermissionDenied && (
                            <div className="text-xs text-red-600 font-semibold">
                                Microphone access denied. Please allow microphone access to record audio.
                            </div>
                        )}
                    </div>

                    <motion.button
                        whileHover={{
                            y: -4,
                            scale: 1.02,
                            boxShadow: "12px 12px 24px rgba(0, 0, 0, 0.25), -6px -6px 16px rgba(0, 0, 0, 0.15)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="contact-form__submit contact-form-submit w-full font-black py-3 rounded-[12px] transition-all mt-2"
                    >
                        Send
                    </motion.button>
                </form>
            </div>
            
            <div className="flex flex-row flex-wrap justify-center gap-4 text-xs text-gray-600 mt-4">
                <div className="flex items-center gap-2">
                    <Lock size={14} className="flex-shrink-0" />
                    <span>Private & confidential</span>
                </div>
                <div className="flex items-center gap-2">
                    <Heart size={14} className="flex-shrink-0" />
                    <span>No pressure, no commitment</span>
                </div>
                <div className="flex items-center gap-2">
                    <Shield size={14} className="flex-shrink-0" />
                    <span>Safe space for survivors</span>
                </div>
            </div>
        </section>
    );
}
