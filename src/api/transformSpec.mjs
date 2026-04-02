import { defineTransformer } from "orval";

function addEnumVarnames(schema) {
  if (!schema || typeof schema !== "object") return;
  if (schema.enum) {
    schema["x-enum-varnames"] = schema.enum;
  }
  for (const value of Object.values(schema)) {
    if (value && typeof value === "object") {
      addEnumVarnames(value);
    }
  }
}

export default defineTransformer((spec) => {
  for (const path of Object.values(spec.paths ?? {})) {
    for (const operation of Object.values(path)) {
      if (operation?.operationId) {
        operation.operationId = `${operation.operationId}Base`;
      }
    }
  }

  addEnumVarnames(spec);

  return spec;
});
