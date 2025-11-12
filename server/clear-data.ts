import { db } from "./db";
import { 
  users, roles, hostels, corporateOffices, members, 
  mealRecords, payments, feedback 
} from "@shared/schema";
import { sql } from "drizzle-orm";

async function clearData() {
  try {
    console.log("🧹 Starting to clear all dummy data...");

    console.log("   Clearing feedback...");
    await db.delete(feedback);

    console.log("   Clearing payments...");
    await db.delete(payments);

    console.log("   Clearing meal records...");
    await db.delete(mealRecords);

    console.log("   Clearing members...");
    await db.delete(members);

    console.log("   Clearing users...");
    await db.delete(users);

    console.log("   Clearing corporate offices...");
    await db.delete(corporateOffices);

    console.log("   Clearing hostels...");
    await db.delete(hostels);

    console.log("   Clearing roles...");
    await db.delete(roles);

    console.log("\n✅ All data cleared successfully!");
    console.log("💡 Run 'npm run seed' to re-populate with dummy data");
    
  } catch (error) {
    console.error("❌ Clear data failed:", error);
    throw error;
  }
}

clearData()
  .then(() => {
    console.log("\n🎉 Clear completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Clear error:", error);
    process.exit(1);
  });
