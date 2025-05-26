import axiosInstance from '../utils/hook/axiosInstance';

export const getTransactionPaginated = async (page = 1, limit = 5, sort = 'createdAt', order = 'desc') => {
    const response = await axiosInstance.get("/note/getlist", {
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
