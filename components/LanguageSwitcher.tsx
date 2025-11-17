import React from 'react';

interface LanguageSwitcherProps {
  currentLanguage: 'en' | 'zh';
  onLanguageChange: (lang: 'en' | 'zh') => void;
  disabled: boolean;
}

/**
 * NEW_FEATURE: A component that allows the user to switch the analysis language
 * between English and Chinese. It is used to control the language of the feedback
 * provided by the Gemini API.
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onLanguageChange, disabled }) => {
  // Common classes for both buttons
  const baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500";
  // Classes for the currently selected language button
  const activeClasses = "bg-blue-600 text-white";
  // Classes for the non-selected language button
  const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";
  // Classes applied when the buttons should be disabled (e.g., during recording)
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <div className="flex justify-center items-center p-2 bg-gray-800 rounded-lg space-x-2 my-4">
      <button
        onClick={() => onLanguageChange('en')}
        disabled={disabled}
        className={`${baseClasses} ${currentLanguage === 'en' ? activeClasses : inactiveClasses} ${disabled ? disabledClasses : ''}`}
        aria-pressed={currentLanguage === 'en'}
      >
        English
      </button>
      <button
        onClick={() => onLanguageChange('zh')}
        disabled={disabled}
        className={`${baseClasses} ${currentLanguage === 'zh' ? activeClasses : inactiveClasses} ${disabled ? disabledClasses : ''}`}
        aria-pressed={currentLanguage === 'zh'}
      >
        中文
      </button>
    </div>
  );
};