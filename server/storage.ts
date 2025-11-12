import type { 
  User, InsertUser,
  Role, InsertRole,
  Hostel, InsertHostel,
  CorporateOffice, InsertCorporateOffice,
  Member, InsertMember,
  MealRecord, InsertMealRecord,
  Payment, InsertPayment,
  Feedback, InsertFeedback,
  MealPrice, InsertMealPrice
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Roles
  getRole(id: string): Promise<Role | undefined>;
  getRoleByName(name: string): Promise<Role | undefined>;
  createRole(role: InsertRole): Promise<Role>;
  updateRole(id: string, role: Partial<InsertRole>): Promise<Role | undefined>;
  deleteRole(id: string): Promise<boolean>;
  getAllRoles(): Promise<Role[]>;
  
  // Hostels
  getHostel(id: string): Promise<Hostel | undefined>;
  createHostel(hostel: InsertHostel): Promise<Hostel>;
  updateHostel(id: string, hostel: Partial<InsertHostel>): Promise<Hostel | undefined>;
  deleteHostel(id: string): Promise<boolean>;
  getAllHostels(): Promise<Hostel[]>;
  
  // Corporate Offices
  getCorporateOffice(id: string): Promise<CorporateOffice | undefined>;
  createCorporateOffice(office: InsertCorporateOffice): Promise<CorporateOffice>;
  updateCorporateOffice(id: string, office: Partial<InsertCorporateOffice>): Promise<CorporateOffice | undefined>;
  deleteCorporateOffice(id: string): Promise<boolean>;
  getAllCorporateOffices(): Promise<CorporateOffice[]>;
  
  // Members
  getMember(id: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, member: Partial<InsertMember>): Promise<Member | undefined>;
  deleteMember(id: string): Promise<boolean>;
  getMembersByEntity(entityType: string, entityId: string): Promise<Member[]>;
  getAllMembers(): Promise<Member[]>;
  
  // Meal Records
  getMealRecord(id: string): Promise<MealRecord | undefined>;
  createMealRecord(record: InsertMealRecord): Promise<MealRecord>;
  getMealRecordsByMember(memberId: string): Promise<MealRecord[]>;
  getMealRecordsByDateRange(startDate: Date, endDate: Date): Promise<MealRecord[]>;
  getAllMealRecords(): Promise<MealRecord[]>;
  
  // Payments
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  getPaymentsByEntity(entityType: string, entityId: string): Promise<Payment[]>;
  getAllPayments(): Promise<Payment[]>;
  
  // Feedback
  getFeedback(id: string): Promise<Feedback | undefined>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedbackByUser(userId: string): Promise<Feedback[]>;
  getAllFeedback(): Promise<Feedback[]>;
  
  // Meal Prices
  getMealPrice(id: string): Promise<MealPrice | undefined>;
  getMealPriceByEntity(entityType: string, entityId: string): Promise<MealPrice | undefined>;
  createMealPrice(mealPrice: InsertMealPrice): Promise<MealPrice>;
  updateMealPrice(id: string, mealPrice: Partial<InsertMealPrice>): Promise<MealPrice | undefined>;
  deleteMealPrice(id: string): Promise<boolean>;
  getAllMealPrices(): Promise<MealPrice[]>;
}

