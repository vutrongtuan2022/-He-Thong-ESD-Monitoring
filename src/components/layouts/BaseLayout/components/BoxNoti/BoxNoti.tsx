import React, {Fragment, useEffect} from 'react';

import {PropsBoxNoti} from './interfaces';
import styles from './BoxNoti.module.scss';
import Moment from 'react-moment';
import {useInfiniteQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_NOTI} from '~/constants/config/enum';
import notificationsServices from '~/services/notificationsServices';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';
import WrapperLoadMore from '~/components/common/WrapperLoadMore';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {httpRequest} from '~/services';
import clsx from 'clsx';
import i18n from '~/locale/i18n';
import {useRouter} from 'next/router';

function BoxNoti({numberNoti = 0, onClose}: PropsBoxNoti) {
	const queryClient = useQueryClient();

	const {infoUser} = useSelector((state: RootState) => state.user);

	const {data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch} = useInfiniteQuery(
		[QUERY_KEY.danh_sach_thong_bao, infoUser?.uuid],
		async ({pageParam = 1}) => {
			const notis: any = await notificationsServices.getList({
				pageSize: 10,
				page: pageParam,
				uuid: infoUser?.uuid!,
				keyword: '',
			});

			return {
				items: notis?.data?.items || [],
				total: notis?.data?.pagination.totalCount || 0,
			};
		},
		{
			getNextPageParam: (lastPage: any, pages) => {
				if (pages.length < Math.ceil(lastPage.total / 20)) {
					return pages.length + 1;
				}
				return undefined;
			},
		}
	);

	useEffect(() => {
		const interval = setInterval(() => {
			queryClient.invalidateQueries([QUERY_KEY.danh_sach_thong_bao]);
			queryClient.invalidateQueries([QUERY_KEY.tong_so_thong_bao_chua_doc]);
		}, 10000);

		// Dọn dẹp interval khi component unmount
		return () => clearInterval(interval);
	}, [refetch]);

	const readAllNoti = useMutation({
		mutationFn: () =>
			httpRequest({
				http: notificationsServices.readAllNoti({
					uuid: infoUser?.uuid!,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_thong_bao]);
				queryClient.invalidateQueries([QUERY_KEY.tong_so_thong_bao_chua_doc]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h4>
					{i18n.t('Overview.Notify')} <span>({numberNoti})</span>
				</h4>
				<p className={styles.readAll} onClick={() => readAllNoti.mutate()}>
					{i18n.t('Overview.ReadAll')}
				</p>
			</div>

			{data?.pages[0]?.items?.length == 0 ? (
				<div className={styles.empty}>
					<Noti disableButton title={i18n.t('Overview.Notify')} des={i18n.t('Overview.NotifyEmpty')} />
				</div>
			) : (
				<WrapperLoadMore
					fetchNextPage={fetchNextPage}
					isFetchingNextPage={isFetchingNextPage}
					hasNextPage={hasNextPage}
					className={styles.main}
				>
					{data?.pages.map((group: any, i: any) => (
						<Fragment key={i}>
							{group.items.map((v: any) => (
								<ItemNoti key={v?.uuid} onClose={onClose} data={v} />
							))}
						</Fragment>
					))}
				</WrapperLoadMore>
			)}
		</div>
	);
}

export default BoxNoti;

function ItemNoti({data, onClose}: any) {
	const router = useRouter();

	const queryClient = useQueryClient();

	const readOneNoti = useMutation({
		mutationFn: (body: {uuid: string}) =>
			httpRequest({
				http: notificationsServices.readOneNoti({
					uuid: body.uuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_thong_bao]);
				queryClient.invalidateQueries([QUERY_KEY.tong_so_thong_bao_chua_doc]);
			}
		},
	});

	const handleReadNoti = (noti: any) => {
		readOneNoti.mutate({uuid: noti?.uuid});
		onClose();
	};

	return (
		<div className={clsx(styles.item, {[styles.isRead]: data?.status == STATUS_NOTI.DA_DOC})} onClick={() => handleReadNoti(data)}>
			<div
				className={styles.text}
				dangerouslySetInnerHTML={{
					__html: data?.body,
				}}
			></div>
			<p className={styles.time}>
				<Moment fromNow date={data?.timeCreated} locale={router.locale} />
			</p>
		</div>
	);
}
