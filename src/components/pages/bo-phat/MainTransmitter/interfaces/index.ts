export interface PropsMainTransmitter {}

export interface IDevice {
	uuid: string;
	macNumber: string;
	name: string;
	gatewayUuid: string | null;
	teamUuid: string | null;
	battery: number;
	state: number | null;
	signalStatus: number | null;
	edsStatic: any;
	ngStatus: null;
	timeLastOnline: string;
	timeCreated: string;
	status: number;
	gatewayName: string | null;
	teamName: string | null;
}
