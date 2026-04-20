import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "admin" },
}, { timestamps: true });

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Conectado a MongoDB");

  const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email: "alexsys@novitic.com" });
  if (existing) {
    console.log("⚠️  El usuario AlexSys ya existe.");
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash("Novitic2026@", 12);
  await User.create({
    name: "AlexSys",
    email: "alexsys@novitic.com",
    password: hashed,
    role: "admin",
  });

  console.log("✅ Usuario creado:");
  console.log("   Nombre: AlexSys");
  console.log("   Email:  alexsys@novitic.com");
  console.log("   Pass:   Novitic2026@");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
