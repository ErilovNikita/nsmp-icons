import path from "node:path";
import { fileURLToPath } from "node:url";
import { getIconFiles } from "./icon-files.mjs";
import { generateRootIndex, generateRootTypes } from "./generate-root-index.mjs";
import {
  generateCreateIcon,
  generateVueComponents,
  generateVueIndex,
  generateVueTypes,
} from "./generate-vue-index.mjs";
import { writeGeneratedFiles } from "./write-generated-files.mjs";

const projectRoot = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const iconsDirectory = path.join(projectRoot, "icons");
const sourceDirectory = path.join(projectRoot, "src");
const vueDirectory = path.join(sourceDirectory, "vue");

const iconFiles = await getIconFiles(iconsDirectory);

await writeGeneratedFiles({
  sourceDirectory,
  vueDirectory,
  rootIndex: generateRootIndex(iconFiles),
  rootTypes: generateRootTypes(iconFiles),
  vueIndex: generateVueIndex(iconFiles),
  vueTypes: generateVueTypes(iconFiles),
  vueComponents: generateVueComponents(iconFiles),
  createIcon: generateCreateIcon(),
});

console.error(`Generated ${iconFiles.length} icons and Vue components`);
