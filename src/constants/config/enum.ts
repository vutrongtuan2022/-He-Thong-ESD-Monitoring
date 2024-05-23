export enum QUERY_KEY {
	dropdown_danh_sach_khu_vuc,
	dropdown_danh_sach_nguoi_dung,
	dropdown_danh_sach_team,
	dropdown_danh_sach_gateway,
	dropdown_danh_sach_device,
	dropdown_danh_sach_chuc_vu,
	danh_sach_team,
	chi_tiet_team,
	danh_sach_bo_phat,
	chi_tiet_bo_phat,
	lich_su_bo_phat_LG,
	danh_sach_gateway,
	chi_tiet_gateway,
	danh_sach_nhan_vien,
	danh_sach_nhan_vien_team,
	danh_sach_bo_phat_team,
	danh_sach_lich_su_team,
	trang_chu_tong_quan,
	chi_tiet_nhan_vien,
	danh_sach_tai_khoan,
	chinh_sua_nhan_vien,
}

export enum TYPE_DATE {
	ALL = -1,
	TODAY = 1,
	YESTERDAY = 2,
	THIS_WEEK = 3,
	LAST_WEEK = 4,
	THIS_MONTH = 5,
	LAST_MONTH = 6,
	THIS_YEAR = 7,
	LUA_CHON = 8,
}

export enum GENDER {
	NAM,
	NU,
	KHAC,
}

export enum STATUS_GENERAL {
	KHONG_SU_DUNG,
	SU_DUNG,
}

export enum TYPE_UPLOAD {
	AVATAR = 1,
	PICTURE,
}

export enum STATE_DEVICE_NG {
	KHONG_NG,
	BI_NG,
}

export enum STATE_ONLINE_DEVICE {
	OFFLINE,
	ONLINE,
}

export enum SIGNAL_STATUS_DEVICE {
	YEU,
	MANH,
	TRUNG_BINH,
}

export enum STATE_GATEWAY {
	OFFLINE,
	ONLINE,
}

export enum STATUS_USER {
	HAVEACCOUNT = '1',
	NOACCOUNT = '0',
}
// export enum STATUS_ACCOUNT {
// 	KHOA,
// 	HOAT_DONG,
// }
