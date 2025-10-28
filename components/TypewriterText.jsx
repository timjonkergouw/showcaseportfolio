"use client";

import { useEffect, useRef, useState } from 'react';

const TypewriterText = ({ text, className = '', speed = 50, startDelay = 0, showCursor = true }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [started, setStarted] = useState(startDelay === 0);
    const completedRef = useRef(false);

    // Start after optional delay
    useEffect(() => {
        if (started) return;
        const t = setTimeout(() => setStarted(true), startDelay);
        return () => clearTimeout(t);
    }, [started, startDelay]);

    // Typing effect
    useEffect(() => {
        if (!started) return;
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(text.substring(0, currentIndex + 1));
                setCurrentIndex(currentIndex + 1);
            }, speed);
            return () => clearTimeout(timeout);
        } else if (!completedRef.current) {
            completedRef.current = true;
        }
    }, [started, currentIndex, text, speed]);

    const isCompleted = currentIndex >= text.length;

    return (
        <span className={className}>
            {displayedText}
            {showCursor && !isCompleted ? <span className="animate-pulse">|</span> : null}
        </span>
    );
};

export default TypewriterText;

