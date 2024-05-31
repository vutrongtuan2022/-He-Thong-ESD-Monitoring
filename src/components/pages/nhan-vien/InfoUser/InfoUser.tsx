import React, {Fragment, useEffect, useState} from 'react';
import {IUserDetail, PropsInfoUser} from './interfaces';
import styles from './InfoUser.module.scss';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import Link from 'next/link';
import {httpRequest} from '~/services';
import {IoArrowBackOutline} from 'react-icons/io5';
import clsx from 'clsx';
import userServices from '~/services/userServices';
import {PATH} from '~/constants/config';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import Dialog from '~/components/common/Dialog';
import {toastWarn} from '~/common/funcs/toast';
import Moment from 'react-moment';
import Loading from '~/components/common/Loading';
import i18n from '~/locale/i18n';

function InfoUser({}: PropsInfoUser) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [data, setData] = useState<IUserDetail>();
	const [dataChangeStatus, setDataChangeStatus] = useState<IUserDetail | null>(null);

	useQuery([QUERY_KEY.chi_tiet_nhan_vien, _id], {
		queryFn: () =>
			httpRequest({
				http: userServices.userDetail({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			setData(data);
		},
		enabled: !!_id,
	});

	const changeStatusUser = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Common.ThaydoiTrangthaithanhcong'),
				http: userServices.updateUserStatus({
					uuid: dataChangeStatus?.uuid!,
					status: dataChangeStatus?.status! == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataChangeStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_nhan_vien, _id]);
			}
		},
	});

	const handleChangeStatusUser = async () => {
		if (!dataChangeStatus?.uuid) {
			return toastWarn({msg: i18n.t('User.Khongtimthaynhanviennao')});
		}
		return changeStatusUser.mutate();
	};

	return (
		<Fragment>
			<Loading loading={changeStatusUser.isLoading} />
			<div className={styles.container}>
				<div className={styles.header}>
					<Link href={PATH.NhanVien} className={styles.header_title}>
						<IoArrowBackOutline fontSize={20} fontWeight={600} />
						<p>{i18n.t('User.Chitietnhanvien')}</p>
					</Link>
					<div className={styles.list_btn}>
						{data?.status == STATUS_GENERAL.SU_DUNG && (
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								danger_opacity
								bold
								onClick={() => setDataChangeStatus(data)}
							>
								{i18n.t('Common.Khoa')}
							</Button>
						)}

						{data?.status == STATUS_GENERAL.KHONG_SU_DUNG && (
							<Button className={styles.btn} rounded_8 w_fit p_6_16 green bold onClick={() => setDataChangeStatus(data)}>
								{i18n.t('Common.Mokhoa')}
							</Button>
						)}
						<Button
							rounded_8
							w_fit
							p_6_16
							blue_light
							bold
							onClick={() => {
								router.push(`/nhan-vien/chinh-sua?_id=${_id}`);
							}}
						>
							{i18n.t('Common.Chinhsua')}
						</Button>
					</div>
				</div>
				<div className={clsx('mt', styles.table)}>
					<table className={styles.containertable}>
						<colgroup>
							<col style={{width: '50%'}} />
							<col style={{width: '50%'}} />
						</colgroup>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Common.Manhanvien')}: </span> {data?.code || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Common.Chucvu')}: </span> {data?.regency || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Common.Hovaten')}: </span> {data?.fullname || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Common.Thuocteam')} : </span> {data?.teamName || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Email: </span> {data?.email || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>Leader team: </span> {data?.leadName || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Common.Sodienthoai')}: </span> {data?.phone || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Common.Taoluc')}: </span>{' '}
								<Moment date={data?.timeCreated} format='HH:mm, DD/MM/YYYY' />,
							</td>
						</tr>
					</table>
				</div>
				<Dialog
					warn
					open={!!dataChangeStatus}
					onClose={() => setDataChangeStatus(null)}
					title={i18n.t('Common.ChuyenTrangthai')}
					note={i18n.t('User.BancochacmuonchuyenTrangthainhanviennay')}
					onSubmit={handleChangeStatusUser}
				/>
			</div>
		</Fragment>
	);
}

export default InfoUser;
