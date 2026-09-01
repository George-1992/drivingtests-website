export default function Grid({ }) {


    return (
        <div className="min-h-screen w-full bg-[#dbdac1] absolute inset-0 -z-10 overflow-hidden opacity-30">
            {/* Morning Haze */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(253, 224, 71, 0.4) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(251, 191, 36, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.5) 0%, transparent 80%)
        `,
                }}
            />
        </div>
    )


    return (
        <div className="min-h-screen w-full bg-[#dbdac1] absolute inset-0 -z-10 overflow-hidden opacity-30">
            {/* Emerald Glow Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #dbdac1 100%)
      `,
                    backgroundSize: "100% 100%",
                }}
            />
            {/* Your Content/Components */}
        </div>
    )


    return (
        <div className="min-h-screen w-full bg-[#f8fafc] absolute inset-0 -z-10 overflow-hidden opacity-60">
            {/* Top Fade Grid Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
                    backgroundSize: "30px 30px",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                    maskImage:
                        "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                }}
            />
            {/* Your Content/Components */}
        </div>
    );
}