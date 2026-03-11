

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
    const letterSpacingEm = 0.2;
    const estimatedGlyphWidth = 0.62;
    const textLength = Math.max(text.length, 1);
    const estimatedTextWidth =
        fontSize *
        (textLength * estimatedGlyphWidth + Math.max(0, textLength - 1) * letterSpacingEm);
    const horizontalPadding = fontSize * 1.2;
    const viewBoxWidth = Math.max(800, Math.ceil(estimatedTextWidth + horizontalPadding * 2));
    const viewBoxHeight = Math.max(160, Math.ceil(fontSize * 2));

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <svg
                width="100%"
                height="auto"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                className="max-w-full overflow-visible"
            >
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
                    letterSpacing={`${letterSpacingEm}em`}
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
