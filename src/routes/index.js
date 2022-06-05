//instantiate express module here
const express = require('express')

// Init express router here..
const router = express.Router()

// Get controller here
const {auth} = require('../middlewares/auth')
const {uploadFile} = require('../middlewares/uploadFile')
const {getUsers, deleteUser, getUserProducts} = require('../controllers/user')
const {Register, login, checkAuth} = require('../controllers/auth')
const { addProduct, getProducts, updateProduct, getProduct, deleteProduct } = require('../controllers/product')
const { addCategory, getCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/category')
const {addTransaction, getTransactions, getTransaction} = require('../controllers/transaction')

router.post('/register', Register)
router.post('/login', login)
router.get('/check-auth', auth, checkAuth)
router.get('/users',auth, getUsers)
router.delete('/deleteUser/:id', deleteUser)
router.get('/userproducts', getUserProducts)

router.post('/addproduct', auth, uploadFile('image'), addProduct)
router.get('/products', getProducts)
router.patch("/updateproducts/:id", uploadFile("image"), updateProduct);
router.get("/product/:id", getProduct);
router.delete("/deleteproduct/:id", auth, deleteProduct);

router.get('/categories', getCategories)
router.get('/category/:id', getCategory)
router.post('/addcategory', addCategory)
router.patch('/updatecategory/:id', updateCategory)
router.delete('/deletecategory/:id', deleteCategory)

router.post("/addtransaction", auth, addTransaction);
router.get("/transactions", auth, getTransactions);
router.get('/transaction/:id',auth, getTransaction)

module.exports = router