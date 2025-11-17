import React from 'react';
// REFACTOR: Import the new reusable Button component.
import { Button } from './Button';

interface LanguageSwitcherProps {
  currentLanguage: 'en' | 'zh' | 'ja';
  onLanguageChange: (lang: 'en' | 'zh' | 'ja') => void;
  disabled: boolean;
}

/**
 * NEW_FEATURE: A component that allows the user to switch the analysis language
 * between English and Chinese. It is used to control the language of the feedback
 * provided by the Gemini API.
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onLanguageChange, disabled }) => {
  return (
    <div className="flex justify-center items-center p-2 bg-gray-800 rounded-lg space-x-2 my-4">
      {/* REFACTOR: The <button> element is replaced with the new reusable Button component. */}
      <Button
        onClick={() => onLanguageChange('zh')}
        disabled={disabled}
        variant={currentLanguage === 'zh' ? 'primary' : 'secondary'}
        size="sm"
        aria-pressed={currentLanguage === 'zh'}
      >
        中文
      </Button>
      <Button
        onClick={() => onLanguageChange('en')}
        disabled={disabled}
        // REFACTOR: The button's appearance is now controlled by the `variant` prop, cleaning up the code.
        variant={currentLanguage === 'en' ? 'primary' : 'secondary'}
        size="sm"
        aria-pressed={currentLanguage === 'en'}
      >
        English
      </Button>
      <Button
        onClick={() => onLanguageChange('ja')}
        disabled={disabled}
        variant={currentLanguage === 'ja' ? 'primary' : 'secondary'}
        size="sm"
        aria-pressed={currentLanguage === 'ja'}
      >
        日本語
      </Button>
    </div>
  );
};