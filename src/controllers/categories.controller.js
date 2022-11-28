import { write, read } from '../utils/model.js'


let categoriesController = {
    GET: (req, res) => {
        let categories = read("categories")
        let subCategories = read("subCategories")

        categories.map((category) => {
            category.subCategories = subCategories.filter((subcategories) => subcategories.category_id == category.category_id)
        })
        res.status(200).send(categories)
    },

    GETID: (req, res) => {
        let { category_id } = req.params
        let categories = read("categories")
        let subCategories = read("subCategories")
        categories.map((category) => {
            category.subCategories = subCategories.filter((subcategories) => subcategories.category_id == category.category_id)
        })

        let finded = categories.find(category => category.category_id == category_id)
        if (finded) {
            res.status(200).send(finded)
        } else {
            res.status(404).send("Category with this id does not exist")
        }
    },

    POST: (req, res) => {
        let { categoryName } = req.body
        let categories = read("categories")

        try {
            if (!categoryName) {
                throw Error("bad request")
            }
            let newCategory = {
                "category_name": categoryName,
                "category_id": categories.at(-1).category_id + 1 || 1
            }

            categories.push(newCategory)

            write("categories", categories)

            res.status(201).send({ status: 201, message: "Category created successfully", data: newCategory })
        } catch (error) {
            res.status(400).send({ status: 400, message: "invalid categoryName" })
        }
    },

    DELETE: (req, res) => {
        let { categoryId } = req.params
        let categories = read("categories")

        try {
            if (!(categories.find(category => category.category_id == categoryId))) {
                throw Error("invalid id")
            }

            let deleted = categories.find((category) => category.category_id == categoryId)
            categories = categories.filter((category) => category.category_id != categoryId)

            write("categories", categories)

            res.status(200).send({ status: 200, message: "Category deleted successfully", data: deleted })
        } catch (error) {
            res.status(400).send({ status: 400, message: "invalid categoryId" })
        }
    },
    PUT: (req, res) => {
        let categories = read("categories")
        let { categoryId } = req.params
        let { categoryName } = req.body
        try {
            if (!(categories.find(category => category.category_id == categoryId) && categoryName.length)) {
                throw Error("bad request")
            }
            let finded = categories.find(category => category.category_id == categoryId)
            finded.category_name = categoryName

            write("categories", categories)

            res.status(201).send({ status: 201, message: "Category updated successfully", data: finded })
        } catch (error) {
            res.status(400).send({ status: 400, message: "invalid categoryId or categoryName" })
        }
    }
}


export default categoriesController