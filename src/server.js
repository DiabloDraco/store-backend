import express from 'express'
import cors from 'cors'
import productControllers from './controllers/products.controller.js'
import categoriesController from './controllers/categories.controller.js'
import subCategoriesControllers from './controllers/subcategories.controller.js'

const app = express()

app.use(express.json())
app.use(cors())

// PRODUCTS 

app.get("/products", productControllers.GET)
app.get("/products/:product_id", productControllers.GETID)
app.post("/products", productControllers.POST)
app.delete("/products/:productId" , productControllers.DELETE)
app.put("/products/:productId" , productControllers.PUT)

// CATEGORIES

app.get("/categories", categoriesController.GET)
app.get("/categories/:category_id", categoriesController.GETID)
app.post("/categories", categoriesController.POST)
app.delete("/categories/:categoryId", categoriesController.DELETE)
app.put("/categories/:categoryId" , categoriesController.PUT)

// SUBCATEGORIES

app.get("/subcategories", subCategoriesControllers.GET)
app.get("/subcategories/:sub_category_id", subCategoriesControllers.GETID)
app.post("/subcategories", subCategoriesControllers.POST)
app.delete("/subcategories/:subcategoryId", subCategoriesControllers.DELETE)
app.put("/subcategories/:subcategoryId" , subCategoriesControllers.PUT)



app.listen(4321, () => console.log("server started at *4321"))