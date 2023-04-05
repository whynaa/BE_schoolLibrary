/** load model for `borrow` table */
const borrowModel = require(`../models/index`).borrow

/** load model for `details_of_borrow` table */
const detailsOfBorrowModel = require(`../models/index`).details_of_borrow

/** load model for `book` table */
const bookModel = require(`../models/index`).book

/** load Operator from  Sequelize  */
const Op = require(`sequelize`).Op

/** create function for add book borrowing */
exports.addBorrowing = async (request, response) => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 86400000);

    /** prepare data for borrow's table */
    let newData = {
        memberID: request.body.memberID,
        adminID: request.body.adminID,
        date_of_borrow: today.toLocaleDateString(),
        date_of_return: nextWeek.toLocaleDateString(),
        status: false
    }

    /** execute for inserting to borrow's table */
    borrowModel.create(newData)
        .then(result => {
            /** get the latest id of book borrowing */
            let borrowID = result.id

            /** store details of book borrowing from request
             * (type: array object)
             */

            let detailsOfBorrow = request.body.detailsOfBorrow

            /** insert borrowID to each item of detailsOfBorrow */
            for (let i = 0; i < detailsOfBorrow.length; i++) {
                detailsOfBorrow[i].borrowID = borrowID
                bookModel.findByPk(detailsOfBorrow[i].bookID)
                .then(result => {
                    newStock = result.stock - detailsOfBorrow[i].qty
                    bookModel.update({stock : newStock}, { where: { id: detailsOfBorrow[i].bookID } })
                })
                .catch(error => {
                    console.log(error.message)
                })
                    
            }

            /** insert all data of detailsOfBorrow */
            detailsOfBorrowModel.bulkCreate(detailsOfBorrow)
                .then(result => {
                    return response.json({
                        success: true,
                        message: `New Book Borrowed has been inserted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
            
            /** update stock in each item of book */

        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for update book borrowing */
exports.updateBorrowing = async (request, response) => {
    /** prepare data for borrow's table */
    let newData = {
        memberID: request.body.memberID,
        adminID: request.body.adminID,
        date_of_borrow: request.body.date_of_borrow,
        date_of_return: request.body.date_of_return,
        status: request.body.status
    }

    /** prepare parameter Borrow ID */
    let borrowID = request.params.id

    /** execute for inserting to borrow's table */
    borrowModel.update(newData, { where: { id: borrowID } })
        .then(async result => {

            /** delete all detailsOfBorrow based on borrowID */
            await detailsOfBorrowModel.destroy(
                { where: { borrowID: borrowID } }
            )

            /** store details of book borrowing from request
             * (type: array object)
             */

            let detailsOfBorrow = request.body.details_of_borrow

            /** insert borrowID to each item of detailsOfBorrow */
            for (let i = 0; i < detailsOfBorrow.length; i++) {
                detailsOfBorrow[i].borrowID = borrowID

            }

            /** re-insert all data of detailsOfBorrow */
            detailsOfBorrowModel.bulkCreate(detailsOfBorrow)
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Book Borrowed has been updated`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })

        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for delete book borrowing's data */
exports.deleteBorrowing = async (request, response) => {
    /** prepare borrowID that as paramter to delete */
    let borrowID = request.params.id

    /** delete detailsOfBorrow using model */
    detailsOfBorrowModel.destroy(
        { where: { borrowID: borrowID } }
    )
        .then(result => {
            /** delete borrow's data using model */
            borrowModel.destroy({ where: { id: borrowID } })
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Borrowing Book's has deleted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for return borrowed book */
exports.returnBook = async (request, response) => {
    /** prepare borrowID that will be return */
    let borrowID = request.params.id

    /** prepare current time for return's time */
    let today = new Date()
    let currentDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

    let detailsOfBorrow = await detailsOfBorrowModel.findAll({ where: {borrowID: borrowID }})
    detailsOfBorrow.forEach(detail => {
        bookModel.findByPk(detail.bookID)
                .then(result => {
                    newStock = result.stock + detail.qty
                    bookModel.update({stock : newStock}, { where: { id: detail.bookID } })
                })
                .catch(error => {
                    console.log(error.message)
                })
    });

    /** update status and date_of_return from borrow's data */
    borrowModel.update({
            date_of_return: currentDate,
            status: true
        },{
            where: { id: borrowID }
        })
        .then(result => {
            return response.json({
                success: true,
                message: `Book has been returned`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for get all borrowing data */
exports.getBorrow = async (request, response) => {
    let data = await borrowModel.findAll(
        {
            include: [
                `member`, `admin`,
                {
                    model: detailsOfBorrowModel,
                    as: `details_of_borrow`,
                    include: ["book"]
                }
            ]
        }
    )

    return response.json({
        success: true,
        data: data,
        message: `All borrowing book have been loaded`
    })
}
