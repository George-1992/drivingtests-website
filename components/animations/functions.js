export const breakTextFade = (texts = []) => {
    const items = Array.isArray(texts) ? texts : [texts];
    let globalWordIndex = 0;

    return items.flatMap((item, itemIndex) => {
        const config = typeof item === 'string' ? { text: item } : (item || {});
        const text = (config.text || '').trim();
        if (!text) return [];

        const className = config.className || '';
        const fadeClass = config.fadeClass || 'gsap-fade-up-30';
        const blurClass = config.withBlur === false ? '' : 'gsap-blur';

        const words = text.split(/\s+/);

        const animatedWords = words.map((word, wordIndex) => {
            const localIndex = globalWordIndex + wordIndex;
            const fadeSpeed = Math.max(0.20, 0.5 - 0.03 * localIndex);
            const blurSpeed = Math.max(0.20, 0.5 - 0.03 * localIndex);

            return (
                <span
                    key={`w-${itemIndex}-${wordIndex}`}
                    className={`inline-block mr-3 ${fadeClass} ${blurClass} ${className}`.trim()}
                    fade-data-speed={fadeSpeed}
                    blur-data-speed={blurSpeed}
                >
                    {word}
                </span>
            );
        });

        globalWordIndex += words.length;

        if (itemIndex === items.length - 1) {
            return animatedWords;
        }

        return [...animatedWords, <br key={`br-${itemIndex}`} />];
    });
};

export const wordReveal = (texts = [], { className = '' } = {}) => {
    const items = Array.isArray(texts) ? texts : [texts];
    let globalWordIndex = 0;

    return items.flatMap((item, itemIndex) => {
        const config = typeof item === 'string' ? { text: item } : (item || {});
        const text = (config.text || '').trim();
        if (!text) return [];

        const extraClass = config.className || className;

        const words = text.split(/\s+/).map((word, wordIndex) => (
            <span
                key={`wr-${itemIndex}-${wordIndex}`}
                className={`gsap-word-reveal-word inline-block mr-[0.3em] ${extraClass}`.trim()}
                style={{ opacity: 0.15, transition: 'opacity 0.15s ease' }}
                data-word-index={globalWordIndex + wordIndex}
            >
                {word}
            </span>
        ));

        globalWordIndex += words.length;

        if (itemIndex === items.length - 1) return words;
        return [...words, <br key={`br-${itemIndex}`} />];
    });
};