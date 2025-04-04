import { type Model, mongoose, newModel } from "@leemons/mongodb";

export type GetKeyValueModel = {
  id: string;
  deploymentID: string;
  key: string;
  value: unknown;
  createdAt?: Date;
  updatedAt?: Date;
};

const keyValueSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      index: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// keyValueSchema.index({ deploymentID: 1, key: 1 }, { unique: true });

export function getKeyValueModel({
  modelName,
}: { modelName: string }): Model<GetKeyValueModel> {
  return newModel(mongoose.connection, modelName, keyValueSchema);
}

export { keyValueSchema };
