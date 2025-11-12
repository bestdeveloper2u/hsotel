import { db } from "./db";
import { 
  users, roles, hostels, corporateOffices, members, 
  mealRecords, payments, feedback 
} from "@shared/schema";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("🌱 Starting database seed...");
    
    console.log("🧹 Clearing existing data...");
    await db.delete(feedback);
    await db.delete(payments);
    await db.delete(mealRecords);
    await db.delete(members);
    await db.delete(users);
    await db.delete(corporateOffices);
    await db.delete(hostels);
    await db.delete(roles);

    console.log("📋 Creating roles...");
    await db.insert(roles).values([
      {
        name: 'Super Admin',
        description: 'Full system access',
        permissions: ['Manage Users', 'Manage Roles', 'Manage Hostels', 'Manage Members', 'View Reports', 'Manage Payments', 'Manage Feedback']
      },
      {
        name: 'Hostel Owner',
        description: 'Hostel management access',
        permissions: ['Manage Members', 'View Reports', 'Manage Payments']
      },
      {
        name: 'Corporate Admin',
        description: 'Corporate office management access',
        permissions: ['Manage Members', 'View Reports']
      }
    ]);
    
    const rolesData = await db.select().from(roles);
    console.log('Roles created:', rolesData);
    
    if (!rolesData || rolesData.length === 0) {
      throw new Error('Failed to create roles');
    }
    
    const superAdminRole = rolesData.find(r => r.name === 'Super Admin')!;
    const hostelOwnerRole = rolesData.find(r => r.name === 'Hostel Owner')!;
    const corporateAdminRole = rolesData.find(r => r.name === 'Corporate Admin')!;

    console.log("🏢 Creating hostels...");
    await db.insert(hostels).values([
      {
        name: 'Sunrise Hostel',
        address: '123 Main St, New York, NY 10001',
        contactEmail: 'contact@sunrise.com',
        contactPhone: '+1-555-0101',
        capacity: 50
      },
      {
        name: 'Moonlight Residence',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        contactEmail: 'info@moonlight.com',
        contactPhone: '+1-555-0102',
        capacity: 75
      },
      {
        name: 'Green Valley Hostel',
        address: '789 Pine Rd, Chicago, IL 60601',
        contactEmail: 'hello@greenvalley.com',
        contactPhone: '+1-555-0103',
        capacity: 100
      }
    ]);
    const hostelsData = await db.select().from(hostels);

    console.log("🏭 Creating corporate offices...");
    await db.insert(corporateOffices).values([
      {
        name: 'Tech Corp HQ',
        address: '321 Business Blvd, San Francisco, CA 94102',
        contactEmail: 'hr@techcorp.com',
        contactPhone: '+1-555-0201'
      },
      {
        name: 'Finance Solutions Inc',
        address: '654 Commerce St, Boston, MA 02101',
        contactEmail: 'admin@financesol.com',
        contactPhone: '+1-555-0202'
      }
    ]);
    const corporateData = await db.select().from(corporateOffices);

    console.log("👤 Creating users...");
    const superAdminPassword = await hashPassword('admin123');
    const hostelOwnerPassword = await hashPassword('hostel123');
    const corporateAdminPassword = await hashPassword('corporate123');

    await db.insert(users).values([
      {
        name: 'Super Admin',
        email: 'admin@hostelmanager.com',
        password: superAdminPassword,
        roleId: superAdminRole.id,
        entityType: 'System',
        entityId: null
      },
      {
        name: 'John Smith',
        email: 'john@sunrise.com',
        password: hostelOwnerPassword,
        roleId: hostelOwnerRole.id,
        entityType: 'Hostel',
        entityId: hostelsData[0].id
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@moonlight.com',
        password: hostelOwnerPassword,
        roleId: hostelOwnerRole.id,
        entityType: 'Hostel',
        entityId: hostelsData[1].id
      },
      {
        name: 'Mike Davis',
        email: 'mike@greenvalley.com',
        password: hostelOwnerPassword,
        roleId: hostelOwnerRole.id,
        entityType: 'Hostel',
        entityId: hostelsData[2].id
      },
      {
        name: 'Emily Brown',
        email: 'emily@techcorp.com',
        password: corporateAdminPassword,
        roleId: corporateAdminRole.id,
        entityType: 'Corporate',
        entityId: corporateData[0].id
      },
      {
        name: 'David Wilson',
        email: 'david@financesol.com',
        password: corporateAdminPassword,
        roleId: corporateAdminRole.id,
        entityType: 'Corporate',
        entityId: corporateData[1].id
      }
    ]);
    const usersData = await db.select().from(users);

    console.log("👥 Creating members...");
    await db.insert(members).values([
      {
        name: 'Alice Cooper',
        email: 'alice@example.com',
        phone: '+1-555-1001',
        entityType: 'Hostel',
        entityId: hostelsData[0].id,
        mealPlanType: 'Full Board',
        isActive: true
      },
      {
        name: 'Bob Martin',
        email: 'bob@example.com',
        phone: '+1-555-1002',
        entityType: 'Hostel',
        entityId: hostelsData[0].id,
        mealPlanType: 'Half Board',
        isActive: true
      },
      {
        name: 'Charlie Lee',
        email: 'charlie@example.com',
        phone: '+1-555-1003',
        entityType: 'Hostel',
        entityId: hostelsData[1].id,
        mealPlanType: 'Full Board',
        isActive: true
      },
      {
        name: 'Diana Prince',
        email: 'diana@example.com',
        phone: '+1-555-1004',
        entityType: 'Hostel',
        entityId: hostelsData[1].id,
        mealPlanType: 'Breakfast Only',
        isActive: true
      },
      {
        name: 'Ethan Hunt',
        email: 'ethan@example.com',
        phone: '+1-555-1005',
        entityType: 'Corporate',
        entityId: corporateData[0].id,
        mealPlanType: 'Full Board',
        isActive: true
      },
      {
        name: 'Fiona Green',
        email: 'fiona@example.com',
        phone: '+1-555-1006',
        entityType: 'Corporate',
        entityId: corporateData[1].id,
        mealPlanType: 'Half Board',
        isActive: true
      }
    ]);
    const membersData = await db.select().from(members);

    console.log("🍽️ Creating meal records...");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    await db.insert(mealRecords).values([
      { memberId: membersData[0].id, mealType: 'Breakfast', date: today },
      { memberId: membersData[0].id, mealType: 'Lunch', date: today },
      { memberId: membersData[0].id, mealType: 'Dinner', date: today },
      { memberId: membersData[1].id, mealType: 'Breakfast', date: today },
      { memberId: membersData[1].id, mealType: 'Dinner', date: today },
      { memberId: membersData[2].id, mealType: 'Breakfast', date: yesterday },
      { memberId: membersData[2].id, mealType: 'Lunch', date: yesterday },
      { memberId: membersData[2].id, mealType: 'Dinner', date: yesterday },
      { memberId: membersData[3].id, mealType: 'Breakfast', date: yesterday },
      { memberId: membersData[4].id, mealType: 'Lunch', date: twoDaysAgo },
      { memberId: membersData[4].id, mealType: 'Dinner', date: twoDaysAgo },
      { memberId: membersData[5].id, mealType: 'Breakfast', date: twoDaysAgo }
    ]);

    console.log("💰 Creating payments...");
    await db.insert(payments).values([
      {
        entityType: 'Hostel',
        entityId: hostelsData[0].id,
        amount: '1500.00',
        status: 'Completed',
        stripePaymentId: 'pi_test_001'
      },
      {
        entityType: 'Hostel',
        entityId: hostelsData[1].id,
        amount: '2000.00',
        status: 'Completed',
        stripePaymentId: 'pi_test_002'
      },
      {
        entityType: 'Hostel',
        entityId: hostelsData[2].id,
        amount: '2500.00',
        status: 'Pending',
        stripePaymentId: null
      },
      {
        entityType: 'Corporate',
        entityId: corporateData[0].id,
        amount: '5000.00',
        status: 'Completed',
        stripePaymentId: 'pi_test_003'
      },
      {
        entityType: 'Corporate',
        entityId: corporateData[1].id,
        amount: '3500.00',
        status: 'Pending',
        stripePaymentId: null
      }
    ]);

    console.log("📝 Creating feedback...");
    await db.insert(feedback).values([
      {
        userId: usersData[1].id,
        entityType: 'Hostel',
        entityId: hostelsData[0].id,
        rating: 5,
        category: 'Service',
        comment: 'Excellent service and facilities!'
      },
      {
        userId: usersData[2].id,
        entityType: 'Hostel',
        entityId: hostelsData[1].id,
        rating: 4,
        category: 'Food',
        comment: 'Good food quality, could improve variety.'
      },
      {
        userId: usersData[3].id,
        entityType: 'Hostel',
        entityId: hostelsData[2].id,
        rating: 5,
        category: 'Cleanliness',
        comment: 'Very clean and well-maintained.'
      },
      {
        userId: usersData[4].id,
        entityType: 'Corporate',
        entityId: corporateData[0].id,
        rating: 4,
        category: 'Service',
        comment: 'Professional and efficient service.'
      }
    ]);

    console.log("\n✅ Database seeded successfully!");
    console.log("\n🔑 Super Admin Credentials:");
    console.log("   Email: admin@hostelmanager.com");
    console.log("   Password: admin123");
    console.log("\n👤 Test Accounts:");
    console.log("   Hostel Owner: john@sunrise.com / hostel123");
    console.log("   Corporate Admin: emily@techcorp.com / corporate123");
    
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("\n🎉 Seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seed error:", error);
    process.exit(1);
  });
