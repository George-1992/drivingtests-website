export default function WaveText({ text, className }) {
    const letters = text.split('');

    return (
        <div className={className}>
            {letters.map((letter, index) => (
                <span
                    key={index}
                    className="inline-block wave-letter"
                    style={{
                        '--wave-delay': `${index * 0.05}s`
                    }}
                >
                    {letter === ' ' ? '\u00A0' : letter}
                </span>
            ))}
        </div>
    );
}
