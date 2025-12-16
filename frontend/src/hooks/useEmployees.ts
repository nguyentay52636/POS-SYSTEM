import useSWR from 'swr';
import {
    getAllEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    IEmployee
} from '../apis/employeeApi';
import { toast } from 'sonner';

export const useEmployees = () => {
    const { data: employees, error, isLoading, mutate } = useSWR<IEmployee[]>('/employees', getAllEmployee, {
        revalidateOnFocus: false,
        shouldRetryOnError: false
    });

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

    const updateEmployeeInfo = async (id: string, employee: IEmployee) => {
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

    const removeEmployee = async (id: string) => {
        try {
            await deleteEmployee(id);
            mutate(); // Refresh the list
            toast.success('Xóa nhân viên thành công');
            return true;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Xóa nhân viên thất bại');
            return false;
        }
    };

    return {
        employees: employees || [],
        isLoading,
        isError: error,
        addEmployee,
        updateEmployeeInfo,
        removeEmployee,
        mutate
    };
};