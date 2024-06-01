import {GENDER} from '~/constants/config/enum';

export interface PropsMainUpdateUser {}

export interface IFormUpdate {
	code: string;
	fullname: string;
	email: string;
	phone: string;
	regencyUuid: string;
	birthday: string;
	gender: number;
	teamUuid: string;
	address: string;
}
