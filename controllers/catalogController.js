import Catalog from "../models/Catalog.js";
import { verifyToken } from "../middleware/auth.js";
export const createCatalog = [
  verifyToken,
  async (req, res) => {
    try {
      const {
        name,
        latinName,
        thumbnailImage,
        detailImage,
        description,
        habitat,
        utility,
        taxonomy,
      } = req.body;

      if (
        !name ||
        !latinName ||
        !thumbnailImage ||
        !detailImage ||
        !description ||
        !habitat ||
        !utility ||
        !taxonomy.kingdom ||
        !taxonomy.division ||
        !taxonomy.class ||
        !taxonomy.ordo ||
        !taxonomy.family ||
        !taxonomy.genus ||
        !taxonomy.species
      ) {
        return res.status(400).json({
          status: 400,
          message: "Semua kolom diperlukan, silahkan isi kolom yang kosong.",
        });
      }

      const isAlreadyExist = await Catalog.findOne({ latinName });

      if (isAlreadyExist) {
        return res.status(400).json({
          status: 400,
          message: "Spesies ini sudah ada di katalog",
        });
      }

      const newCatalog = new Catalog({
        name,
        latinName,
        thumbnailImage,
        detailImage,
        description,
        habitat,
        utility,
        taxonomy,
      });

      await newCatalog.save();

      return res.status(201).json({
        status: 201,
        data: newCatalog,
        message: "Catalog berhasil ditambahkan",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  },
];

export const getAllCatalogs = async (req, res) => {
  try {
    const catalogs = await Catalog.find();

    if (catalogs.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Katalog tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: 200,
      data: catalogs,
      message: `${catalogs.length} Katalog ditemukan`,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

export const getCatalogById = async (req, res) => {
  try {
    const { catalogId } = req.params;

    if (!catalogId) {
      return res.status(400).json({
        status: 400,
        message: "ID Katalog diperlukan, tetapi tidak disediakan",
      });
    }

    const catalog = await Catalog.findById(catalogId);

    if (!catalog) {
      return res.status(404).json({
        status: 404,
        message: "Katalog tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: 200,
      data: catalog,
      message: "Katalog ditemukan",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

export const deleteCatalogById = [
  verifyToken,
  async (req, res) => {
    try {
      const { catalogId } = req.params;

      if (!catalogId) {
        return res.status(400).json({
          status: 400,
          message: "ID Katalog diperlukan, tetapi tidak disedikan",
        });
      }

      const deletedCatalog = await Catalog.findByIdAndDelete(catalogId);

      if (!deletedCatalog) {
        return res.status(404).json({
          status: 404,
          message: "Katalog tidak ditemukan",
        });
      }

      return res.status(200).json({
        status: 200,
        data: deletedCatalog,
        message: "Catalog berhasil dihapus",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  },
];

export const editCatalogById = [
  verifyToken,
  async (req, res) => {
    try {
      const {
        name,
        latinName,
        thumbnailImage,
        detailImage,
        description,
        habitat,
        utility,
        taxonomy,
      } = req.body;

      const { catalogId } = req.params;

      if (!catalogId) {
        return res.status(400).json({
          status: 400,
          message: "ID Katalog diperlukan, tetapi tidak disedikan",
        });
      }

      if (
        !name ||
        !latinName ||
        !thumbnailImage ||
        !detailImage ||
        !description ||
        !habitat ||
        !utility ||
        !taxonomy.kingdom ||
        !taxonomy.division ||
        !taxonomy.class ||
        !taxonomy.ordo ||
        !taxonomy.family ||
        !taxonomy.genus ||
        !taxonomy.species
      ) {
        return res.status(400).json({
          status: 400,
          message: "Semua kolom diperlukan, silahkan isi kolom yang kosong.",
        });
      }

      const editedCatalog = await Catalog.findById(catalogId);

      if (!editedCatalog) {
        return res.status(404).json({
          status: 404,
          message: "Katalog tidak ditemukan",
        });
      }

      editedCatalog.set("name", name);
      editedCatalog.set("latinName", latinName);
      editedCatalog.set("thumbnailImage", thumbnailImage);
      editedCatalog.set("detailImage", detailImage);
      editedCatalog.set("description", description);
      editedCatalog.set("habitat", habitat);
      editedCatalog.set("utility", utility);
      editedCatalog.set("taxonomy", taxonomy);
      await editedCatalog.save();

      return res.status(200).json({
        status: 200,
        data: editedCatalog,
        message: "Katalog berhasil diedit",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  },
];
