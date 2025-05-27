import { useQuery } from "@tanstack/react-query"
import { getTransactionPaginated } from '../../services/transaction.service'


const useGetPaginatedTransaction = (page: number, limit: number, sort: string, order: string) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['paginatedTransactions', page, limit, sort, order],
        queryFn: () => getTransactionPaginated(page, limit, sort, order),
        staleTime: 5000,
    });

    return {
        totalDocs: data?.data.transactions.totalDocs || 0,
        allTransactions: data?.data.
        transactions.docs || [],
        totalPages: data?.data.transactions.totalPages || 1,
        currentPage: data?.data.transactions.page || page,
        isLoading,
        refetch,
    };
};


export { useGetPaginatedTransaction };