/** load library express */
const express = require(`express`)

/** create object that instances of express */
const app = express()

/** define port of server */
const PORT = 8000

/** load library cors */
const cors = require(`cors`)

/** open CORS policy */
app.use(cors())

// ENDPOINT HERE
/** define all routes */
const auth = require(`./routes/auth.route`)
const memberRoute = require(`./routes/member.route`)
const adminRoute = require(`./routes/admin.route`)
const bookRoute = require(`./routes/book.route`)
const borrowRoute = require(`./routes/borrow.route`)

/** define prefix for each route */
app.use(`/auth`, auth)
app.use(`/member`, memberRoute)
app.use(`/admin`, adminRoute)
app.use(`/book`, bookRoute)
app.use(`/borrow`, borrowRoute)

/** route to access uploaded file */
app.use(express.static(__dirname))

/** run server based on defined port */
app.listen(PORT, () => {
    console.log(`Server of School's Library runs on port ${PORT}`)
})
