import useSWR from 'swr';
import { useState } from 'react';
import {
    getAllUser,
    getAllUserStatus,
    createUser,
    updateUser,
    changeStatusUser,
} from '@/apis/userApi';
import { IUser } from '@/types/types';
import { toast } from 'sonner';

export const useUser = () => {
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const fetcher = async () => {
        if (filterStatus && filterStatus !== 'all') {
            return await getAllUserStatus(filterStatus);
        }
        return await getAllUser();
    };

    const { data: usersData, error, isLoading, mutate } = useSWR<IUser[]>(
        ['/users', filterStatus],
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    const users = usersData || [];

    const addUser = async (user: IUser) => {
        try {
            await createUser(user);
            mutate();
            toast.success('Thêm tài khoản thành công');
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Thêm tài khoản thất bại');
            return false;
        }
    };

    const updateUserInfo = async (id: number, user: IUser) => {
        try {
            await updateUser(id, user);
            mutate();
            toast.success('Cập nhật tài khoản thành công');
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Cập nhật tài khoản thất bại');
            return false;
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await changeStatusUser(id, status);
            mutate();
            toast.success('Cập nhật trạng thái thành công');
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại');
            return false;
        }
    };

    const handleOpenAddDialog = () => setIsAddDialogOpen(true);

    const handleView = (user: IUser) => {
        setSelectedUser(user);
        setIsViewDialogOpen(true);
    };

    const handleEdit = (user: IUser) => {
        setSelectedUser(user);
        setIsEditDialogOpen(true);
    };

    const handleDelete = (user: IUser) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    return {
        users,
        loading: isLoading,
        error,
        isAddDialogOpen,
        setIsAddDialogOpen,
        selectedUser,
        setSelectedUser,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isViewDialogOpen,
        setIsViewDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        handleOpenAddDialog,
        handleView,
        handleEdit,
        handleDelete,
        addUser,
        updateUserInfo,
        updateStatus,
        filterStatus,
        setFilterStatus,
        refreshUsers: mutate
    };
};