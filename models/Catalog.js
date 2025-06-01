import mongoose from "mongoose";

const Catalog = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    latinName: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnailImage: {
      type: String,
      required: true,
    },
    detailImage: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    habitat: {
      type: String,
      required: true,
    },
    utility: {
      type: String,
      required: true,
    },
    taxonomy: {
      kingdom: {
        type: String,
        required: true,
      },
      division: {
        type: String,
        required: true,
      },
      class: {
        type: String,
        required: true,
      },
      ordo: {
        type: String,
        required: true,
      },
      family: {
        type: String,
        required: true,
      },
      genus: {
        type: String,
        required: true,
      },
      species: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Catalog", Catalog);
