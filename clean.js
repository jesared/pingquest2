// clean.js
import fs from "fs";
import path from "path";

const pathsToDelete = [".next", "node_modules", "package-lock.json"];

pathsToDelete.forEach((target) => {
  const fullPath = path.join(__dirname, target);
  if (fs.existsSync(fullPath)) {
    console.log(`🔁 Suppression de ${target}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  } else {
    console.log(`⏭ ${target} non trouvé`);
  }
});

console.log("✅ Nettoyage terminé. Vous pouvez relancer 'npm install'.");
