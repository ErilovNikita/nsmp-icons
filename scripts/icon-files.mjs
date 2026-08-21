import { readdir } from "node:fs/promises";

export async function getIconFiles(iconsDirectory) {
  const iconFiles = (await readdir(iconsDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".svg"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  for (const file of iconFiles) {
    if (/^[A-Z][A-Za-z0-9]*\.svg$/.test(file) === false) {
      throw new Error(`Icon filename must use UpperCamelCase: ${file}`);
    }
  }

  return iconFiles;
}
