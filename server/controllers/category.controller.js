const Category = require('../models/Category')
const Image = require('../models/Image')
const getError = require('../utils/dbErrorHandler')
const {deleteImages} = require('../utils/multipleImageOperations')

module.exports = {

    // @desc      Create Category
    // @route     POST /api/v1/categories
    // @access    Private

    createCategory : async (req,res) => {
        try{
            const cat = new Category({
                name : req.body.name
            })
            const image = new Image()
            let response = await image.upload(cat._id,req.body.image,'Category')
            if(response){
                try{
                    cat.image = response
                    await cat.save()
                    await image.save()
                    return res.status(201).json({
                        err: false,
                        data : await Category.populate(cat,{
                            path : 'image',
                            select : 'public_id url'
                        }),
                        message: 'Category created successfully.'
                    })
                }catch(error){
                    await image.delete()
                    return res.status(400).json({
                        err: true,
                        message: getError(error)
                    })
                }
            }else{
                return res.status(400).json({
                    err: true,
                    message: 'Could not upload image.'
                })                
            }
        }
        catch(error){
            return res.status(400).json({
                err: true,
                msg: "Could not create category."
            })
        }
    },

    // @desc      Update Category
    // @route     PATCH /api/v1/categories/:id
    // @access    Private

    updateCategory : async(req,res) => {
        try{
            if(!req.params.id){
                return res.status(400).json({
                    err: true,
                    msg: "Id was not specified."
                })
            }
            let category = await Category.findById(req.params.id)
            if(!category._doc){
                return res.status(400).json({
                    err: true,
                    msg: "No such category exists."
                })
            }
            if(req.body.name){
                category.name = req.body.name
            }
            if(req.body.image){
                if(category.image){
                    await deleteImages([category.image])
                }
                let image = new Image()
                let response = await image.upload(category._id,req.body.image,'Category')
                if(response){
                    category.image = response
                    await image.save()
                }
            }
            await category.save()
            await Category.populate(category,{
                path : 'image',
                select : 'public_id url'
            })
            return res.status(200).json({
                err : false,
                msg : "Category updated successfully.",
                data : category._doc
            })
        }catch(error){
            console.log(error)
            return res.status(400).json({
                err: true,
                msg: "Can not update category."
            })
        }
    },

    // @desc      Get Categories
    // @route     GET /api/v1/categories
    // @access    Public

    getCategories : async (req,res) => {
        if(res.results.err){
            return res.status(404).json(res.results)
        }else if(res.results.metadata.count == 0){
            return res.status(404).json({
                err : true,
                metadata : {
                    msg : "No Categories found."
                }
            })
        }else{
            return res.status(200).json(res.results)
        }
    },
    
    // @desc      Get Categories by Id
    // @route     GET /api/v1/categories/:id
    // @access    Public

    getCategorybyId : async (req,res) => {
        if(res.results.err){
            return res.status(404).json(res.results)
        }else if(res.results.data == null){
            return res.status(404).json({
                err : true,
                metadata : {
                    msg : "No Category found."
                }
            })
        }else{
            return res.status(200).json(res.results)
        }
    },

}