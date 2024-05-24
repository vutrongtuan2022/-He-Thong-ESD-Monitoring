export interface PropsMainPageUser {}

export interface IUser {
	uuid: string;
	username: string | null;
	userName: string | null;
	fullname: string | null;
	teamUuid: string | null;
	teamName: string | null;
	code: string | null;
	gender: number;
	email: string | null;
	phone: string | null;
	status: number;
	address: string | null;
	birthday: string | null;
	avatar: string | null;
	role: string | null;
	timeCreated: string;
	userid: string | null;
	leadName: string | null;
}
