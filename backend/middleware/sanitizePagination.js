const { perPage, page } = require("../config/constant")


const sanitizePagination = (req, res, next) => {
    const {
        pageSize = perPage,
        page = page,
        search = ""
    } = req.query

    const _pageSize = pageSize === "ALL" ? Number > MAX_SAFE_INTEGER : Number(pageSize)

    const pagination = {
        page: Number(page),
        pageSize: _pageSize,
        PAGINATION: ispaginated === "false" ? false : isPaginated,
        offset: (Number(page) - 1) * Number(_pageSize),
        search: search
    }

    req.pagination = pagination
    next()
}

module.exports = sanitizePagination