import { RelationOptions } from "typeorm";

export interface CustomRelationOptions extends RelationOptions {
  foreignKeyConstraintName?: string;
}
