/** load model for `members` table */
const memberModel = require(`../models/index`).member

/** load Operation from  Sequelize  */
const Op = require(`sequelize`).Op

/** load library 'path' and 'filestream' */
const path = require(`path`)
const fs = require(`fs`)

/** load function from `upload-photo`
 * single(`photo`) means just upload one file
 * with request name `photo`
 */
const upload = require(`./upload-photo`).single(`photo`)

/** create function for read all data */
exports.getAllMember = async (request, response) => {
    /** call findAll() to get all data */
    let members = await memberModel.findAll()
    return response.json({
        success: true,
        data: members,
        message: `All Members have been loaded`
    })
}

/** create function for read data by Id */
exports.getByIdMember = async (request, response) => {
    /** define id admin */
    let idMember = request.params.id
    
    /** call findAll() to get all data */
    let member = await memberModel.findAll({ where: { id: idMember } })
    return response.json({
        success: true,
        data: member,
        message: `Member data have been loaded`
    })
}

/** create function for filter */
exports.findMember = async (request, response) => {
    /** define keyword to find data */
    let keyword = request.body.keyword

    /** call findAll() within where clause and operation 
     * to find data based on keyword  */
    let members = await memberModel.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.substring]: keyword } },
                { gender: { [Op.substring]: keyword } },
                { address: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
        success: true,
        data: members,
        message: `All Members have been loaded`
    })
}

/** create function for add new member */
exports.addMember = (request, response) => {
    /** run function upload */
    upload(request, response, async error => {
        /** check if there are error when upload */
        if (error) {
            return response.json({ message: error })
        }

        /** check if file is empty */
        if (!request.file) {
            return response.json({ message: `Nothing to Upload` })
        }

        /** prepare data from request */
        let newMember = {
            name: request.body.name,
            address: request.body.address,
            gender: request.body.gender,
            contact: request.body.contact,
            photo: request.file.filename
        }

        /** execute inserting data to member's table */
        memberModel.create(newMember)
        .then(result => {
            /** if insert's process success */
            return response.json({
                success: true,
                data: result,
                message: `New member has been inserted`
            })
        })
        .catch(error => {
            /** if insert's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
    })
}

/** create function for update member */
exports.updateMember = (request, response) => {
    /** run upload function */
    upload(request, response, async error => {
        /** check if there are error when upload */
        if (error) {
            return response.json({ message: error })
        }

        /** define id member that will be update */
        let idMember = request.params.id

        /** prepare data that has been changed */
        let dataMember = {
            name: request.body.name,
            address: request.body.address,
            gender: request.body.gender,
            contact: request.body.contact
        }

        /** check if file is not empty,
         * it means update data within reupload file
         */
        if (request.file) {
            /** get selected member's data */
            const selectedMember = await memberModel.findOne({
                where: { id: idMember }
            })

            /** get old filename of photo file */
            const oldPhotoMember = selectedMember.photo

            if (oldPhotoMember !== null){
                /** prepare path of old photo to delete file */
                const pathPhoto = path.join(__dirname, `../image/photo`, oldPhotoMember)

                /** check file existence */
                if (fs.existsSync(pathPhoto)) {
                    /** delete old photo file */
                    fs.unlink(pathPhoto, error => console.log(error))
                }
            }

            /** add new photo filename to member object */
            dataMember.photo = request.file.filename    
        }

        /** execute update data based on defined id member */
        memberModel.update(dataMember, { where: { id: idMember } })
            .then(result => {
                /** if update's process success */
                return response.json({
                    success: true,
                    message: `Data member has been updated`
                })
            })
            .catch(error => {
                /** if update's process fail */
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    })
}

/** create function for delete data  */
exports.deleteMember = async (request, response) => {
    /** define id member that will be update */
    let idMember = request.params.id

    /** -- delete photo file -- */
    /** get selected member's data */
    const member = await memberModel.findOne({ where: { id: idMember } })
    /** get old filename of photo file */
    const oldPhotoMember = member.photo

    if (oldPhotoMember !== null){
        /** prepare path of old photo to delete file */
        const pathPhoto = path.join(__dirname, `../image/photo`, oldPhotoMember)

        /** check file existence */
        if (fs.existsSync(pathPhoto)) {
            /** delete old photo file */
        fs.unlink(pathPhoto, error => console.log(error))
        }
    }
    /** -- end of delete photo file -- */    

    /** execute delete data based on defined id member */
    memberModel.destroy({ where: { id: idMember } })
        .then(result => {
            /** if delete's process success */
            return response.json({
                success: true,
                message: `Data member has been deleted`
            })
        })
        .catch(error => {
            /** if delete's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}
