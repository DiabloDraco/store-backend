import express from 'express'
import cors from 'cors'
import productControllers from './controllers/products.controller.js'
import categoriesController from './controllers/categories.controller.js'
import subCategoriesControllers from './controllers/subcategories.controller.js'
import jwt from 'jsonwebtoken'
import { read } from './utils/model.js'
import { SECRET } from './config.js'
let PORT = process.env.PORT || 4321

const app = express()

app.use(express.json())
app.use(cors())

function checkToken(req , res , next) {
    try {
        let { token }  = req.headers
        jwt.verify(token , SECRET)
        next()
    } catch (error) {
        res.json({status:403 , message: error.message})
    }
}

// LOGIN

app.post("/login" , (req , res)=>{
    let { username , password } = req.body
    let users = read("users")
    let finded = users.find(user=> user.username == username && user.password ==  password)
    if (finded) {
        res.status(200).json({status:200 , token: jwt.sign(finded.userId, SECRET)}) 
    }else{
        res.status(403).json({status:403 , message:"Invalid username or password"})
    }
})

// PRODUCTS 

app.get("/products", productControllers.GET)
app.get("/products/:product_id", productControllers.GETID)
app.post("/products", checkToken , productControllers.POST)
app.delete("/products/:productId" , checkToken , productControllers.DELETE)
app.put("/products/:productId" , checkToken , productControllers.PUT)

// CATEGORIES

app.get("/categories", categoriesController.GET)
app.get("/categories/:category_id", categoriesController.GETID)
app.post("/categories", checkToken , categoriesController.POST)
app.delete("/categories/:categoryId", checkToken , categoriesController.DELETE)
app.put("/categories/:categoryId" , checkToken , categoriesController.PUT)

// SUBCATEGORIES

app.get("/subcategories", subCategoriesControllers.GET)
app.get("/subcategories/:sub_category_id", subCategoriesControllers.GETID)
app.post("/subcategories", checkToken , subCategoriesControllers.POST)
app.delete("/subcategories/:subcategoryId", checkToken , subCategoriesControllers.DELETE)
app.put("/subcategories/:subcategoryId" , checkToken , subCategoriesControllers.PUT)



app.listen(PORT, () => console.log(`server started at *${PORT}`))