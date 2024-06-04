export interface PropsInfoUser {}

export interface IUserDetail {
	uuid: string;
	userName: string | null;
	fullname: string | null;
	teamUuid: string | null;
	gender: 0;
	email: string | null;
	phone: string | null;
	address: string | null;
	birthday: string | null;
	avatar: string | null;
	regencyUuid: string | null;
	regency: string | null;
	status: number;
	leadName: string | null;
	code: string | null;
	timeCreated: string | null;
	teamName: string | null;
}
