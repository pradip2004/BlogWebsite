import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-600">
      <div className="mb-6 text-3xl font-bold tracking-wide text-white drop-shadow-lg">
        Loading, please wait...
      </div>
      <div className="w-16 h-16 border-8 border-white border-t-purple-500 rounded-full animate-spin shadow-lg"></div>
    </div>
  );
};

export default Loading;