export interface PropsMainPageAccount {}

export interface IAccount {
	uuid: string;
	userUuid: string;
	fullName: string;
	regency: string;
	gender: number;
	email: string;
	phone: string | null;
	address: string | null;
	birthday: string | null;
	avatar: string | null;
	userName: string | null;
	roleUuid: string | null;
	roleName: string | null;
	code: string;
	timeCreated: string;
	status: number;
}
