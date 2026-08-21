const createIconSource = `import { defineComponent, h } from "vue";

export function createIcon(source, name) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () => h("img", {
        ...attrs,
        src: source,
        alt: attrs.alt ?? "",
      });
    },
  });
}
`;

const createIconTypes = 'import type { DefineComponent } from "vue";\n\nexport declare function createIcon(source: string, name: string): DefineComponent;\n';
const componentTypes = 'import type { DefineComponent } from "vue";\n\ndeclare const component: DefineComponent;\nexport { component as default };\n';

export function generateVueIndex(iconFiles) {
  return (
    iconFiles
      .map((file) => {
        const name = `${file.slice(0, -4)}Icon`;
        return `export { default as ${name} } from "./${name}.js";`;
      })
      .join("\n") + "\n"
  );
}

export function generateVueTypes(iconFiles) {
  return [
    'import type { DefineComponent } from "vue";',
    "",
    ...iconFiles.map((file) => {
      const name = `${file.slice(0, -4)}Icon`;
      return `export declare const ${name}: DefineComponent;`;
    }),
    "",
  ].join("\n");
}

export function generateVueComponents(iconFiles) {
  return iconFiles.map((file) => {
    const name = `${file.slice(0, -4)}Icon`;
    return {
      name,
      source: `import icon from "../../icons/${file}";\nimport { createIcon } from "./createIcon.js";\n\nconst ${name} = createIcon(icon, "${name}");\n\nexport { ${name} };\nexport default ${name};\n`,
      types: componentTypes,
    };
  });
}

export function generateCreateIcon() {
  return { source: createIconSource, types: createIconTypes };
}
