'use client';
import { useEffect, useRef } from 'react';

 
const VARIANT_CONFIGS = {
    v1: {
        colors: [
            {
                color: '#FF5373',
                enabled: true,
            },
            {
                color: '#FFC858',
                enabled: true,
            },
            {
                color: '#17E7FF',
                enabled: true,
            },
            {
                color: '#6D3BFF',
                enabled: true,
            },
            {
                color: '#f5e1e5',
                enabled: false,
            },
            {
                color: '#A8E6CF',
                enabled: false,
            },
        ],
        speed: 2,
        horizontalPressure: 2,
        verticalPressure: 5,
        waveFrequencyX: 2,
        waveFrequencyY: 2,
        waveAmplitude: 5,
        shadows: 10,
        highlights: 8,
        colorBrightness: 1,
        colorSaturation: 10,
        wireframe: true,
        colorBlending: 6,
        backgroundColor: '#003FFF',
        backgroundAlpha: 1,
        grainScale: 0,
        grainSparsity: 0,
        grainIntensity: 0,
        grainSpeed: 0,
        resolution: 0.95,
        yOffset: 7289.85693359375,
        yOffsetWaveMultiplier: 3.5,
        yOffsetColorMultiplier: 3.5,
        yOffsetFlowMultiplier: 3.5,
        flowDistortionA: 1.2,
        flowDistortionB: 2.4,
        flowScale: 1.5,
        flowEase: 0.41,
        flowEnabled: false,
        enableProceduralTexture: false,
        textureVoidLikelihood: 0.06,
        textureVoidWidthMin: 10,
        textureVoidWidthMax: 500,
        textureBandDensity: 0.8,
        textureColorBlending: 0.06,
        textureSeed: 333,
        textureEase: 0.6,
        proceduralBackgroundColor: '#FFED00',
        textureShapeTriangles: 20,
        textureShapeCircles: 15,
        textureShapeBars: 15,
        textureShapeSquiggles: 10,
        domainWarpEnabled: false,
        domainWarpIntensity: 0,
        domainWarpScale: 3,
        vignetteIntensity: 0,
        vignetteRadius: 0.8,
        fresnelEnabled: false,
        fresnelPower: 2,
        fresnelIntensity: 0.5,
        fresnelColor: '#FFFFFF',
        iridescenceEnabled: false,
        iridescenceIntensity: 0.5,
        iridescenceSpeed: 1,
        bloomIntensity: 0,
        bloomThreshold: 0.7,
        chromaticAberration: 0,
    },
    v2: {
        colors: [
            {
                color: '#E3D1E6',
                enabled: true,
            },
            {
                color: '#ffc8dd',
                enabled: true,
            },
            {
                color: '#ffafcc',
                enabled: true,
            },
            {
                color: '#C5E2FF',
                enabled: true,
            },
            {
                color: '#00B3FF',
                enabled: false,
            },
        ],
        speed: 4.5,
        horizontalPressure: 6,
        verticalPressure: 6,
        waveFrequencyX: 3,
        waveFrequencyY: 3,
        waveAmplitude: 3,
        shadows: 2,
        highlights: 3,
        colorBrightness: 1,
        colorSaturation: -4,
        wireframe: true,
        colorBlending: 6,
        backgroundColor: '#FF9D9D',
        backgroundAlpha: 1,
        grainScale: 0,
        grainSparsity: 0,
        grainIntensity: 0,
        grainSpeed: 0,
        resolution: 0.4,
        yOffset: 7289.85693359375,
        yOffsetWaveMultiplier: 10.9,
        yOffsetColorMultiplier: 3.8,
        yOffsetFlowMultiplier: 6.2,
        flowDistortionA: 2.8,
        flowDistortionB: 2.4,
        flowScale: 1.5,
        flowEase: 0.41,
        flowEnabled: false,
        enableProceduralTexture: false,
        textureVoidLikelihood: 0.06,
        textureVoidWidthMin: 10,
        textureVoidWidthMax: 500,
        textureBandDensity: 0.8,
        textureColorBlending: 0.06,
        textureSeed: 333,
        textureEase: 0.72,
        proceduralBackgroundColor: '#FFED00',
        textureShapeTriangles: 20,
        textureShapeCircles: 15,
        textureShapeBars: 15,
        textureShapeSquiggles: 10,
        domainWarpEnabled: false,
        domainWarpIntensity: 0,
        domainWarpScale: 3,
        vignetteIntensity: 0.3,
        vignetteRadius: 0.6,
        fresnelEnabled: true,
        fresnelPower: 2,
        fresnelIntensity: 0.2,
        fresnelColor: '#FF0000',
        iridescenceEnabled: false,
        iridescenceIntensity: 0.8,
        iridescenceSpeed: 1,
        bloomIntensity: 0.4,
        bloomThreshold: 0.7,
        chromaticAberration: 9,
    },
};

export default function NeatEl({ className = '', variant = 'v1' }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return undefined;
        const selectedConfig = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.v1;

        // const gradient = new NeatGradient({
        //     ref: canvasRef.current,
        //     ...selectedConfig,
        // });

        const gradient = {}

        const onScroll = () => {
            gradient.yOffset = window.scrollY;
        };

        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (typeof gradient?.destroy === 'function') {
                gradient.destroy();
            }
        };
    }, [variant]);

    return null;
    return (
        <div className={className}>
            <canvas
                id="gradient"
                ref={canvasRef}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}