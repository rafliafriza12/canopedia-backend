import express from "express";
import {
  createCatalog,
  getAllCatalogs,
  getCatalogById,
  deleteCatalogById,
  editCatalogById,
} from "../controllers/catalogController.js";

const catalogRouter = express.Router();

catalogRouter.post("/createCatalog", createCatalog);
catalogRouter.get("/getAllCatalogs", getAllCatalogs);
catalogRouter.get("/getCatalogById/:catalogId", getCatalogById);
catalogRouter.delete("/deleteCatalogById/:catalogId", deleteCatalogById);
catalogRouter.put("/editCatalogById/:catalogId", editCatalogById);

export default catalogRouter;
