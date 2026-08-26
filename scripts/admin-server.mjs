import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import open from "open";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataFile = path.join(rootDir, "src", "data", "products.json");
const uploadDir = path.join(rootDir, "public", "products");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
app.use(express.json());

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    // Clean filename and add timestamp
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${cleanName}`);
  },
});
const upload = multer({ storage });

// ─── API Routes ─────────────────────────────────────────

// Get all data
app.get("/api/data", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  res.json(data);
});

// Upload image
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  res.json({ url: `/products/${req.file.filename}` });
});

// Add new product
app.post("/api/products", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const newProduct = req.body;

    // Generate ID
    const maxId = data.products.reduce((max, p) => Math.max(max, parseInt(p.id) || 0), 0);
    newProduct.id = String(maxId + 1);
    
    // Generate slug
    newProduct.slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    newProduct.createdAt = new Date().toISOString().split("T")[0];

    data.products.push(newProduct);
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2) + "\n");
    res.json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit existing product
app.put("/api/products/:id", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const index = data.products.findIndex((p) => p.id === req.params.id);
    
    if (index !== -1) {
      const existing = data.products[index];
      const updated = { ...existing, ...req.body };
      
      // Keep existing images if no new image was uploaded
      if (!req.body.images || req.body.images.length === 0) {
        updated.images = existing.images;
      }
      
      updated.slug = updated.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      data.products[index] = updated;
      
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2) + "\n");
      res.json({ success: true, product: updated });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    data.products = data.products.filter((p) => p.id !== req.params.id);
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2) + "\n");
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle stock
app.patch("/api/products/:id/stock", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const product = data.products.find((p) => p.id === req.params.id);
    if (product) {
      product.inStock = !product.inStock;
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2) + "\n");
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish to GitHub
app.post("/api/publish", (req, res) => {
  try {
    execSync("git add src/data/products.json public/products/", { cwd: rootDir });
    try {
      execSync('git commit -m "update: store updated via Web Dashboard"', { cwd: rootDir });
    } catch (e) {
      // Ignore error if nothing to commit
    }
    execSync("git push", { cwd: rootDir });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Frontend Routes ────────────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "admin-ui.html"));
});

// Serve images for preview
app.use("/products", express.static(uploadDir));

// ─── Start Server ───────────────────────────────────────
const PORT = 4000;
app.listen(PORT, async () => {
  console.log(`✅ Admin Dashboard running at http://localhost:${PORT}`);
  try {
    await open(`http://localhost:${PORT}`);
  } catch (e) {
    // Ignore if browser fails to open
  }
});
