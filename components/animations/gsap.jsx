// components/GsapGlobalInitializer.js
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';


gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin);

export default function GsapEl() {
    const pathname = usePathname();

    useEffect(() => {
        // 1. Kill any prior ScrollTriggers or Smoothers on page change
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        const oldSmoother = ScrollSmoother.get();
        if (oldSmoother) oldSmoother.kill();

        // 2. Initialize GSAP's Native Smooth Scroll using global IDs
        ScrollSmoother.create({
            wrapper: '#smooth-wrapper',
            content: '#smooth-content',
            smooth: 1.5,               // How long it takes to "catch up" to the scroll behavior
            effects: true,             // Enables data-speed attributes automatically
            normalizeScroll: true,     // Keeps behavior identical across devices/trackpads
        });

        const targets = gsap.utils.toArray('[class*="gsap-fade-"]:not(.gsap-fade-away)');
        targets.forEach((target) => {

            // Read data-speed attribute; default to 1 (0.8s duration)
            const speedAttr = target.getAttribute('fade-data-speed');
            const speedMultiplier = speedAttr ? parseFloat(speedAttr) : 1;
            const baseDuration = 0.8;
            const duration = baseDuration / speedMultiplier;
            const startAttr = target.getAttribute('fade-data-start');
            const start = startAttr ? startAttr : '85%';

            // gsap-fade-up, gsap-fade-down, gsap-fade-left, gsap-fade-right, gsap-fade-zoom
            const directionAttr = target.getAttribute('class').match(/gsap-fade-(up|down|left|right|zoom)/);
            const direction = directionAttr ? directionAttr[1] : 'up';

            // gsap-fade-up-90
            const levelAttr = target.getAttribute('class').match(/gsap-fade-(up|down|left|right|zoom)-(\d+)/);
            const level = levelAttr ? parseInt(levelAttr[2], 10) : 10;

            let startConfig = { opacity: 0, x: 0, y: 5, scale: 1 };
            let endConfig = { opacity: 1, x: 0, y: 0, scale: 1, duration };

            if (direction === 'up') {
                startConfig.y = level;
            } else if (direction === 'down') {
                startConfig.y = -level;
            } else if (direction === 'left') {
                startConfig.x = level;
            } else if (direction === 'right') {
                startConfig.x = -level;
            }

            // endConfig.scrollTrigger = {
            //     trigger: target,
            //     start: `top 85%`,
            //     toggleActions: 'play none none reverse',
            // };
            gsap.fromTo(target, startConfig, endConfig);
        });


        const blurTargets = gsap.utils.toArray('[class*="gsap-blur"]');
        blurTargets.forEach((target) => {
            let startConfig = { filter: 'blur(8px)', opacity: 0 };

            // Read data-speed attribute; default to 1 (0.8s duration)
            const speedAttr = target.getAttribute('blur-data-speed');
            const speedMultiplier = speedAttr ? parseFloat(speedAttr) : 1;
            const baseDuration = 0.8;
            const duration = baseDuration / speedMultiplier;

            let endConfig = { filter: 'blur(0px)', opacity: 1, duration };

            endConfig.scrollTrigger = {
                trigger: target,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            };

            gsap.fromTo(target, startConfig, endConfig);
        });



        const crossfadeScenes = gsap.utils.toArray('.gsap-bg-crossfade');
        crossfadeScenes.forEach((scene) => {
            const img1 = scene.querySelector('.gsap-image-1');
            const img2 = scene.querySelector('.gsap-image-2');
            const section1 = scene.querySelector('.section-1');
            const section2 = scene.querySelector('.section-2');

            if (img1 && section2) {
                // Create a scroll timeline connecting the visual changes directly to the scrollbar
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section2,      // Start the transition when Section 2 enters the window
                        start: 'top bottom',    // When top of Section 2 hits the bottom of the viewport
                        end: 'top top',        // Complete when Section 2 fills up the viewport completely
                        scrub: true,            // Smoothly tracks the scroll progress
                    }
                });

                // Step 1: Fade out image 1
                tl.to(img1, { opacity: 0, ease: 'none' }, 0);

                // Step 2: Fade in image 2 at the exact same time
                // tl.to(img2, { opacity: 1, ease: 'none' }, 0);
            }
        });


        const stackScenes = gsap.utils.toArray('.gsap-stack-wrapper');
        stackScenes.forEach((wrapper) => {
            const s1 = wrapper.querySelector('.section-1');
            const s2 = wrapper.querySelector('.section-2');
            const img1 = wrapper.querySelector('.img-panel-1');
            const img2 = wrapper.querySelector('.img-panel-2');

            if (s1 && s2) {
                // Pin Section 1 in place while Section 2 crawls up over it
                ScrollTrigger.create({
                    trigger: s1,
                    start: 'top top',
                    end: '+=100%', // Keeps it locked for exactly one full screen height of scrolling
                    pin: true,
                    pinSpacing: false, // Allows Section 2 to naturally overlap the pinned space
                    scrub: true,
                });

                // Create the background image structural transition
                const panelTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: s2,
                        start: 'top bottom', // Start animating as soon as Section 2 approaches the screen bottom
                        end: 'top top',     // Complete right when Section 2 fills the screen
                        scrub: 1,           // Adds a smooth inertia catch-up delay
                    }
                });

                // 1. Shrink Section 1's background image slightly inward (Framer card scale effect)
                panelTimeline.to(img1, {
                    scale: 0.92,
                    opacity: 0.4,
                    ease: 'power1.inOut'
                }, 0);

                // 2. Introduce Section 2's background image with a subtle zoom-out reveal
                panelTimeline.fromTo(img2,
                    { scale: 1.15 },
                    { scale: 1, ease: 'power1.out' },
                    0
                );
            }
        });



        const stickyCounter = document.querySelector('.gsap-sticky-counter');
        if (stickyCounter) {
            const display  = stickyCounter.querySelector('.gsap-sticky-counter-display');
            const digits   = stickyCounter.querySelectorAll('.gsap-counter-digit');
            const contents = stickyCounter.querySelectorAll('.gsap-counter-content');
            let current    = -1;

            const activate = (index) => {
                if (index === current) return;
                current = index;
                digits.forEach((d, i)   => gsap.to(d, { opacity: i === index ? 1 : 0, duration: 0.3, ease: 'power2.out' }));
                contents.forEach((c, i) => gsap.to(c, { opacity: i === index ? 1 : 0, y: i === index ? 0 : 10, duration: 0.35, ease: 'power2.out' }));
            };

            ScrollTrigger.create({
                trigger: stickyCounter,
                start: 'top top',
                end: 'bottom bottom',
                pin: display,
                pinSpacing: false,
                onUpdate: (self) => activate(Math.min(3, Math.floor(self.progress * 4))),
            });
        }

        // .gsap-word-reveal: plain class usage — split innerHTML into words first
        gsap.utils.toArray('.gsap-word-reveal').forEach((el) => {
            const text = el.innerText;
            el.innerHTML = text.split(' ').map(
                (word, i) => `<span class="gsap-word-reveal-word" data-word-index="${i}" style="opacity:0.15;display:inline-block;margin-right:0.3em;transition:opacity 0.15s ease">${word}</span>`
            ).join('');
        });

        // .gsap-word-reveal-word: group by parent, drive reveal strictly from scroll progress
        const revealParents = new Set(
            gsap.utils.toArray('.gsap-word-reveal-word').map(w => w.parentElement)
        );

        revealParents.forEach((parent) => {
            const words = parent.querySelectorAll('.gsap-word-reveal-word');
            const total = words.length;

            ScrollTrigger.create({
                trigger: parent,
                start: 'top 85%',
                end: '+=400',
                scrub: true,
                onUpdate: (self) => {
                    words.forEach((word, i) => {
                        word.style.opacity = self.progress >= i / total ? 1 : 0.15;
                    });
                },
            });
        });

        const morphScenes = gsap.utils.toArray('.gsap-morph-scene');
        morphScenes.forEach((scene) => {
            // Target the container to pin, and the inner components
            const pinContainer = scene.querySelector('.gsap-morph-scene-container');
            const displacementMap = document.querySelector('.gsap-morph-filter feDisplacementMap');
            const img1 = scene.querySelector('.gsap-morph-1');
            const img2 = scene.querySelector('.gsap-morph-2');
            const text1 = scene.querySelector('.gsap-morph-text-1');
            const text2 = scene.querySelector('.gsap-morph-text-2');
            const text3 = scene.querySelector('.gsap-morph-text-3');
            const fadeAway = scene.querySelectorAll('.gsap-fade-away');

            if (img1 && img2 && text1 && text2 && text3) {
                // Keep initial visibility deterministic across refreshes.
                gsap.set([img1, text1], { opacity: 1 });
                gsap.set([img2, text2, text3], { opacity: 0 });
                if (fadeAway.length) gsap.set(fadeAway, { opacity: 1 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: scene,
                        // start: 'top top',
                        // end: 'bottom bottom',
                        scrub: true,
                        pin: true, // Pins the scene in place while scrolling through the timeline
                        pinSpacing: true // Pushes down subsequent content until the animation finishes
                    }
                });

                // ==========================================
                // PHASE 1: Morph Img 1 into Img 2 (0.0s to 1.0s)
                // ==========================================
                // Distort filter (optional — skip if SVG filter absent)
                if (displacementMap) tl.to(displacementMap, { attr: { scale: 120 }, ease: 'power1.in', duration: 0.5 }, 0);

                // Crossfade images
                tl.to(img1, { opacity: 0, ease: 'none', duration: 0.5 }, 0);
                tl.to(img2, { opacity: 1, ease: 'none', duration: 0.5 }, 0);
                tl.to(text1, { opacity: 0, ease: 'none', duration: 0.45 }, 0);
                if (fadeAway.length) tl.to(fadeAway, { opacity: 0, ease: 'none', duration: 0.3 }, 0);
                tl.to(text2, { opacity: 1, ease: 'none', duration: 0.45 }, 0.05);

                // Calm filter down onto Image 2
                if (displacementMap) tl.to(displacementMap, { attr: { scale: 0 }, ease: 'power1.out', duration: 0.5 }, 0.5);


                // ==========================================
                // PHASE 2: Liquid Morph Img 2 out to Transparent (1.0s to 2.0s)
                // ==========================================
                // Distort filter again to break apart Image 2
                if (displacementMap) tl.to(displacementMap, { attr: { scale: 120 }, ease: 'power1.in', duration: 0.5 }, 1.0);

                // Melt Image 2 away to completely transparent
                tl.to(img2, { opacity: 0, ease: 'none', duration: 0.5 }, 1.0);
                tl.to(text2, { opacity: 0, ease: 'none', duration: 0.35 }, 1.0);
                tl.to(text3, { opacity: 1, ease: 'none', duration: 0.35 }, 1.15);

                // Bring filter scale back down to 0 so the underlying layout stays clean
                if (displacementMap) tl.to(displacementMap, { attr: { scale: 0 }, ease: 'power1.out', duration: 0.5 }, 1.5);
                tl.to(text3, { opacity: 0, ease: 'none', duration: 0.5 }, 1.5);

                // // Draw path across full scroll duration
                // if (drawPath) {
                //     gsap.set(drawPath, { drawSVG: '0%' });
                //     tl.to(drawPath, { drawSVG: '100%', ease: 'none', duration: 2 }, 0);
                // }
            }
        });


        const drawPaths = gsap.utils.toArray('.gsap-draw-path');
        drawPaths.forEach((drawPath) => {

            // .gsap-draw-path-20-to-80
            const startAttr = drawPath.getAttribute('class').match(/gsap-draw-path-(\d+)-to-(\d+)/);
            let startPercent = 0;
            let endPercent = 100;
            if (startAttr) {
                startPercent = parseInt(startAttr[1], 10);
                endPercent = parseInt(startAttr[2], 10);
            }

            // gsap-top-20 , gsap-bottom-80
            let topAttr = 10;
            let bottomAttr = 90;
            if (drawPath.getAttribute('class').match(/gsap-top-(\d+)/)) {
                topAttr = parseInt(drawPath.getAttribute('class').match(/gsap-top-(\d+)/)[1], 10);
                topAttr = Math.min(Math.max(topAttr, 0), 100); // Clamp between 0 and 100
            }
            if (drawPath.getAttribute('class').match(/gsap-bottom-(\d+)/)) {
                bottomAttr = parseInt(drawPath.getAttribute('class').match(/gsap-bottom-(\d+)/)[1], 10);
                bottomAttr = Math.min(Math.max(bottomAttr, 0), 100); // Clamp between 0 and 100
            }
            gsap.set(drawPath, { drawSVG: `${startPercent}%` });
            gsap.to(drawPath, {
                drawSVG: `${endPercent}%`,
                scrollTrigger: {
                    trigger: drawPath,
                    start: `top ${topAttr}%`,
                    end: `bottom ${bottomAttr}%`,
                    scrub: true, // Smoothly tracks the scroll progress
                }
            });
        });


    }, [pathname]);

    return null;
}