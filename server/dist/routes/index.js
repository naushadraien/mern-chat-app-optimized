import authRouter from "./auth.js";
const baseRouter = "/api/v1";
const mainRouter = (app) => {
    app.use(`${baseRouter}/user`, authRouter);
};
export { mainRouter };
