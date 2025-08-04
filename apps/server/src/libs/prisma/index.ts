import { env } from '@api/env';
import { PrismaClient, Prisma } from '@prisma/client';

// Function to check if a model has deletedAt field using DMMF
function hasDeletedAtField(modelName: string): boolean {
  try {
    // Access Prisma's DMMF (Data Model Meta Format) to get schema information
    const dmmf = Prisma.dmmf;
    const model = dmmf.datamodel.models.find(
      (m) => m.name.toLowerCase() === modelName.toLowerCase()
    );
    if (!model) return false;

    // Check if the model has a deletedAt field
    return model.fields.some((field) => field.name === 'deletedAt');
  } catch (error) {
    // Fallback: if we can't access DMMF, assume no deletedAt field for safety
    console.warn(
      `Could not check deletedAt field for model ${modelName}:`,
      error
    );
    return false;
  }
}

const softDeleteExtension = Prisma.defineExtension({
  name: 'prisma-extensions',
  query: {
    $allModels: {
      async findUnique({ args, query, model }) {
        // Check if the model has a deletedAt field using DMMF
        if (hasDeletedAtField(model)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
      async findFirst({ args, query, model }) {
        // Check if the model has a deletedAt field using DMMF
        if (hasDeletedAtField(model)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
      async findMany({ args, query, model }) {
        // Check if the model has a deletedAt field using DMMF
        if (hasDeletedAtField(model)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
      async count({ args, query, model }) {
        // Check if the model has a deletedAt field using DMMF
        if (hasDeletedAtField(model)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
    },
  },
});

export const prisma = new PrismaClient({
  log: env.PRISMA_LOG_LEVEL,
}).$extends(softDeleteExtension);
