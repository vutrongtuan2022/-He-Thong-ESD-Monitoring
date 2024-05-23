import {STATUS_GENERAL, STATUS_USER} from '~/constants/config/enum';

export interface PropsListTransmitter {}

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
	status: STATUS_GENERAL | null;
	address: string | null;
	birthday: string | null;
	avatar: string | null;
	role: string | null;
	timeCreated: string | null;
	userid: string | null;
	leadName: string | null;
}
