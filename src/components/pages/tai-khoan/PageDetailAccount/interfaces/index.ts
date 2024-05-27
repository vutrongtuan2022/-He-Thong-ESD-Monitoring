export interface PropsPageDetailAccount {}
export interface IAccDetail {
	uuid: string;
	userUuid: string | null;
	fullName: string | null;
	regency: string | null;
	gender: number;
	userName: string | null;
	roleUuid: string | null;
	timeCreated: string;
	status: number;
	email: string | null;
	phone: string;
	address: string;
	birthday: string;
	avatar: string | null;
	code: string | null;
}
