import {TYPE_DATE} from './enum';
import {FaChromecast} from 'react-icons/fa';
import {TbClipboardText} from 'react-icons/tb';
import {HiOutlineUser} from 'react-icons/hi';
import {RiGroupLine} from 'react-icons/ri';
import {LuUserCircle2} from 'react-icons/lu';
import {IoWifiSharp} from 'react-icons/io5';
import {RxDashboard} from 'react-icons/rx';
import icons from '../images/icons';
import {GrMap} from 'react-icons/gr';
import i18n from '~/locale/i18n';

export const MAXIMUM_FILE = 10; //MB

export const allowFiles = [
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'image/jpeg',
	'image/jpg',
	'image/png',
];

export enum PATH {
	Any = 'any',
	Login = '/auth/login',
	ForgotPassword = '/auth/forgot-password',
	Profile = '/profile',
	Home = '/',
	Gateway = '/gateway',
	Device = '/device',
	Account = '/account',
	Team = '/team',
	User = '/user',
	FactoryArea = '/factory-area',
	CreateUser = '/user/create',
	CreateTeam = '/team/create',
	Settings = '/settings',
	Report = '/report',
	Permission = '/permission',
}

export const Menu: {
	title: string;
	group: {
		path: string;
		title: string;
		icon: any;
	}[];
}[] = [
	{
		title: 'OVERVIEW',
		group: [{title: i18n.t('Overview.Overview'), icon: RxDashboard, path: PATH.Home}],
	},
	{
		title: i18n.t('Device.Device'),
		group: [
			{title: i18n.t('Gateway.GatewayManagament'), icon: IoWifiSharp, path: PATH.Gateway},
			{title: i18n.t('Device.TransmitterManagement'), icon: FaChromecast, path: PATH.Device},
		],
	},
	{
		title: i18n.t('User.User'),
		group: [
			{title: i18n.t('Account.AccountManagement'), icon: HiOutlineUser, path: PATH.Account},
			{title: i18n.t('Team.TeamManagement'), icon: RiGroupLine, path: PATH.Team},
			{title: i18n.t('User.UserManagement'), icon: LuUserCircle2, path: PATH.User},
		],
	},
	{
		title: i18n.t('Area.Area'),
		group: [{title: i18n.t('Area.AreaManagement'), icon: GrMap, path: PATH.FactoryArea}],
	},
	{
		title: i18n.t('Report.Report'),
		group: [{title: i18n.t('Report.ReportManagement'), icon: TbClipboardText, path: PATH.Report}],
	},
	// {
	// 	title: 'HỆ THỐNG',
	// 	group: [
	// 		{title: 'Phân quyền', icon: BiSolidVector, path: PATH.Permission},
	// 		{title: 'Cài đặt', icon: IoSettingsSharp, path: PATH.Settings},
	// 	],
	// },
];

export const KEY_STORE = 'ADMIN-ESD';

export const ListOptionTimePicker: {
	name: string;
	value: number;
}[] = [
	{
		name: 'Hôm nay',
		value: TYPE_DATE.TODAY,
	},
	{
		name: 'Tuần này',
		value: TYPE_DATE.THIS_WEEK,
	},
	{
		name: 'Tuần trước',
		value: TYPE_DATE.LAST_WEEK,
	},
	{
		name: 'Tháng này',
		value: TYPE_DATE.THIS_MONTH,
	},
	// {
	// 	name: 'Tháng trước',
	// 	value: TYPE_DATE.LAST_MONTH,
	// },
	// {
	// 	name: 'Năm này',
	// 	value: TYPE_DATE.THIS_YEAR,
	// },
	{
		name: 'Lựa chọn',
		value: TYPE_DATE.LUA_CHON,
	},
];

export const Languageses = [
	{
		title: 'Vietnamese',
		code: 'vi',
		icon: icons.vietnam,
	},
	{
		title: 'English',
		code: 'en',
		icon: icons.icon_en,
	},
];
