import chalk from "chalk";
import { argv, exit } from "node:process";
import type { Format } from "tsup";
import { defineConfig } from "tsup";


export const TARGETS = {
    lib: { entry: "src/index.ts", output: "dist/", formats: ["cjs", "esm"], dts: true },
    cli: { entry: "src/cli/index.ts", output: "bin/", formats: ["esm"], dts: false }
} satisfies Record<string, { entry: string; output: string; formats: Format[]; dts: boolean }>

let configuration;

function config(
    entry: string,
    output: string,
    formats: Format[],
    dts: boolean
) {

    console.log("starting", { entry, output, formats, dts })
    configuration = defineConfig({
        entry: [entry],
        format: formats,
        dts,
        minify: true,
        sourcemap: !dts,
        outDir: output,
        clean: false,
        tsconfig: "./tsconfig.json",
    });
}

const target = process.env.TARGET || "";


if (Object.keys(TARGETS).includes(target.toLocaleLowerCase())) {
    argv.splice(2,1);
    const { entry, output, formats, dts } = TARGETS[target.toLocaleLowerCase() as keyof typeof TARGETS];
    console.log(
        `Transpiling for ${chalk.bold.yellow(target.toUpperCase())} target [${chalk.dim(entry)}]`
    );
    console.log();

    config(entry, output, formats, dts);
} else {
    console.error(`Build did not get a target of 'lib' or 'cli'`)
    exit(1);
}

export default configuration
