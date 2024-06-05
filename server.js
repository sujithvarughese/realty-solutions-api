import app from "./app.js"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()
const port = process.env.PORT || 8800

const start = async () => {
	try {
		await connectDatabase(process.env.MONGO_URI)
		app.listen(port, () => {
			console.log(`Server is listening on port ${port}...`);
		})
	} catch (error) {
		console.log(error);
	}
}

// connect to mongoDB
const connectDatabase = async (url) => {
	try {
		await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log("Connected to Database");
	} catch (error) {
		console.log(error);
	}
}

start()