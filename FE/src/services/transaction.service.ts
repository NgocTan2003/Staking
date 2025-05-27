import axiosInstance from '../utils/hook/axiosInstance';

const getTransactionPaginated = async (page = 1, limit = 10, sort = 'Timestamp', order = 'desc') => {
    const response = await axiosInstance.get("/api/transactions/getAll", {
        params: {
            _page: page,
            _limit: limit,
            _sort: sort,
            _order: order
        },
        withCredentials: true
    });
    return response;
};


export { getTransactionPaginated };