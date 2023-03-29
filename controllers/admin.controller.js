/** load model for `admins` table */
const adminModel = require(`../models/index`).admin

/** load Operation from  Sequelize  */
const Op = require(`sequelize`).Op

/** create function for read all data */
exports.coba = async (request, response) => {
    var query = request.query;
  
    // cek apakah tidak ada parameter yang diberikan
    if (Object.keys(query).length === 0) {
        console.log('No parameter is given');
    }
    
    // cek apakah parameter name diberikan atau tidak
    if (query.hasOwnProperty('name')) {
        console.log('name parameter is given');
    }
    
    // cek apakah parameter age diberikan atau tidak
    if (query.hasOwnProperty('age')) {
        console.log('age parameter is given');
    }
    response.send('Hello World!');
}

/** create function for read all data */
exports.getAdmin = async (request, response) => {
    /** call findAll() to get all data */
    let admins = await adminModel.findAll()
    return response.json({
        success: true,
        data: admins,
        message: `All Admins have been loaded`
    })
    
}

/** create function for read data by Id */
exports.getByIdAdmin = async (request, response) => {
    /** define id admin */
    let idAdmin = request.params.id
    
    /** call findAll() to get all data */
    let admin = await adminModel.findAll({ where: { id: idAdmin } })
    return response.json({
        success: true,
        data: admin,
        message: `Admin data have been loaded`
    })
}

/** create function for filter */
exports.findAdmin = async (request, response) => {
    /** define keyword to find data */
    let keyword = request.body.keyword

    /** call findAll() within where clause and operation 
     * to find data based on keyword  */
    let admins = await adminModel.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.substring]: keyword } },
                { contact: { [Op.substring]: keyword } },
                { address: { [Op.substring]: keyword } },
                { username: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
        success: true,
        data: admins,
        message: `All Admins have been loaded`
    })
}

/** create function for add new admin */
exports.addAdmin = (request, response) => {
    /** prepare data from request */
    let newAdmin = {
        name: request.body.name,
        contact: request.body.contact,
        address: request.body.address,
        username: request.body.username,
        password: request.body.password
    }

    /** execute inserting data to admin's table */
    adminModel.create(newAdmin)
        .then(result => {
            /** if insert's process success */
            return response.json({
                success: true,
                data: result,
                message: `New admin has been inserted`
            })
        })
        .catch(error => {
            /** if insert's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for update admin */
exports.updateAdmin = (request, response) => {
    /** prepare data that has been changed */
    let dataAdmin = {
        name: request.body.name,
        contact: request.body.contact,
        address: request.body.address,
        username: request.body.username,
        password: request.body.password
    }
    /** define id admin that will be update */
    let idAdmin = request.params.id

    /** execute update data based on defined id admin */
    adminModel.update(dataAdmin, { where: { id: idAdmin } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data admin has been updated`
            })
        })
        .catch(error => {
            /** if update's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for delete data  */
exports.deleteAdmin = (request, response) => {
    /** define id admin that will be update */
    let idAdmin = request.params.id

    /** execute delete data based on defined id admin */
    adminModel.destroy({ where: { id: idAdmin } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data admin has been deleted`
            })
        })
        .catch(error => {
            /** if update's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}
