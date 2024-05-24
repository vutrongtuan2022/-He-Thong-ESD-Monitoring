import {GENDER} from '~/constants/config/enum';

export interface PropsMainUpdateUser {}

export interface IFormUpdate {
	code: string;
	fullname: string;
	email: string;
	phone: string;
	roleId: string;
	birthday: string;
	gender: GENDER;
	teamUuid: string;
	address: string;
}
