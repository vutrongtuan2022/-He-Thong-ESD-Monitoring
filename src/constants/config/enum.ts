export enum QUERY_KEY {
	dropdown_danh_sach_khu_vuc,
	dropdown_danh_sach_nguoi_dung,
	danh_sach_team,
	chi_tiet_team,
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
	KHOA,
	MO,
}

export enum TYPE_UPLOAD {
	AVATAR = 1,
	PICTURE,
}

export enum STATE_DEVICE_NG {
	KHONG_NG,
	BI_NG,
}

export enum ONLINE_DEVICE {
	OFFLINE,
	ONLINE,
}

export enum STATUS_DEVICE {
	KHONG_HOAT_DONG,
	HOAT_DONG,
}
