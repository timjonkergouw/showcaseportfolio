import React from 'react';

export type TypewriterTextProps = {
    text: string;
    className?: string;
    speed?: number;
    startDelay?: number;
    showCursor?: boolean;
    onComplete?: () => void;
};

export default function TypewriterText(props: TypewriterTextProps): React.JSX.Element;


