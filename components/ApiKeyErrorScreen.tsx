
import React from 'react';
import { WarningIcon } from './icons/WarningIcon';

/**
 * NEW_FEATURE: A component that renders a full-page error screen.
 * This is shown when a critical configuration, like the API key, is missing.
 */
export const ApiKeyErrorScreen: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md p-8 bg-gray-800 rounded-2xl shadow-xl border border-red-500/30">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 text-red-400">
          <WarningIcon />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-red-400">
          Application Not Configured
        </h2>
        <p className="mt-3 text-gray-300">
          This application requires a valid API key to function, but it has not been configured.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please ensure the `API_KEY` environment variable is set correctly.
        </p>
      </div>
    </div>
  );
};
