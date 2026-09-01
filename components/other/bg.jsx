import Image from "next/image"
import { div } from "three/tsl"

export default function BgEl({ variant = 1, className = "" }) {



    if (variant === 2) {
        return (
            <div className={`${className} `}>
                {/* Right Masked Noise Texture (Darker Dots) Background */}
                <div
                    className="absolute inset-0 z-0 "
                    style={{
                        // background: "#ffffff",
                        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)",
                        backgroundSize: "20px 20px",
                        WebkitMaskImage:
                            "linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)",
                        maskImage:
                            "linear-gradient(to right, #000 0%, #000 50%, transparent 20%, transparent 100%)",
                    }}
                />
            </div>
        )
    } else if (variant === 3) {

        return (
            <div className={`${className}`}>
                {/* Crosshatch Art - Light Pattern */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `
        repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
      `,
                    }}
                />
            </div>
        )
    } else if (variant === 4) {

        return (
            <div className={`${className}`}>
                {/* Warm Beige Texture */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(120,119,198,0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120,119,198,0.1) 0%, transparent 50%)`,
                    }}
                />
            </div>
        )
    } else if (variant === 5) {
        return (
            <div className={`${className}`}>
                {/* Ember Glow Background */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.6) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.3) 0%, transparent 80%)
        `,
                    }}
                />
            </div>
        )
    } else if (variant === 6) {

        return (

            <div className={`${className}`}>
                {/* Striped Dark */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background:
                            "repeating-linear-gradient(45deg, #000 0px, #111 2px, #000 4px, #222 6px)",
                    }}
                />

                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        backdropFilter: "blur(45px) grayscale(20%)",
                        WebkitBackdropFilter: "blur(45px) grayscale(20%)",
                    }}
                />
            </div>

        )
    } else if (variant === 7) {

        return (
            <div className={`${className}`}>
                <svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 200 200'><rect fill='#ffffff' width='200' height='200' /><defs><linearGradient id='a' gradientUnits='userSpaceOnUse' x1='88' y1='88' x2='0' y2='0'><stop offset='0' stop-color='#868686' /><stop offset='1' stop-color='#dfdfdf' /></linearGradient><linearGradient id='b' gradientUnits='userSpaceOnUse' x1='75' y1='76' x2='168' y2='160'><stop offset='0' stop-color='#868686' /><stop offset='0.09' stop-color='#ababab' /><stop offset='0.18' stop-color='#c4c4c4' /><stop offset='0.31' stop-color='#d7d7d7' /><stop offset='0.44' stop-color='#e5e5e5' /><stop offset='0.59' stop-color='#f1f1f1' /><stop offset='0.75' stop-color='#f9f9f9' /><stop offset='1' stop-color='#FFFFFF' /></linearGradient><filter id='c' x='0' y='0' width='200%' height='200%'><feGaussianBlur in='SourceGraphic' stdDeviation='12' /></filter></defs><polygon fill='url(#a)' points='0 174 0 0 174 0' /><path fill='#000' fillOpacity='.5' filter='url(#c)' d='M121.8 174C59.2 153.1 0 174 0 174s63.5-73.8 87-94c24.4-20.9 87-80 87-80S107.9 104.4 121.8 174z' /><path fill='url(#b)' d='M142.7 142.7C59.2 142.7 0 174 0 174s42-66.3 74.9-99.3S174 0 174 0S142.7 62.6 142.7 142.7z' /></svg>
            </div>
        )
    } else if (variant === 8) {

        return (
            <div className={`${className}`}>
                <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 1600 800' preserveAspectRatio='none'><rect fill='#3D3732' width='1600' height='800' /><g fillOpacity='1'><polygon fill='#534539' points='1600 160 0 460 0 350 1600 50' /><polygon fill='#695440' points='1600 260 0 560 0 450 1600 150' /><polygon fill='#7e6246' points='1600 360 0 660 0 550 1600 250' /><polygon fill='#94714d' points='1600 460 0 760 0 650 1600 350' /><polygon fill='#AA7F54' points='1600 800 0 800 0 750 1600 450' /></g></svg>
            </div>
        )
    } else if (variant === 9) {
        return (
            <div className={`${className}`}>
                <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 1600 800' preserveAspectRatio='none'><rect fill='#1D2B02' width='1600' height='800' /><g fillOpacity='1'><polygon fill='#173c14' points='1600 160 0 460 0 350 1600 50' /><polygon fill='#114e26' points='1600 260 0 560 0 450 1600 150' /><polygon fill='#0c5f39' points='1600 360 0 660 0 550 1600 250' /><polygon fill='#06714b' points='1600 460 0 760 0 650 1600 350' /><polygon fill='#00825D' points='1600 800 0 800 0 750 1600 450' /></g></svg>
            </div>
        )
    } else if (variant === 10) {

        return (
            <div
                className={`${className}`}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    // zIndex: -1,
                    pointerEvents: 'none'
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="mesh-gradient"
                    width="100%"
                    height="100%"
                    viewBox="0 0 1920 1080"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        {/* Expanded filter bounds to ensure deep blur smoothly reaches edges on large viewports */}
                        <filter id="blur" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="300" />
                        </filter>

                        {/* HIGH-RES NOISE: Calibrated for fine grain texture at 1080p/4K resolutions */}
                        <filter id="high-res-noise" x="0" y="0" width="100%" height="100%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.95" octaves="4" result="turbulence" stitchTiles="stitch" />
                            <feBlend in="SourceGraphic" in2="turbulence" mode="overlay" />
                        </filter>
                    </defs>

                    <rect id="background" width="100%" height="100%" fill="#FFFFFF" />

                    {/* Scaled up shape coordinates mapping perfectly to a 1920x1080 native coordinate space */}
                    <g id="swatches" filter="url(#blur)">
                        <rect x="200" y="300" width="1000" height="900" className="fill-[#8a9085]" />
                        <rect x="-1360" y="-475" width="3840" height="1380" className="fill-[#ced4c9]" />
                        <rect x="-250" y="650" width="800" height="600" className="fill-[#d6621f]" />
                        <rect x="-100" y="-1000" width="3600" height="2500" className="fill-[#e7e4e0]" />
                    </g>

                    {/* High-resolution grain overlay preserving your exact layout styling */}
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        style={{
                            mixBlendMode: 'overlay',
                            filter: 'url(#high-res-noise)',
                            opacity: '75%'
                        }}
                    />
                </svg>
            </div>
        )
    }

    return (
        <div className={`${className}`}>
            {/* Radial Gradient Background from Bottom */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #7c3aed 100%)",
                }}
            />
        </div>
    );
}