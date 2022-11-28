import { write, read } from '../utils/model.js'


let productControllers = {

    GET: (req, res) => {
        let { categoryId, subCategoryId, model } = req.query
        let categories = read("categories")
        let subCategories = read("subCategories")
        let products = read("products")

        if (categoryId) {
            try {
                let findedProducts = []
                subCategories.filter((subcategory) => {
                    if (subcategory.category_id == categoryId) {
                        products.filter((product) => {
                            if (product.sub_category_id == subcategory.sub_category_id) {
                                findedProducts.push(product)
                            }
                        })
                    }
                })
                if (!(findedProducts.length <= 1)) {
                    return res.status(200).send(findedProducts)
                } else {
                    throw Error("Products with this options does not exist")
                }
            } catch (error) {
                return res.status(404).send("Products with this options does not exist")
            }
        }

        let querryResult = products.filter((product) => {

            let subcategory = subCategoryId ? product.sub_category_id == subCategoryId : true
            let productModel = model ? product.model == model : true

            return subcategory && productModel
        })

        if (querryResult.length) {
            res.status(200).send(querryResult)
        } else {
            res.status(404).send("Products with this options does not exist")
        }
    },

    GETID: (req, res) => {
        let { product_id } = req.params


        let products = read("products")


        let findedProducts = products.filter((product) => {
            return product.product_id == product_id
        })

        if (findedProducts.length) {
            res.status(200).send(findedProducts)
        } else {
            res.status(404).send("Product with this id does not exist")
        }
    },

    POST: (req, res) => {
        let { subCategoryId, productName, price, color, model } = req.body
        let subCategories = read("subCategories")
        let products = read("products")


        try {
            if (!(subCategoryId.length, productName.length, price, color.length, model.length, subCategories.find((subcategory) => subcategory.sub_category_id == subCategoryId))) {
                throw Error("Bad request")
            }

            let newProduct = {
                "product_id": products.at(-1).product_id + 1 || 1,
                "sub_category_id": subCategoryId,
                "model": model,
                "product_name": productName,
                "color": color,
                "price": price
            }

            products.push(newProduct)

            write("products", products)


            res.status(201).send({ status: 201, message: "Product created successfully", data: newProduct })
        } catch (error) {
            res.status(400).send({ status: 400, message: "invalit subCategoryId or productName or price or color or model" })
        }
    },

    DELETE: (req, res) => {
        let { productId } = req.params
        let products = read("products")

        try {
            if (!(products.find(product => product.product_id == productId))) {
                throw Error("invalit id")
            }

            let deleted = products.find((product) => product.product_id == productId)
            products = products.filter((product) => product.product_id != productId)

            write("products", products)

            res.status(200).send({ status: 200, message: "Product deleted successfully", data: deleted })
        } catch (error) {
            res.status(400).send({ status: 400, message: "invalit productId" })
        }
    },

    PUT: (req, res) => {
        let { productId } = req.params
        let { productName, price, color, model } = req.body
        let products = read("products")

        try {
            if (!(products.find(product => product.product_id == productId && productName.length && price, color.length, model.length))) {
                throw Error("invalit Data")
            }

            let finded = products.find(product => product.product_id == productId)
            finded.product_name = productName
            finded.price = price
            finded.color = color
            finded.model = model

            write("products", products)

            res.status(201).send({ status: 201, message: "product updated successfully", data: finded })
        } catch (error) {
            res.status(400).send({ status: 400, message: "invalit data" })
        }
    }

}

export default productControllers