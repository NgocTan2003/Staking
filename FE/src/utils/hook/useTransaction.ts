import { useQuery } from "@tanstack/react-query"
import { getAllTransactionPaginated, getUserTransactionPaginated, searchTransaction } from '../../services/transaction.service'


const useGetPaginatedAllTransaction = (page: number, limit: number, sort: string, order: string) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['paginatedAllTransactions', page, limit, sort, order],
        queryFn: () => getAllTransactionPaginated(page, limit, sort, order),
        staleTime: 5000,
    });

    return {
        totalDocs: data?.data.transactions.totalDocs || 0,
        allTransactions: data?.data.transactions.docs || [],
        totalAllPages: data?.data.transactions.totalPages || 1,
        currentPage: data?.data.transactions.page || page,
        isLoading,
        refetch,
    };
};

const useGetPaginatedUserTransaction = (address: string, page: number, limit: number, sort: string, order: string) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['paginatedUserTransactions', address, page, limit, sort, order],
        queryFn: () => getUserTransactionPaginated(address, page, limit, sort, order),
        enabled: !!address,
        staleTime: 5000,
    });

    return {
        totalDocs: data?.data.transactions.totalDocs || 0,
        allUserTransactions: data?.data.transactions.docs || [],
        totalUserPages: data?.data.transactions.totalPages || 1,
        currentPage: data?.data.transactions.page || page,
        isLoading,
        refetch,
    };
};

const useSearchTransaction = (flagSearch: boolean, address: string, page: number, limit: number, sort: string, order: string) => {
    console.log("aaa", flagSearch)
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['searchTransactions', address, page, limit, sort, order],
        queryFn: () => searchTransaction(address, page, limit, sort, order),
        enabled: !!address && flagSearch,
        staleTime: 5000,
    });

    return {
        totalDocs: data?.data.transactions.totalDocs || 0,
        dataSearchTransactions: data?.data.transactions.docs || [],
        totalSearchPages: data?.data.transactions.totalPages || 1,
        currentPage: data?.data.transactions.page || page,
        isLoading,
        refetch,
    };
};


export { useGetPaginatedAllTransaction, useGetPaginatedUserTransaction, useSearchTransaction };