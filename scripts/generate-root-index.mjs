export function generateRootIndex(iconFiles) {
  return (
    iconFiles
      .map((file) => {
        const name = `${file.slice(0, -4)}Icon`;
        return `export { default as ${name} } from "../icons/${file}";`;
      })
      .join("\n") + "\n"
  );
}

export function generateRootTypes(iconFiles) {
  return (
    iconFiles
      .map((file) => {
        const name = `${file.slice(0, -4)}Icon`;
        return `export declare const ${name}: string;`;
      })
      .join("\n") + "\n"
  );
}
