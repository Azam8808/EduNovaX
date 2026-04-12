const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
<<<<<<< HEAD

const database = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");

=======
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
>>>>>>> 640d9f0 (updated code)
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
<<<<<<< HEAD
const PORT = process.env.PORT || 8000;
=======
const PORT = process.env.PORT || 3000;
>>>>>>> 640d9f0 (updated code)

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin:"*",
        credentials:true,
    })
);

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
<<<<<<< HEAD

=======
>>>>>>> 640d9f0 (updated code)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
<<<<<<< HEAD
app.use("/api/v1/reach", contactUsRoute); 
=======
app.use("/api/v1/reach", contactUsRoute);
>>>>>>> 640d9f0 (updated code)

//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})
