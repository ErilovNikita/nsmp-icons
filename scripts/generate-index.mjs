import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const iconsDirectory = path.join(projectRoot, "icons");
const sourceDirectory = path.join(projectRoot, "src");
const indexPath = path.join(sourceDirectory, "index.js");
const vueDirectory = path.join(sourceDirectory, "vue");

const iconFiles = (await readdir(iconsDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".svg"))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right));

for (const file of iconFiles) {
  if (/^[A-Z][A-Za-z0-9]*\.svg$/.test(file) === false) {
    throw new Error(`Icon filename must use UpperCamelCase: ${file}`);
  }
}

const generatedIndex = iconFiles
  .map((file) => {
    const name = file.slice(0, -4);
    return `export { default as ${name} } from "../icons/${file}";`;
  })
  .join("\n") + "\n";

const generatedVueIndex = iconFiles
  .map((file) => {
    const name = file.slice(0, -4);
    return `export { default as ${name} } from "./${name}.js";`;
  })
  .join("\n") + "\n";

const generatedVueComponents = iconFiles.map((file) => {
  const name = file.slice(0, -4);
  return {
    name,
    source: `import icon from "../../icons/${file}";\nimport { createIcon } from "./createIcon.js";\n\nconst ${name} = createIcon(icon, "${name}");\n\nexport { ${name} };\nexport default ${name};\n`,
  };
});

await mkdir(sourceDirectory, { recursive: true });
await writeFile(indexPath, generatedIndex, "utf8");
await mkdir(vueDirectory, { recursive: true });
await writeFile(path.join(vueDirectory, "index.js"), generatedVueIndex, "utf8");
await writeFile(
  path.join(vueDirectory, "createIcon.js"),
  `import { defineComponent, h } from "vue";\n\nexport function createIcon(source, name) {\n  return defineComponent({\n    name,\n    inheritAttrs: false,\n    setup(_, { attrs }) {\n      return () => h("img", {\n        ...attrs,\n        src: source,\n        alt: attrs.alt ?? "",\n      });\n    },\n  });\n}\n`,
  "utf8",
);
await Promise.all(
  generatedVueComponents.map(({ name, source }) =>
    writeFile(path.join(vueDirectory, `${name}.js`), source, "utf8"),
  ),
);

console.error(`Generated ${iconFiles.length} icons and Vue components`);
