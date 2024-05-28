export interface PropsPageDetailAccount {}
export interface IAccountDetail {
	uuid: string;
	userUuid: string;
	fullName: string;
	regency: string;
	gender: number;
	email: string;
	phone: string | null;
	address: string;
	birthday: string;
	avatar: string | null;
	userName: string;
	code: string;
	status: number;
	roleUuid: string | null;
	roleName: string | null;
	teamUuid: string | null;
	teamName: string | null;
	teamLeader: string | null;
	timeCreated: string;
	userCreated: string | null;
}
