import {TYPE_DATE} from './enum';
import {FaChromecast} from 'react-icons/fa';
import {TbClipboardText, TbServer2} from 'react-icons/tb';
import {HiOutlineUser} from 'react-icons/hi';
import {RiGroupLine} from 'react-icons/ri';
import {LuUserCircle2} from 'react-icons/lu';
import {BiSolidVector} from 'react-icons/bi';
import {IoSettingsSharp, IoWifiSharp} from 'react-icons/io5';
import {RxDashboard} from 'react-icons/rx';

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
	BoPhat = '/bo-phat',
	CongTy = '/cong-ty',
	Line = '/quan-ly-line',
	NguoiDung = '/nguoi-dung',
	Team = '/team',
	NhanVien = '/nhan-vien',
	ThongKe = '/thong-ke',
	PhanQuyen = '/phan-quyen',
	CaiDat = '/cai-dat',

	ThemNhanvien = '/nhan-vien/them-moi',
	ThemTeam = '/team/them-moi',
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
		group: [{title: 'Tổng quan', icon: RxDashboard, path: PATH.Home}],
	},
	{
		title: 'THIẾT BỊ',
		group: [
			{title: 'Quản lý gateway', icon: IoWifiSharp, path: PATH.Gateway},
			{title: 'Quản lý bộ phát', icon: FaChromecast, path: PATH.BoPhat},
			// {title: 'Quản lý line', icon: TbServer2, path: PATH.Line},
		],
	},
	{
		title: 'NHÂN SỰ',
		group: [
			{title: 'Quản lý tài khoản', icon: HiOutlineUser, path: PATH.NguoiDung},
			{title: 'Quản lý team', icon: RiGroupLine, path: PATH.Team},
			{title: 'Quản lý nhân viên', icon: LuUserCircle2, path: PATH.NhanVien},
		],
	},
	{
		title: 'THỐNG KÊ',
		group: [{title: 'Báo cáo', icon: TbClipboardText, path: PATH.ThongKe}],
	},
	{
		title: 'HỆ THỐNG',
		group: [
			{title: 'Phân quyền', icon: BiSolidVector, path: PATH.PhanQuyen},
			{title: 'Cài đặt', icon: IoSettingsSharp, path: PATH.CaiDat},
		],
	},
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
