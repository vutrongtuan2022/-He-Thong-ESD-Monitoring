import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface SiteState {
	loading: boolean;
	isMobile: boolean;
	ip: string;
	fullMenu: boolean;
}

const initialState: SiteState = {
	loading: true,
	isMobile: false,
	ip: '',
	fullMenu: true,
};

export const siteSlice = createSlice({
	name: 'site',
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action?.payload;
		},
		setIsMobile: (state, action: PayloadAction<boolean>) => {
			state.isMobile = action.payload;
		},
		setIp: (state, action: PayloadAction<string>) => {
			state.ip = action.payload;
		},
		setFullMenu: (state, action: PayloadAction<boolean>) => {
			state.fullMenu = action.payload;
		},
	},
});

export const {setLoading, setIsMobile, setIp, setFullMenu} = siteSlice.actions;
// Action creators are generated for each case reducer function
export default siteSlice.reducer;
