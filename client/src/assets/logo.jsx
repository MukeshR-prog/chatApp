export const Logo = () => {
    return (
      <div className="flex p-5 justify-start items-center gap-1">
        <svg
          width="60"
          height="60"
          viewBox="0 0 75 75"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8E44AD" />
              <stop offset="100%" stopColor="#6C3483" />
            </linearGradient>
          </defs>
  
          {/* Speech Bubble with Unique Tail */}
          <path
            d="M10 15 Q5 5, 20 5 L55 5 Q70 5, 70 25 L70 50 Q70 65, 55 65 L35 65 L20 72 L22 58 Q10 50, 10 45 Z"
            fill="url(#purpleGradient)"
            stroke="#4A235A"
            strokeWidth="2"
            transform="scale(0.67, 0.67) translate(12, 12)"
          />
  
          {/* Chat Icon - Three Dots */}
          <circle cx="25" cy="35" r="4" fill="white" transform="scale(0.67, 0.67) translate(12, 12)" />
          <circle cx="37.5" cy="35" r="4" fill="white" transform="scale(0.67, 0.67) translate(12, 12)" />
          <circle cx="50" cy="35" r="4" fill="white" transform="scale(0.67, 0.67) translate(12, 12)" />
        </svg>
  
        <span className="text-lg mt-[-10px] font-semibold">Chatter Box</span>
      </div>
    );
  };
  
  export default Logo;
  