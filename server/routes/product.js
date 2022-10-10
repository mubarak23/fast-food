const router = require("express").Router();
const { ExtractToken, Admin } = require("../middleware");
const { ProductFileManager } = require("../service");
const { ProductController } = require("../controller/index");

router.get('/', ProductController.getAllProducts).get('/:id', ProductController.getProduct)

router.use(ExtractToken);

//product Review Route
router.post('/review/:id', ProductController.addReview)
             .put('/review/:id', ProductController.updateReview)
             .delete('/review/"id', ProductController.deleteReview)

// product routes
router.use(Admin)

router.post('/', ProductFileManager.cloudinary, ProductController.addProduct)
             .put('/:id', ProductFileManager.cloudinary, ProductController.updateProduct)
             .delete('/:id', ProductFileManager.cloudinary, ProductController.deleteProduct)


 module.exports = router 
