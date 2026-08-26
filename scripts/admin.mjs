#!/usr/bin/env node

/**
 * ╔═══════════════════════════════════════════════════════╗
 * ║   Creative Nest by Diya — Admin Terminal              ║
 * ║   Product Manager CLI                                 ║
 * ╚═══════════════════════════════════════════════════════╝
 *
 * Usage:  npm run admin
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, "../src/data/products.json");

// ─── ANSI Colors ─────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  underline: "\x1b[4m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgGreen: "\x1b[42m",
  bgRed: "\x1b[41m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
};

// ─── Readline Setup ──────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

// ─── Data Helpers ────────────────────────────────────────
function loadData() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getNextId(products) {
  const maxId = products.reduce(
    (max, p) => Math.max(max, parseInt(p.id) || 0),
    0
  );
  return String(maxId + 1);
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function formatPrice(price) {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

// ─── Display Helpers ─────────────────────────────────────
function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

function printBanner() {
  console.log("");
  console.log(
    `${c.magenta}${c.bold}  ╔═══════════════════════════════════════════════════╗${c.reset}`
  );
  console.log(
    `${c.magenta}${c.bold}  ║                                                   ║${c.reset}`
  );
  console.log(
    `${c.magenta}${c.bold}  ║   🎨  Creative Nest by Diya                      ║${c.reset}`
  );
  console.log(
    `${c.magenta}${c.bold}  ║       Admin Terminal — Product Manager            ║${c.reset}`
  );
  console.log(
    `${c.magenta}${c.bold}  ║                                                   ║${c.reset}`
  );
  console.log(
    `${c.magenta}${c.bold}  ╚═══════════════════════════════════════════════════╝${c.reset}`
  );
  console.log("");
}

function printDivider() {
  console.log(
    `${c.dim}  ─────────────────────────────────────────────────────${c.reset}`
  );
}

function printMenu() {
  console.log(`${c.cyan}${c.bold}  📋 MAIN MENU${c.reset}`);
  printDivider();
  console.log(
    `  ${c.green}1${c.reset}  ➕  Add New Product`
  );
  console.log(
    `  ${c.green}2${c.reset}  📦  List All Products`
  );
  console.log(
    `  ${c.green}3${c.reset}  🔄  Toggle Stock Status (In Stock / Sold Out)`
  );
  console.log(
    `  ${c.green}4${c.reset}  ✏️   Edit Product`
  );
  console.log(
    `  ${c.green}5${c.reset}  🗑️   Delete Product`
  );
  console.log(
    `  ${c.green}6${c.reset}  ⭐  Toggle Featured`
  );
  console.log(
    `  ${c.green}7${c.reset}  📂  List Categories`
  );
  console.log(
    `  ${c.green}8${c.reset}  📊  Dashboard / Stats`
  );
  console.log(
    `  ${c.green}0${c.reset}  🚪  Exit`
  );
  printDivider();
  console.log("");
}

function printProductTable(products, categories) {
  if (products.length === 0) {
    console.log(`\n  ${c.yellow}No products found.${c.reset}\n`);
    return;
  }

  console.log("");
  console.log(
    `  ${c.bold}${c.underline}#   ID  Name                              Price       Stock      Category${c.reset}`
  );

  products.forEach((p, i) => {
    const num = String(i + 1).padStart(2);
    const id = p.id.padEnd(3);
    const name = p.name.length > 33 ? p.name.slice(0, 30) + "..." : p.name;
    const paddedName = name.padEnd(33);
    const price = formatPrice(p.price).padEnd(11);
    const stockColor = p.inStock ? c.green : c.red;
    const stock = p.inStock ? "In Stock" : "Sold Out";
    const paddedStock = stock.padEnd(10);
    const cat = categories.find((ct) => ct.slug === p.category);
    const catName = cat ? cat.name : p.category;
    const featured = p.featured ? ` ${c.yellow}⭐${c.reset}` : "";

    console.log(
      `  ${c.dim}${num}${c.reset}  ${c.cyan}${id}${c.reset} ${paddedName}  ${c.bold}${price}${c.reset} ${stockColor}${paddedStock}${c.reset} ${catName}${featured}`
    );
  });

  console.log(`\n  ${c.dim}Total: ${products.length} products${c.reset}\n`);
}

// ─── Feature: Add New Product ────────────────────────────
async function addProduct() {
  const data = loadData();
  const { products, categories } = data;

  console.log(`\n${c.green}${c.bold}  ➕ ADD NEW PRODUCT${c.reset}\n`);
  printDivider();

  // Name
  const name = await ask(`  ${c.cyan}Product Name: ${c.reset}`);
  if (!name) {
    console.log(`  ${c.red}❌ Name cannot be empty.${c.reset}\n`);
    return;
  }

  // Slug
  const autoSlug = slugify(name);
  const slugInput = await ask(
    `  ${c.cyan}Slug ${c.dim}(Enter for "${autoSlug}")${c.reset}: `
  );
  const slug = slugInput || autoSlug;

  // Check for duplicate slug
  if (products.some((p) => p.slug === slug)) {
    console.log(`  ${c.red}❌ A product with slug "${slug}" already exists.${c.reset}\n`);
    return;
  }

  // Category
  console.log(`\n  ${c.bold}Available Categories:${c.reset}`);
  categories.forEach((cat, i) => {
    console.log(`    ${c.green}${i + 1}${c.reset}. ${cat.name} ${c.dim}(${cat.slug})${c.reset}`);
  });
  const catChoice = await ask(`\n  ${c.cyan}Category number: ${c.reset}`);
  const catIndex = parseInt(catChoice) - 1;
  if (catIndex < 0 || catIndex >= categories.length) {
    console.log(`  ${c.red}❌ Invalid category selection.${c.reset}\n`);
    return;
  }
  const category = categories[catIndex].slug;

  // Price
  const priceStr = await ask(`  ${c.cyan}Price (₹): ${c.reset}`);
  const price = parseInt(priceStr);
  if (isNaN(price) || price <= 0) {
    console.log(`  ${c.red}❌ Invalid price.${c.reset}\n`);
    return;
  }

  // Original Price
  const origPriceStr = await ask(
    `  ${c.cyan}Original Price ${c.dim}(Enter to skip, for showing discount)${c.reset}: `
  );
  const originalPrice = origPriceStr ? parseInt(origPriceStr) : null;

  // Description
  const description = await ask(`  ${c.cyan}Description: ${c.reset}`);

  // In Stock
  const stockInput = await ask(
    `  ${c.cyan}In Stock? ${c.dim}(Y/n)${c.reset}: `
  );
  const inStock = stockInput.toLowerCase() !== "n";

  // Featured
  const featuredInput = await ask(
    `  ${c.cyan}Featured on homepage? ${c.dim}(y/N)${c.reset}: `
  );
  const featured = featuredInput.toLowerCase() === "y";

  // Tags
  const tagsInput = await ask(
    `  ${c.cyan}Tags ${c.dim}(comma-separated, e.g. handmade,gift,bestseller)${c.reset}: `
  );
  const tags = tagsInput
    ? tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    : [];

  // Image path
  const imageInput = await ask(
    `  ${c.cyan}Image path ${c.dim}(e.g. /products/my-photo.jpg, Enter to skip)${c.reset}: `
  );
  const images = imageInput ? [imageInput] : [];

  // Build product object
  const newProduct = {
    id: getNextId(products),
    name,
    slug,
    price,
    originalPrice,
    category,
    images,
    description: description || "",
    inStock,
    featured,
    tags,
    createdAt: getToday(),
  };

  // Preview
  console.log(`\n${c.bold}  📋 PREVIEW:${c.reset}`);
  printDivider();
  console.log(`  ID:          ${c.cyan}${newProduct.id}${c.reset}`);
  console.log(`  Name:        ${c.bold}${newProduct.name}${c.reset}`);
  console.log(`  Slug:        ${newProduct.slug}`);
  console.log(`  Category:    ${categories[catIndex].name}`);
  console.log(`  Price:       ${c.bold}${formatPrice(price)}${c.reset}${originalPrice ? ` ${c.dim}(was ${formatPrice(originalPrice)})${c.reset}` : ""}`);
  console.log(
    `  Stock:       ${inStock ? `${c.green}In Stock${c.reset}` : `${c.red}Sold Out${c.reset}`}`
  );
  console.log(
    `  Featured:    ${featured ? `${c.yellow}⭐ Yes${c.reset}` : "No"}`
  );
  console.log(`  Tags:        ${tags.length > 0 ? tags.join(", ") : c.dim + "none" + c.reset}`);
  console.log(`  Images:      ${images.length > 0 ? images.join(", ") : c.dim + "none (placeholder will show)" + c.reset}`);
  console.log(`  Description: ${c.dim}${description ? description.slice(0, 60) + (description.length > 60 ? "..." : "") : "none"}${c.reset}`);
  printDivider();

  const confirm = await ask(
    `\n  ${c.green}Save this product? ${c.dim}(Y/n)${c.reset}: `
  );
  if (confirm.toLowerCase() === "n") {
    console.log(`  ${c.yellow}⚠️  Cancelled. Product not added.${c.reset}\n`);
    return;
  }

  products.push(newProduct);
  saveData(data);

  console.log(
    `\n  ${c.bgGreen}${c.white}${c.bold} ✅ SUCCESS ${c.reset} Product "${name}" added! (ID: ${newProduct.id})\n`
  );
  console.log(
    `  ${c.dim}💡 Tip: Run ${c.reset}${c.cyan}npm run build${c.reset}${c.dim} or restart dev server to see changes.${c.reset}\n`
  );
}

// ─── Feature: List Products ──────────────────────────────
function listProducts() {
  const data = loadData();
  console.log(`\n${c.blue}${c.bold}  📦 ALL PRODUCTS${c.reset}`);
  printDivider();
  printProductTable(data.products, data.categories);
}

// ─── Feature: Toggle Stock ───────────────────────────────
async function toggleStock() {
  const data = loadData();
  const { products, categories } = data;

  console.log(`\n${c.yellow}${c.bold}  🔄 TOGGLE STOCK STATUS${c.reset}\n`);
  printProductTable(products, categories);

  const idInput = await ask(`  ${c.cyan}Enter Product ID to toggle: ${c.reset}`);
  const product = products.find((p) => p.id === idInput);

  if (!product) {
    console.log(`  ${c.red}❌ Product with ID "${idInput}" not found.${c.reset}\n`);
    return;
  }

  const oldStatus = product.inStock ? "In Stock" : "Sold Out";
  product.inStock = !product.inStock;
  const newStatus = product.inStock ? "In Stock" : "Sold Out";

  saveData(data);

  const statusColor = product.inStock ? c.green : c.red;
  console.log(
    `\n  ${c.bgGreen}${c.white}${c.bold} ✅ UPDATED ${c.reset} "${product.name}": ${c.dim}${oldStatus}${c.reset} → ${statusColor}${c.bold}${newStatus}${c.reset}\n`
  );
}

// ─── Feature: Edit Product ───────────────────────────────
async function editProduct() {
  const data = loadData();
  const { products, categories } = data;

  console.log(`\n${c.cyan}${c.bold}  ✏️  EDIT PRODUCT${c.reset}\n`);
  printProductTable(products, categories);

  const idInput = await ask(`  ${c.cyan}Enter Product ID to edit: ${c.reset}`);
  const product = products.find((p) => p.id === idInput);

  if (!product) {
    console.log(`  ${c.red}❌ Product with ID "${idInput}" not found.${c.reset}\n`);
    return;
  }

  console.log(`\n  ${c.bold}Editing: ${product.name}${c.reset}`);
  console.log(`  ${c.dim}Press Enter to keep current value.${c.reset}\n`);

  // Name
  const newName = await ask(
    `  ${c.cyan}Name ${c.dim}[${product.name}]${c.reset}: `
  );
  if (newName) {
    product.name = newName;
    const newSlug = slugify(newName);
    const useNewSlug = await ask(
      `  ${c.cyan}Update slug to "${newSlug}"? ${c.dim}(Y/n)${c.reset}: `
    );
    if (useNewSlug.toLowerCase() !== "n") {
      product.slug = newSlug;
    }
  }

  // Price
  const newPrice = await ask(
    `  ${c.cyan}Price ${c.dim}[${formatPrice(product.price)}]${c.reset}: `
  );
  if (newPrice) product.price = parseInt(newPrice);

  // Original Price
  const newOrigPrice = await ask(
    `  ${c.cyan}Original Price ${c.dim}[${product.originalPrice ? formatPrice(product.originalPrice) : "none"}]${c.reset}: `
  );
  if (newOrigPrice) {
    product.originalPrice = newOrigPrice === "none" ? null : parseInt(newOrigPrice);
  }

  // Description
  const newDesc = await ask(
    `  ${c.cyan}Description ${c.dim}[Enter to keep]${c.reset}: `
  );
  if (newDesc) product.description = newDesc;

  // Category
  console.log(`\n  ${c.bold}Current category: ${product.category}${c.reset}`);
  console.log(`  ${c.dim}Available:${c.reset}`);
  categories.forEach((cat, i) => {
    const current = cat.slug === product.category ? ` ${c.green}← current${c.reset}` : "";
    console.log(`    ${c.green}${i + 1}${c.reset}. ${cat.name}${current}`);
  });
  const catChoice = await ask(
    `\n  ${c.cyan}Category number ${c.dim}[Enter to keep]${c.reset}: `
  );
  if (catChoice) {
    const catIndex = parseInt(catChoice) - 1;
    if (catIndex >= 0 && catIndex < categories.length) {
      product.category = categories[catIndex].slug;
    }
  }

  // Tags
  const newTags = await ask(
    `  ${c.cyan}Tags ${c.dim}[${product.tags.join(", ") || "none"}, comma-separated, Enter to keep]${c.reset}: `
  );
  if (newTags) {
    product.tags = newTags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  }

  // Image
  const newImage = await ask(
    `  ${c.cyan}Image path ${c.dim}[${product.images[0] || "none"}, Enter to keep]${c.reset}: `
  );
  if (newImage) {
    product.images = newImage === "none" ? [] : [newImage];
  }

  saveData(data);
  console.log(
    `\n  ${c.bgGreen}${c.white}${c.bold} ✅ SAVED ${c.reset} Product "${product.name}" updated!\n`
  );
}

// ─── Feature: Delete Product ─────────────────────────────
async function deleteProduct() {
  const data = loadData();
  const { products, categories } = data;

  console.log(`\n${c.red}${c.bold}  🗑️  DELETE PRODUCT${c.reset}\n`);
  printProductTable(products, categories);

  const idInput = await ask(`  ${c.cyan}Enter Product ID to delete: ${c.reset}`);
  const index = products.findIndex((p) => p.id === idInput);

  if (index === -1) {
    console.log(`  ${c.red}❌ Product with ID "${idInput}" not found.${c.reset}\n`);
    return;
  }

  const product = products[index];
  console.log(
    `\n  ${c.red}⚠️  You are about to delete: ${c.bold}${product.name}${c.reset}${c.red} (ID: ${product.id})${c.reset}`
  );
  const confirm = await ask(
    `  ${c.red}Type "${product.id}" to confirm deletion: ${c.reset}`
  );

  if (confirm !== product.id) {
    console.log(`  ${c.yellow}⚠️  Cancelled. Product not deleted.${c.reset}\n`);
    return;
  }

  products.splice(index, 1);
  saveData(data);
  console.log(
    `\n  ${c.bgRed}${c.white}${c.bold} 🗑️ DELETED ${c.reset} Product "${product.name}" removed.\n`
  );
}

// ─── Feature: Toggle Featured ────────────────────────────
async function toggleFeatured() {
  const data = loadData();
  const { products, categories } = data;

  console.log(`\n${c.yellow}${c.bold}  ⭐ TOGGLE FEATURED${c.reset}\n`);
  printProductTable(products, categories);

  const idInput = await ask(`  ${c.cyan}Enter Product ID: ${c.reset}`);
  const product = products.find((p) => p.id === idInput);

  if (!product) {
    console.log(`  ${c.red}❌ Product with ID "${idInput}" not found.${c.reset}\n`);
    return;
  }

  product.featured = !product.featured;
  saveData(data);

  console.log(
    `\n  ${c.bgGreen}${c.white}${c.bold} ✅ UPDATED ${c.reset} "${product.name}": Featured = ${product.featured ? `${c.yellow}⭐ Yes${c.reset}` : "No"}\n`
  );
}

// ─── Feature: List Categories ────────────────────────────
function listCategories() {
  const data = loadData();
  const { categories, products } = data;

  console.log(`\n${c.blue}${c.bold}  📂 CATEGORIES${c.reset}`);
  printDivider();

  categories.forEach((cat) => {
    const count = products.filter((p) => p.category === cat.slug).length;
    const inStockCount = products.filter(
      (p) => p.category === cat.slug && p.inStock
    ).length;
    console.log(
      `  ${c.cyan}${cat.name.padEnd(22)}${c.reset} ${c.dim}(${cat.slug})${c.reset}  —  ${c.bold}${count}${c.reset} products ${c.dim}(${inStockCount} in stock)${c.reset}`
    );
  });

  console.log("");
}

// ─── Feature: Dashboard ─────────────────────────────────
function showDashboard() {
  const data = loadData();
  const { products, categories } = data;

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const soldOutCount = totalProducts - inStockCount;
  const featuredCount = products.filter((p) => p.featured).length;
  const withImages = products.filter(
    (p) => p.images && p.images.length > 0 && p.images[0]
  ).length;
  const avgPrice =
    totalProducts > 0
      ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / totalProducts)
      : 0;
  const maxPrice = totalProducts > 0 ? Math.max(...products.map((p) => p.price)) : 0;
  const minPrice = totalProducts > 0 ? Math.min(...products.map((p) => p.price)) : 0;

  console.log(`\n${c.magenta}${c.bold}  📊 DASHBOARD${c.reset}`);
  printDivider();
  console.log(
    `  Total Products:    ${c.bold}${c.cyan}${totalProducts}${c.reset}`
  );
  console.log(
    `  In Stock:          ${c.green}${c.bold}${inStockCount}${c.reset}`
  );
  console.log(
    `  Sold Out:          ${c.red}${c.bold}${soldOutCount}${c.reset}`
  );
  console.log(
    `  Featured:          ${c.yellow}${c.bold}${featuredCount}${c.reset}`
  );
  console.log(
    `  With Images:       ${c.bold}${withImages}${c.reset} / ${totalProducts}`
  );
  console.log(
    `  Categories:        ${c.bold}${categories.length}${c.reset}`
  );
  printDivider();
  console.log(
    `  Price Range:       ${c.bold}${formatPrice(minPrice)}${c.reset} — ${c.bold}${formatPrice(maxPrice)}${c.reset}`
  );
  console.log(
    `  Average Price:     ${c.bold}${formatPrice(avgPrice)}${c.reset}`
  );
  printDivider();

  console.log(`\n  ${c.bold}Products by Category:${c.reset}`);
  categories.forEach((cat) => {
    const count = products.filter((p) => p.category === cat.slug).length;
    const bar = "█".repeat(count) + "░".repeat(Math.max(0, 10 - count));
    console.log(
      `  ${cat.name.padEnd(22)} ${c.cyan}${bar}${c.reset}  ${count}`
    );
  });

  console.log("");
}

// ─── Main Loop ───────────────────────────────────────────
async function main() {
  clearScreen();
  printBanner();

  let running = true;
  while (running) {
    printMenu();
    const choice = await ask(`  ${c.bold}Choose an option: ${c.reset}`);

    switch (choice) {
      case "1":
        await addProduct();
        break;
      case "2":
        listProducts();
        break;
      case "3":
        await toggleStock();
        break;
      case "4":
        await editProduct();
        break;
      case "5":
        await deleteProduct();
        break;
      case "6":
        await toggleFeatured();
        break;
      case "7":
        listCategories();
        break;
      case "8":
        showDashboard();
        break;
      case "0":
      case "exit":
      case "quit":
      case "q":
        console.log(
          `\n  ${c.magenta}${c.bold}👋 Goodbye! — Creative Nest by Diya${c.reset}\n`
        );
        running = false;
        break;
      default:
        console.log(
          `  ${c.red}❌ Invalid option. Please choose 0-8.${c.reset}\n`
        );
    }
  }

  rl.close();
  process.exit(0);
}

main().catch((err) => {
  console.error(`${c.red}Fatal error:${c.reset}`, err);
  rl.close();
  process.exit(1);
});
