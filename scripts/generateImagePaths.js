import { readdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagesDirectory = resolve(__dirname, "..", "public", "images");
const outputFilePath = resolve(__dirname, "..", "app", "imagePaths.json");

const files = readdirSync(imagesDirectory);
const imagePaths = files.map((file) => `/images/${file}`);
writeFileSync(outputFilePath, JSON.stringify(imagePaths), "utf-8");
