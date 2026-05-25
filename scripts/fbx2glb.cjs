const fs = require("fs");
const path = require("path");
const THREE = require("three");

const { FBXLoader } = require("three/examples/jsm/loaders/FBXLoader");
const { GLTFExporter } = require("three/examples/jsm/exporters/GLTFExporter");

const modelsDir = path.join(__dirname, "..", "public", "models");

function convertFbxToGlb(name) {
  return new Promise((resolve, reject) => {
    const fbxPath = path.join(modelsDir, `${name}.fbx`);
    const glbPath = path.join(modelsDir, `${name}.glb`);

    if (!fs.existsSync(fbxPath)) {
      console.error(`File not found: ${fbxPath}`);
      resolve();
      return;
    }

    console.log(`Converting: ${name}.fbx`);

    const scene = new THREE.Scene();
    const loader = new FBXLoader();

    loader.load(
      fbxPath,
      (fbx) => {
        scene.add(fbx);

        const exporter = new GLTFExporter();
        exporter.parse(
          scene,
          (glb) => {
            const buffer = Buffer.from(glb);
            fs.writeFileSync(glbPath, buffer);
            console.log(`  → ${name}.glb (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
            resolve();
          },
          (err) => {
            console.error(`  Export error: ${err.message}`);
            reject(err);
          },
          { binary: true, animations: fbx.animations }
        );
      },
      undefined,
      (err) => {
        console.error(`  Load error: ${err.message}`);
        reject(err);
      }
    );
  });
}

const models = [
  "Walking",
  "pointing-to-the-right-hologram",
  "wave-hiphop-dance",
  "breakdance-freezes",
  "rumba-dancing",
  "bye",
];

(async () => {
  for (const m of models) {
    await convertFbxToGlb(m);
  }
  console.log("All conversions complete!");
})();
