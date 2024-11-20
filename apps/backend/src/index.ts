import express from "express";
import cors from "cors"
import userAuthRoutes from "./routes/userRoutes/auth";
import workerAuthRoutes from "./routes/workerRoutes/auth";

const PORT = 8000
const app = express();

app.use(cors())
app.use(express.json())

app.use('/api/user', userAuthRoutes)
app.use('/api/worker', workerAuthRoutes)

app.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`);
})