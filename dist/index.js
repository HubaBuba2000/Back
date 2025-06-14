import express from "express";
import profileRouter from "./routes/profile.routes.js";
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use('/api', profileRouter);
app.listen(PORT, () => console.log(`server started on ${PORT}`));
// "start": "ts-node-dev --respawn --transpile-only --exit-child -r tsconfig-paths/register src/index.ts",
// "test": "echo \"Error: no test specified\" && exit 1"
