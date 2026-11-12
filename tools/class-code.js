// Prints the fingerprint for a class code, to paste into shared/platform.js.
//   node tools/class-code.js "NEW-CODE"
const code = String(process.argv[2] || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
if (!code) { console.error('Usage: node tools/class-code.js "NEW-CODE"'); process.exit(1) }
console.log(`code: "${require("crypto").createHash("sha256").update("meowstudy:" + code).digest("hex")}",   // students type: ${process.argv[2]}`);
