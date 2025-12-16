import useSWR from 'swr';
import { useState } from 'react';
import {
    getAllEmployee,
    getAllEmployeeStatus,
    createEmployee,
    updateEmployee,
    changeStatusEmployee,
    IEmployee
} from '../apis/employeeApi';
import { toast } from 'sonner';

export const useEmployees = () => {
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const fetcher = async () => {
        if (filterStatus && filterStatus !== 'all') {
            return await getAllEmployeeStatus(filterStatus);
        }
        return await getAllEmployee();
    };

    const { data: employees, error, isLoading, mutate } = useSWR<IEmployee[]>(
        ['/employees', filterStatus],
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    const addEmployee = async (employee: IEmployee) => {
        try {
            await createEmployee(employee);
            mutate(); // Refresh the list
            toast.success('Thêm nhân viên thành công');
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Thêm nhân viên thất bại');
            return false;
        }
    };

    const updateEmployeeInfo = async (id: number, employee: IEmployee) => {
        try {
            await updateEmployee(id, employee);
            mutate(); // Refresh the list
            toast.success('Cập nhật nhân viên thành công');
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Cập nhật nhân viên thất bại');
            return false;
        }
    };


    const updateStatus = async (id: number, status: string) => {
        try {
            await changeStatusEmployee(id, status);
            mutate(); // Refresh the list
            toast.success('Cập nhật trạng thái thành công');
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại');
            return false;
        }
    };

    return {
        employees: employees || [],
        isLoading,
        isError: error,
        addEmployee,
        updateEmployeeInfo,
        updateStatus,
        filterStatus,
        setFilterStatus,
        mutate
    };
};