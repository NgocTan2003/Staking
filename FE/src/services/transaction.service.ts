import axiosInstance from '../utils/hook/axiosInstance';

const getAllTransactionPaginated = async (page = 1, limit = 10, sort = 'Timestamp', order = 'desc') => {
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

const getUserTransactionPaginated = async (address = "0x0000000000000000000000000000000000000000", page = 1, limit = 10, sort = 'Timestamp', order = 'desc') => {
    const response = await axiosInstance.get(`/api/transactions/getUser/${address}`, {
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

const searchTransaction = async (address = "", page = 1, limit = 10, sort = 'Timestamp', order = 'desc') => {
    const response = await axiosInstance.get(`/api/transactions/search/${address}`, {
        params: {
            _page: page,
            _limit: limit,
            _sort: sort,
            _order: order
        },
        withCredentials: true
    });
    return response;
}


export { getAllTransactionPaginated, getUserTransactionPaginated, searchTransaction };