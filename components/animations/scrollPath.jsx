'use client';

export default function ScrollPath({ glowNum = 8, path = '1', color = 'white', top = '10', bottom = '0' }) {

    const path1 = 'M 567 -40 C 418 75 250 350 650 350 C 950 350 1050 200 889 217 C 787 225 575 292 646 480 C 692 606 793 636 653 761';
    // Starts +10px shifted right, ends shifted left to create the crossover effect
    const path2 = 'M 577 -40 C 428 75 260 350 660 350 C 960 350 1060 200 899 217 C 797 225 585 292 656 480 C 682 606 773 636 633 761';

    const path3 = 'M 500 0 C 381 101 637 143 500 317 C 350 480 630 466 500 600 C 493 610.6667 486 621.3333 503 631 C 650 720 350 720 506 808 C 536 828 449 888 500 1000';

    let thePath = path;
    if (thePath === '1') {
        thePath = path1;
    } else if (thePath === '2') {
        thePath = path2;
    } else if (thePath === '3') {
        thePath = path3;
    }

    return (
        <svg
            className="absolute inset-0 w-full h-full z-20 pointer-events-none"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="path-glow">
                    <feGaussianBlur stdDeviation={glowNum} result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                className={`gsap-draw-path gsap-top-${top} gsap-bottom-${bottom}`}
                d={thePath}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#path-glow)"
            />
        </svg>
    );
}