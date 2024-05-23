export interface PropsMainPageUser {}
export interface IAccount {
	uuid: string;
	userUuid: string | null;
	userName: string | null;
	roleUuid: string | null;
	timeCreated: string;
	status: number;
	email: string | null;

	// macNumber: string;
	// name: string;
	// gatewayUuid: string | null;
	// teamUuid: string | null;
	// battery: number;
	// state: number | null;
	// signalStatus: number | null;
	// edsStatic: any;
	// ngStatus: null;
	// timeLastOnline: string;
}
