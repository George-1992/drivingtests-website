import Image from "next/image";

export default function Card2({
    variant = 'default',
    title = 'Card Title',
    subtitle = 'Card Subtitle',
    description = 'Card Description',
    backgroundImage = true,
    index = 0,
}) {

    const imageNum = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10

    return (
        <div className={`relative w-60 h-[350px] overflow-hidden hover:h-[400px] duration-700 cursor-pointer `}>
            {backgroundImage && (
                <Image
                    src={`/images/card-bg/${index || imageNum}.jpg`}
                    alt="Card Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    width={1000}
                    height={600}
                    data-lag="0.15"
                // data-speed="0.1"
                />
            )}
            <div className="relative z-20 p-6">
                <h3 className="text-lg font-bold text-gray-100">{title}</h3>
                {subtitle && <h4 className="text-md font-medium text-gray-200 border p-0.5 border-gray-400 rounded-lg">{subtitle}</h4>}
                <p className="mt-2 text-sm text-gray-200">{description}</p>
            </div>
        </div>
    );
}