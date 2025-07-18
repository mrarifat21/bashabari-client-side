import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
// import useAxiosSecure from './useAxiosSecure';
import useAxios from './useAxios';


const useUserRole = () => {
    const { user, loading: authLoading } = useAuth();
    // const axiosSecure = useAxiosSecure();
    const axiosSecure = useAxios();


    const {
        data: role = 'user',
        isLoading: roleLoading,
        refetch,
    } = useQuery({
        queryKey: ['userRole', user?.email],
        enabled: !authLoading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data.role;
        },
    });

    return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;