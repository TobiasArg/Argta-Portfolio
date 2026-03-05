

interface PathAnimationProps {
    text: string;
    fontSize?: number;
    className?: string;
    duration?: string;
}

const PathAnimation = ({
    text,
    fontSize = 88,
    className = "",
    duration = "4s"
}: PathAnimationProps) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <svg width="100%" height="auto" viewBox="0 0 800 160" className="max-w-full">
                <defs>
                    <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f97316" /> {/* orange-500 */}
                        <stop offset="100%" stopColor="#fbbf24" /> {/* amber-400 */}
                    </linearGradient>
                </defs>

                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="none"
                    stroke="url(#cyberGradient)"
                    strokeWidth="1.5"
                    fontSize={fontSize}
                    fontWeight="200"
                    letterSpacing="0.2em"
                    fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
                    style={{
                        strokeDasharray: '1000',
                        strokeDashoffset: '1000',
                        filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.4))'
                    }}
                >
                    {text}
                    <animate
                        attributeName="stroke-dashoffset"
                        values="1000;0"
                        dur={duration}
                        fill="freeze"
                        keySplines="0.42, 0, 0.58, 1"
                        calcMode="spline"
                    />
                </text>
            </svg>
        </div>
    );
};

export default PathAnimation;
