import { useMutation, useQuery } from "@tanstack/react-query"
import { getTransactionPaginated } from '../../services/transaction.service'


export const useGetPaginatedTransaction = (page: number, limit = 5) => {
    // const { data, isLoading, refetch } = useQuery({
    //     queryKey: ['paginatedNotes', page, limit],
    //     queryFn: () => getTransactionPaginated(page, limit),
    //     keepPreviousData: true,
    // });

    // return {
    //     allNotes: data?.data.notes.docs || [],
    //     totalPages: data?.data.notes.totalPages || 1,
    //     currentPage: data?.data.notes.page || page,
    //     isLoading,
    //     refetch,
    // };
};