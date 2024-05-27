import React, {useState} from 'react';
import {Lock} from 'iconsax-react';

import {IArea, PropsTableArea} from './interfaces';
import styles from './TableArea.module.scss';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import areaServices from '~/services/areaServices';
import Loading from '~/components/common/Loading';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Link from 'next/link';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import Pagination from '~/components/common/Pagination';
import Dialog from '~/components/common/Dialog';
import Popup from '~/components/common/Popup';
import {PATH} from '~/constants/config';
import MainUpdateArea from '../MainUpdateArea';

function TableArea({}: PropsTableArea) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _status, _open} = router.query;

	const [dataChangeStatus, setDataChangeStatus] = useState<IArea | null>(null);

	const pageListAreas = useQuery([QUERY_KEY.danh_sach_khu_vuc, _page, _pageSize, _keyword, _status], {
		queryFn: () =>
			httpRequest({
				http: areaServices.listArea({
					keyword: _keyword as string,
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					status: _status ? Number(_status) : null,
					parentUuid: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	// Đổi trạng thái team
	const fucnChangeStatusArea = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thay đổi trạng thái thành công!',
				http: areaServices.changeStatusArea({
					uuid: dataChangeStatus?.uuid!,
					status: dataChangeStatus?.status! == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataChangeStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.thong_so_chung_khu_vuc]);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_khu_vuc, _page, _pageSize, _keyword, _status]);
			}
		},
	});

	const handleChangeStatusArea = async () => {
		fucnChangeStatusArea.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnChangeStatusArea.isLoading} />
			<DataWrapper
				data={pageListAreas?.data?.items}
				loading={pageListAreas.isLoading}
				noti={<Noti title='Khu vực trống' des='Danh sách khu vực trống!' />}
			>
				<Table
					data={pageListAreas?.data?.items}
					column={[
						{
							title: 'STT',
							render: (data: IArea, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Mã khu vực',
							render: (data: IArea) => <>{data.code}</>,
						},
						{
							title: 'Tên khu vực',
							render: (data: IArea) => (
								<Link href={`/khu-vuc/${data.uuid}`} className={styles.link}>
									{data.name || '---'}
								</Link>
							),
						},
						{
							title: 'Số khu vực con',
							render: (data: IArea) => <>{data.totalChild}</>,
						},
						{
							title: 'Số team',
							render: (data: IArea) => <>{data.totalTeam}</>,
						},
						{
							title: 'Số thành viên',
							render: (data: IArea) => <>{data.totalUser || 0}</>,
						},
						{
							title: 'Số thiết bị',
							render: (data: IArea) => <>{data.totalDevice}</>,
						},
						{
							title: 'Khu vực cha',
							render: (data: IArea) => <>{data.parentName || '---'}</>,
						},
						{
							title: 'Trạng thái',
							render: (data: IArea) => (
								<>
									{data?.status == STATUS_GENERAL.SU_DUNG ? (
										<p style={{color: '#35C244', fontWeight: 600}}>Đang sử dụng</p>
									) : data.status == STATUS_GENERAL.KHONG_SU_DUNG ? (
										<p style={{color: '#E85A5A', fontWeight: 600}}>Không sử dụng</p>
									) : (
										'---'
									)}
								</>
							),
						},
						{
							title: 'Tác vụ',
							render: (data: IArea) => (
								<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
									<IconCustom
										edit
										icon={<LuPencil fontSize={20} fontWeight={600} />}
										tooltip='Chỉnh sửa'
										color='#777E90'
										onClick={() =>
											router.replace(
												{
													pathname: PATH.KhuVuc,
													query: {
														...router.query,
														_open: 'update',
														_uuid: data.uuid,
													},
												},
												undefined,
												{
													scroll: false,
													shallow: false,
												}
											)
										}
									/>

									<IconCustom
										warn
										icon={<Lock size='22' />}
										tooltip='Khóa'
										color='#777E90'
										onClick={() => setDataChangeStatus(data)}
									/>
								</div>
							),
						},
					]}
				/>
			</DataWrapper>
			<Pagination
				currentPage={Number(_page) || 1}
				pageSize={Number(_pageSize) || 20}
				total={pageListAreas?.data?.pagination?.totalCount}
				dependencies={[_pageSize, _keyword, _status]}
			/>

			{/* POPUP */}
			<Dialog
				warn
				open={!!dataChangeStatus}
				onClose={() => setDataChangeStatus(null)}
				title='Thay đổi trạng thái'
				note='Bạn có chắc chắn muốn thay đổi trạng thái cho khu vực này?'
				onSubmit={handleChangeStatusArea}
			/>

			{/* POPUP */}
			<Popup
				open={_open == 'update'}
				onClose={() => {
					const {_open, _uuid, ...rest} = router.query;

					router.replace(
						{
							pathname: PATH.KhuVuc,
							query: {
								...rest,
							},
						},
						undefined,
						{
							scroll: false,
							shallow: false,
						}
					);
				}}
			>
				<MainUpdateArea
					onClose={() => {
						const {_open, _uuid, ...rest} = router.query;

						router.replace(
							{
								pathname: PATH.KhuVuc,
								query: {
									...rest,
								},
							},
							undefined,
							{
								scroll: false,
								shallow: false,
							}
						);
					}}
				/>
			</Popup>
		</div>
	);
}

export default TableArea;
