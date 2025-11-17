
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center w-full">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        Pronunciation Perfect
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Improve your English accent with AI-powered feedback.
      </p>
    </header>
  );
};
