import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="h-[91vh] flex flex-col items-center justify-center ">
      {/* Animated Loading Text */}
      <div className="mb-8 text-3xl font-bold tracking-wide text-[var(--tertiary)] drop-shadow-lg flex items-center">
        Loading
        <span className="inline-flex">
          <span className="animate-bounce [animation-delay:0ms]">.</span>
          <span className="animate-bounce [animation-delay:150ms]">.</span>
          <span className="animate-bounce [animation-delay:300ms]">.</span>
        </span>
      </div>
      {/* Spinner */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute w-full h-full border-8 border-white border-t-[#ef233c] rounded-full animate-spin"></div>
        {/* <div className="w-8 h-8 bg-[#ef233c] rounded-full shadow-lg"></div> */}
      </div>
    </div>
  );
};

export default Loading;