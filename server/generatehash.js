import bcrypt from "bcryptjs";

async function genHash() {
  const hash = await bcrypt.hash("123456", 10);
  console.log(hash);
}

genHash();