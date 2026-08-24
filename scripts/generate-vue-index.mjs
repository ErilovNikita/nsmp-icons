const createIconSource = `import { defineComponent, h } from "vue";

export function createIcon(source, name) {
  return defineComponent({
    name,
    props: {
      color: String,
    },
    inheritAttrs: false,
    setup(props, { attrs }) {
      const { alt, ...restAttrs } = attrs;

      return () => h("span", {
        ...restAttrs,
        role: alt ? "img" : undefined,
        "aria-label": alt,
        "aria-hidden": alt ? undefined : "true",
        style: [
          {
            display: "inline-block",
            width: restAttrs.width ? \`\${restAttrs.width}\${/^\\d+$/.test(restAttrs.width) ? "px" : ""}\` : "16px",
            height: restAttrs.height ? \`\${restAttrs.height}\${/^\\d+$/.test(restAttrs.height) ? "px" : ""}\` : "16px",
            backgroundColor: props.color || "currentColor",
            maskImage: \`url(\${source})\`,
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskSize: "contain",
            WebkitMaskImage: \`url(\${source})\`,
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskSize: "contain",
          },
          restAttrs.style,
        ],
      });
    },
  });
}
`;

const createIconTypes = 'import type { DefineComponent } from "vue";\n\nexport declare function createIcon(source: string, name: string): DefineComponent<{ color?: string }>;\n';
const componentTypes = 'import type { DefineComponent } from "vue";\n\ndeclare const component: DefineComponent<{ color?: string }>;\nexport { component as default };\n';

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
