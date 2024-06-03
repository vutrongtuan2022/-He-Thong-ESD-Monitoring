/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	swcMinify: false,
	devIndicators: {
		buildActivity: false,
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	i18n: {
		locales: ['vi', 'en'],
		defaultLocale: 'vi',
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
			{
				protocol: 'http',
				hostname: '**',
			},
		],
	},
};

module.exports = nextConfig;
