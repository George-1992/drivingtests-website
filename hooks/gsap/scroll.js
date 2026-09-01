// hooks/useScrollFade.js
'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollFade(containerRef) {
    useGSAP(() => {
        // Target any element with the class '.animate-fade-in' inside the container
        const targets = gsap.utils.toArray('.animate-fade-in');

        targets.forEach((target) => {
            gsap.fromTo(target,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: target,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse', // Resets when scrolling back up
                    }
                }
            );
        });
    }, { scope: containerRef }); // Crucial: restricts GSAP to only search inside this component
}