import { plugin, type BunPlugin, readableStreamToText } from "bun";
import { solidPlugin } from "esbuild-plugin-solid";
import fs, { readFileSync } from "node:fs";
import { join } from "node:path";
import tailwind from "tailwindcss";

fs.rmSync("./dist", { recursive: true });

const tailwindPlugin: () => BunPlugin = () => ({
  name: "tailwind",
  async setup(build) {
    build.onLoad({ filter: /\.(css)$/ }, async (args) => {
      const out = join(build.config.outdir || "", "index.css");
      Bun.spawn(["bun", "x", "tailwindcss", "-i", args.path, "-o", out]);

      return {
        contents: "",
        loader: "text",
      };
    });
  },
});

const workerPlugin: () => BunPlugin = () => ({
  name: "workers",
  async setup(build) {
    build.onLoad({ filter: /\.worker\.(mts|ts|js|mjs)$/ }, async (args) => {
      const text = readFileSync(args.path, "utf8");

      // cent emit file?
      return {
        loader: "ts",
        contents: `
          ${text}
          const blob = new Blob([]);
          console.log(blob);
        `,
      };
    });
  },
});

await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./dist",
  naming: {
    asset: "[name].[ext]",
  },
  plugins: [solidPlugin(), tailwindPlugin(), workerPlugin()],
});
