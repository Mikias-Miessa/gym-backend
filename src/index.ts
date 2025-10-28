import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import logger from "./utils/logger.js";
import config from "./config/index.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import planRoutes from "./routes/plans.js";
import memberRoutes from "./routes/members.js";
import paymentRoutes from "./routes/payments.js";
import dashboardRoutes from "./routes/dashboard.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

const swaggerDocument = YAML.load("./swagger.yaml");
// Dynamically set servers from env or fallback to local
swaggerDocument.servers = [
  {
    url: process.env.SWAGGER_SERVER_URL || `http://localhost:${config.port}`,
  },
];
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
  logger.info(`Swagger docs available at /api/docs`);
});
