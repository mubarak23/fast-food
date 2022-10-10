// eslint-disable-next-line new-cap
const router = require("express").Router();
const { ExtractToken, Admin } = require("../middleware");
const { OrderController } = require("../controller/index");

// all requests must pass in a token
router.use(ExtractToken);

router
  .get("/:id", OrderController.get)
  .get("/", OrderController.getAll)
  .post("/", OrderController.post)
  .put("/:id", OrderController.update)
  .delete("/:id", OrderController.deleteOrder);

// all requests must be by ADMIN
router.use(Admin);
router.put("/status/:id", OrderController.updateStatus).use(Admin);

module.exports = router;
