import React from 'react';

import {PropsTableUser} from './interfaces';
import styles from './TableUser.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Link from 'next/link';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {httpRequest} from '~/services';
import {QUERY_KEY} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/router';
import userServices from '~/services/userServices';
import {IUser} from '~/components/pages/nhan-vien/MainPageUser/interfaces';
import i18n from '~/locale/i18n';

function TableUser({}: PropsTableUser) {
	const router = useRouter();

	const {_id, _page, _pageSize, _table} = router.query;

	const listUserTeams = useQuery([QUERY_KEY.danh_sach_nhan_vien_team, _id, _page, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: userServices.listUser({
					keyword: '',
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					teamUuid: _id as string,
					status: null,
					username: null,
					timeCreated: null,
					isHaveAcc: null,
					regencyUuid: null,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	return (
		<div>
			<DataWrapper
				data={listUserTeams?.data?.items}
				loading={listUserTeams.isLoading}
				noti={<Noti title={i18n.t('User.Nhanvientrong')} des={i18n.t('User.Danhsachnhanvientrong')} disableButton />}
			>
				<Table
					data={listUserTeams?.data?.items}
					column={[
						{
							title: i18n.t('Common.STT'),
							render: (data: IUser, index: number) => <>{index + 1}</>,
						},
						{
							title: i18n.t('Common.Manhanvien'),
							render: (data: IUser) => (
								<Link href={`/nhan-vien/${data.uuid}`} className={styles.link}>
									{data.code || '---'}
								</Link>
							),
						},
						{
							title: i18n.t('Common.Tennhanvien'),
							render: (data: IUser) => <>{data.fullname || '---'}</>,
						},
						{
							title: 'Email',
							render: (data: IUser) => <>{data.email || '---'}</>,
						},
						{
							title: i18n.t('Common.Sodienthoai'),
							render: (data: IUser) => <>{data.phone || 0}</>,
						},
						{
							title: i18n.t('Common.Thuocteam'),
							render: (data: IUser) => <>{data.teamName || 0}</>,
						},
					]}
				/>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					total={listUserTeams?.data?.pagination?.totalCount}
					dependencies={[_id, _pageSize, _table]}
				/>
			</DataWrapper>
		</div>
	);
}

export default TableUser;
