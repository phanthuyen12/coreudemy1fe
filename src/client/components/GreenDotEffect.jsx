import React from 'react';

// Reusable moving green dot effect
// Props:
// - size: number (px) default 16
// - duration: number (seconds) default 6
// - top: string (css top, e.g. '120px' or '20%') default '100px'
// - zIndex: number default 5
// - opacityStops: customize opacity via CSS vars if needed
const GreenDotEffect = ({ size = 16, duration = 6, top = '100px', zIndex = 5 }) => {
  return (
    <>
      <style>{`
        @keyframes ldh-move-dot {
          0% { transform: translateX(-10vw); opacity: 0; }
          15% { opacity: .85; }
          50% { opacity: 1; }
          85% { opacity: .4; }
          100% { transform: translateX(110vw); opacity: 0; }
        }
        .ldh-moving-dot-wrapper { position: fixed; left: 0; right: 0; pointer-events: none; }
        .ldh-moving-dot {
          width: ${size}px; height: ${size}px; border-radius: 999px;
          background: #90EE90; /* light green */
          box-shadow: 0 0 12px rgba(144,238,144,.65), 0 0 24px rgba(144,238,144,.35);
          animation: ldh-move-dot ${duration}s linear infinite;
        }
      `}</style>
      <div className="ldh-moving-dot-wrapper" style={{ top, zIndex }}>
        <div className="ldh-moving-dot" />
      </div>
    </>
  );
};

export default GreenDotEffect;






















