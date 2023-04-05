/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load borrow's controller */
const borrowController = require(`../controllers/borrow.controller`)

/** load authorization function from controllers */
const { authorize } = require(`../controllers/auth.controller`)

/** create route to add new borrowing book */
app.post("/", [authorize], borrowController.addBorrowing)

/** create route to update borrowed book based on ID */
app.put("/:id", [authorize], borrowController.updateBorrowing)

/** create toute to delete borrowed book based on ID */
app.delete("/:id", [authorize], borrowController.deleteBorrowing)

/** create route to return book */
app.get("/return/:id", [authorize], borrowController.returnBook)

/** create route to get all borrowed book */
app.get("/", [authorize], borrowController.getBorrow)

/** export app in order to load in another file */
module.exports = app
