import { useQuery, useMutation } from "@tanstack/react-query"
import { getSignature, login } from "../../services/auth.service";
import type { LoginType } from "../../types/login.type";


const useGetSignature = (address: string) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['getSignature', address],
        queryFn: () => getSignature(address),
        staleTime: 5000,
        enabled: !!address,
    });

    return {
        data,
        isLoading,
        refetch,
    };
};

const useLogin = () => {
    return useMutation<any, any, { loginType: LoginType }>({
        mutationFn: ({ loginType }) => login(loginType),
        onSuccess: (res) => {
        },
        onError: (error) => {
            console.log("Error useLogin ----------------", error);
        }
    });
}
export { useGetSignature, useLogin };