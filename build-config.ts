import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-national-input",
    path: "./lib/jb-national-input.ts",
    outputPath: "./dist/jb-national-input.js",
    umdName: "JBNationalInput",
    external: ["jb-input", "jb-validation","jb-core", "jb-core/i18n", "jb-core/i18n"],
    globals: {
      "jb-input": "JBInput",
      "jb-validation": "JBValidation",
      "jb-core": "JBCore",
      "jb-core/i18n": "JBCoreI18N",
      "jb-core/theme": "JBCoreTheme"
    },
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-national-input-react",
    path: "./react/lib/JBNationalInput.tsx",
    outputPath: "./react/dist/JBNationalInput.js",
    external: ["jb-national-input", "jb-input-react", "jb-input", "prop-types", "react"],
    globals: {
      "react": "React",
      "jb-input": "JBInput",
      "jb-input-react": "JBInputReact",
      "jb-national-input": "JBNationalInput"
    },
    umdName: "JBNationalInputReact",
    dir: "./react"
  },
];