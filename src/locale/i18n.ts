import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import viTranslations from './langs/vi.json';
import enTranslations from './langs/en.json'; // Import translations for each language

i18n.use(initReactI18next).init({
	resources: {
		en: {translation: enTranslations},
		vi: {translation: viTranslations},
		// Add more languages and translations as needed
	},
	lng: 'vi', // Set the default language
	fallbackLng: 'vi', // Fallback language in case the user's language is not available
	interpolation: {
		escapeValue: false, // Allow the usage of HTML tags in translation strings
	},
});

export default i18n;
