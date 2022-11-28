import { write, read } from "../utils/model.js";


let subCategoriesControllers = {
    GET: (req, res) => {
        let subCategories = read("subCategories")
        let products = read("products")

        subCategories.map((subcategory) => {
            subcategory.products = products.filter((product) => product.sub_category_id == subcategory.sub_category_id)
        })

        res.status(200).send(subCategories)
    },

    GETID: (req, res) => {
        let { sub_category_id } = req.params
        let subCategories = read("subCategories")
        let products = read("products")

        subCategories.map((subcategory) => {
            subcategory.products = products.filter((product) => product.sub_category_id == subcategory.sub_category_id)
        })

        let finded = subCategories.find((subcategory) => subcategory.sub_category_id == sub_category_id)

        if (finded) {
            res.status(200).send(finded)
        } else {
            res.status(404).send("Subcategory with this id does not exist")
        }
    },
    POST: (req, res) => {
        let { categoryId, subCategoryName } = req.body
        let subCategories = read("subCategories")
        let categories = read("categories")

        try {
            if (!(categoryId.length, subCategoryName.length, categories.find((category) => category.category_id == categoryId))) {
                throw Error("Bad request")
            }
            let newSubCategory = {
                "sub_category_id": subCategories.at(-1).sub_category_id + 1 || 1,
                "category_id": categoryId,
                "sub_category_name": subCategoryName
            }

            subCategories.push(newSubCategory)

            write("subCategories", subCategories)

            res.status(201).send({ status: 201, message: "SubCategory created successfully", data: newSubCategory })
        } catch (error) {
            res.status(400).send({ status: 400, message: "invalid categoryId or subCategoryName" })
        }
    },
    DELETE: (req, res) => {
        let { subcategoryId } = req.params
        let subCategories = read("subCategories")

        try {
            if (!(subCategories.find(subCategory => subCategory.sub_category_id == subcategoryId))) {
                throw Error("invalid id")
            }


            let deleted = subCategories.find((subCategory) => subCategory.sub_category_id == subcategoryId)
            subCategories = subCategories.filter((subCategory) => subCategory.sub_category_id != subcategoryId)

            write("subCategories", subCategories)

            res.status(200).send({ status: 200, message: "SubCategory deleted successfully", data: deleted })
        } catch (error) {
            res.status(400).send({ status: 400, message: "invalid subcategoryId" })
        }
    },

    PUT: (req, res)=> {
        let { subCategoryName } = req.body
        let { subcategoryId } = req.params
        let subcategories = read("subcategories")

        try {
            if (!(subcategories.find(subcategory=> subcategory.sub_category_id == subcategoryId && subCategoryName.length))) {
                throw Error("invalid data")
            }

            let finded = subcategories.find(subCategory => subCategory.sub_category_id == subcategoryId)
            finded.sub_category_name = subCategoryName

            write("subCategories" , subcategories)

            res.status(201).send({ status: 201, message: "SubCategory updated successfully", data: finded })
        } catch (error) {
            res.status(400).send({ status: 400, message: "invalid data" })
        }
    }
}

export default subCategoriesControllers