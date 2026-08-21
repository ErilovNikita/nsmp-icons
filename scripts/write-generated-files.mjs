import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export async function writeGeneratedFiles({
  sourceDirectory,
  vueDirectory,
  rootIndex,
  rootTypes,
  vueIndex,
  vueTypes,
  vueComponents,
  createIcon,
}) {
  await mkdir(sourceDirectory, { recursive: true });
  await writeFile(path.join(sourceDirectory, "index.js"), rootIndex, "utf8");
  await writeFile(path.join(sourceDirectory, "index.d.ts"), rootTypes, "utf8");
  await writeFile(
    path.join(sourceDirectory, "icons.d.ts"),
    'declare module "*.svg" {\n  const source: string;\n  export default source;\n}\n',
    "utf8",
  );

  await rm(vueDirectory, { recursive: true, force: true });
  await mkdir(vueDirectory, { recursive: true });
  await writeFile(path.join(vueDirectory, "index.js"), vueIndex, "utf8");
  await writeFile(path.join(vueDirectory, "index.d.ts"), vueTypes, "utf8");
  await writeFile(path.join(vueDirectory, "createIcon.js"), createIcon.source, "utf8");
  await writeFile(path.join(vueDirectory, "createIcon.d.ts"), createIcon.types, "utf8");

  await Promise.all(
    vueComponents.flatMap(({ name, source, types }) => [
      writeFile(path.join(vueDirectory, `${name}.js`), source, "utf8"),
      writeFile(path.join(vueDirectory, `${name}.d.ts`), types, "utf8"),
    ]),
  );
}