import { db } from "./db";
import { 
  users, roles, hostels, corporateOffices, members, 
  mealRecords, payments, feedback, mealPrices 
} from "@shared/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export class DbStorage implements IStorage {
  private initialized = false;

  private async initializeDefaultRoles() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const defaultRoles = [
        {
          name: 'Super Admin',
          description: 'Full system access - can manage everything',
          permissions: ['Manage Users', 'Manage Roles', 'Manage Hostels', 'Manage Corporate Offices', 'Manage Members', 'View Reports', 'Manage Payments', 'Manage Feedback', 'View All Data']
        },
        {
          name: 'Hostel Admin',
          description: 'Can only view and manage their own hostel and its members',
          permissions: ['Manage Hostels', 'Manage Members', 'View Reports', 'Manage Payments', 'Manage Feedback']
        },
        {
          name: 'Corporate Admin',
          description: 'Can only view and manage their own office and associated employees',
          permissions: ['Manage Corporate Offices', 'Manage Members', 'View Reports']
        },
        {
          name: 'Individual Member',
          description: 'Can only view their own meal details and meal cost',
          permissions: ['View Own Meals', 'View Own Costs']
        }
      ];

      for (const roleData of defaultRoles) {
        const existingRole = await db.select().from(roles).where(eq(roles.name, roleData.name)).limit(1);
        
        if (existingRole.length > 0) {
          await db.update(roles)
            .set({ 
              description: roleData.description, 
              permissions: roleData.permissions 
            })
            .where(eq(roles.name, roleData.name));
        } else {
          await db.insert(roles).values(roleData);
        }
      }

      const superAdminRole = await db.select().from(roles).where(eq(roles.name, 'Super Admin')).limit(1);
      if (superAdminRole.length > 0) {
        const existingSuperAdmin = await db.select().from(users).where(eq(users.isSuperAdmin, true)).limit(1);
        
        if (existingSuperAdmin.length === 0) {
          console.log('[DbStorage] Creating default Super Admin...');
          const bcrypt = await import('bcrypt');
          const hashedPassword = await bcrypt.hash('admin123', 10);
          
          await db.insert(users).values({
            email: 'admin@hostelmanager.com',
            password: hashedPassword,
            name: 'Super Administrator',
            roleId: superAdminRole[0].id,
            entityType: null,
            entityId: null,
            memberId: null,
            isSuperAdmin: true
          }).onConflictDoNothing();
          
          console.log('[DbStorage] Default Super Admin created: admin@hostelmanager.com / admin123');
        }
      }
    } catch (error) {
      console.error('[DbStorage] Error initializing default roles:', error);
    }
  }

  async getAllRoles(): Promise<Role[]> {
    await this.initializeDefaultRoles();
    const result = await db.select().from(roles);
    return result || [];
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getRole(id: string): Promise<Role | undefined> {
    const result = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
    return result[0];
  }

  async getRoleByName(name: string): Promise<Role | undefined> {
    const result = await db.select().from(roles).where(eq(roles.name, name)).limit(1);
    return result[0];
  }

  async createRole(insertRole: InsertRole): Promise<Role> {
    const result = await db.insert(roles).values(insertRole).returning();
    return result[0];
  }

  async updateRole(id: string, roleData: Partial<InsertRole>): Promise<Role | undefined> {
    const result = await db.update(roles).set(roleData).where(eq(roles.id, id)).returning();
    return result[0];
  }

  async deleteRole(id: string): Promise<boolean> {
    const result = await db.delete(roles).where(eq(roles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getHostel(id: string): Promise<Hostel | undefined> {
    const result = await db.select().from(hostels).where(eq(hostels.id, id)).limit(1);
    return result[0];
  }

  async createHostel(insertHostel: InsertHostel): Promise<Hostel> {
    const result = await db.insert(hostels).values(insertHostel).returning();
    return result[0];
  }

  async updateHostel(id: string, hostelData: Partial<InsertHostel>): Promise<Hostel | undefined> {
    const result = await db.update(hostels).set(hostelData).where(eq(hostels.id, id)).returning();
    return result[0];
  }

  async deleteHostel(id: string): Promise<boolean> {
    const result = await db.delete(hostels).where(eq(hostels.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAllHostels(): Promise<Hostel[]> {
    return await db.select().from(hostels);
  }

  async getCorporateOffice(id: string): Promise<CorporateOffice | undefined> {
    const result = await db.select().from(corporateOffices).where(eq(corporateOffices.id, id)).limit(1);
    return result[0];
  }

  async createCorporateOffice(insertOffice: InsertCorporateOffice): Promise<CorporateOffice> {
    const result = await db.insert(corporateOffices).values(insertOffice).returning();
    return result[0];
  }

  async updateCorporateOffice(id: string, officeData: Partial<InsertCorporateOffice>): Promise<CorporateOffice | undefined> {
    const result = await db.update(corporateOffices).set(officeData).where(eq(corporateOffices.id, id)).returning();
    return result[0];
  }

  async deleteCorporateOffice(id: string): Promise<boolean> {
    const result = await db.delete(corporateOffices).where(eq(corporateOffices.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAllCorporateOffices(): Promise<CorporateOffice[]> {
    return await db.select().from(corporateOffices);
  }

  async getMember(id: string): Promise<Member | undefined> {
    const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
    return result[0];
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const result = await db.insert(members).values(insertMember).returning();
    return result[0];
  }

  async updateMember(id: string, memberData: Partial<InsertMember>): Promise<Member | undefined> {
    const result = await db.update(members).set(memberData).where(eq(members.id, id)).returning();
    return result[0];
  }

  async deleteMember(id: string): Promise<boolean> {
    const result = await db.delete(members).where(eq(members.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getMembersByEntity(entityType: string, entityId: string): Promise<Member[]> {
    return await db.select().from(members).where(
      and(eq(members.entityType, entityType), eq(members.entityId, entityId))
    );
  }

  async getAllMembers(): Promise<Member[]> {
    return await db.select().from(members);
  }

  async getMealRecord(id: string): Promise<MealRecord | undefined> {
    const result = await db.select().from(mealRecords).where(eq(mealRecords.id, id)).limit(1);
    return result[0];
  }

  async createMealRecord(insertRecord: InsertMealRecord): Promise<MealRecord> {
    const result = await db.insert(mealRecords).values(insertRecord).returning();
    return result[0];
  }

  async getMealRecordsByMember(memberId: string): Promise<MealRecord[]> {
    return await db.select().from(mealRecords).where(eq(mealRecords.memberId, memberId));
  }

  async getMealRecordsByDateRange(startDate: Date, endDate: Date): Promise<MealRecord[]> {
    return await db.select().from(mealRecords).where(
      and(gte(mealRecords.date, startDate), lte(mealRecords.date, endDate))
    );
  }

  async getAllMealRecords(): Promise<MealRecord[]> {
    return await db.select().from(mealRecords);
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    return result[0];
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(insertPayment).returning();
    return result[0];
  }

  async updatePayment(id: string, paymentData: Partial<InsertPayment>): Promise<Payment | undefined> {
    const result = await db.update(payments).set(paymentData).where(eq(payments.id, id)).returning();
    return result[0];
  }

  async getPaymentsByEntity(entityType: string, entityId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(
      and(eq(payments.entityType, entityType), eq(payments.entityId, entityId))
    );
  }

  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

  async getFeedback(id: string): Promise<Feedback | undefined> {
    const result = await db.select().from(feedback).where(eq(feedback.id, id)).limit(1);
    return result[0];
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const result = await db.insert(feedback).values(insertFeedback).returning();
    return result[0];
  }

  async getFeedbackByUser(userId: string): Promise<Feedback[]> {
    return await db.select().from(feedback).where(eq(feedback.userId, userId));
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return await db.select().from(feedback);
  }

  async getMealPrice(id: string): Promise<MealPrice | undefined> {
    const result = await db.select().from(mealPrices).where(eq(mealPrices.id, id));
    return result[0];
  }

  async getMealPriceByEntity(entityType: string, entityId: string): Promise<MealPrice | undefined> {
    const result = await db.select().from(mealPrices)
      .where(and(eq(mealPrices.entityType, entityType), eq(mealPrices.entityId, entityId)))
      .orderBy(desc(mealPrices.effectiveDate))
      .limit(1);
    return result[0];
  }

  async createMealPrice(mealPrice: InsertMealPrice): Promise<MealPrice> {
    const result = await db.insert(mealPrices).values(mealPrice).returning();
    return result[0];
  }

  async updateMealPrice(id: string, mealPrice: Partial<InsertMealPrice>): Promise<MealPrice | undefined> {
    const result = await db.update(mealPrices)
      .set({ ...mealPrice, updatedAt: new Date() })
      .where(eq(mealPrices.id, id))
      .returning();
    return result[0];
  }

  async deleteMealPrice(id: string): Promise<boolean> {
    const result = await db.delete(mealPrices).where(eq(mealPrices.id, id)).returning();
    return result.length > 0;
  }

  async getAllMealPrices(): Promise<MealPrice[]> {
    return await db.select().from(mealPrices);
  }
}

export const storage = new DbStorage();
