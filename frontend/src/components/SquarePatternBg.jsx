import { useEffect } from "react";

const SquarePatternBg = () => {
  useEffect(() => {
    const styleId = "sq-pattern-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(0, 0, 0, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.055) 1px, transparent 1px);
          background-size: 44px 44px;
          background-color: #FFF8F3;
        }
        [data-bs-theme="dark"] body::before,
        body[data-bs-theme="dark"]::before {
          background-color: #1A1A1A;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  return null;
};

export default SquarePatternBg;
