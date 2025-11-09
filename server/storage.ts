import type { 
  User, InsertUser,
  Role, InsertRole,
  Hostel, InsertHostel,
  CorporateOffice, InsertCorporateOffice,
  Member, InsertMember,
  MealRecord, InsertMealRecord,
  Payment, InsertPayment,
  Feedback, InsertFeedback
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private roles: Map<string, Role>;
  private hostels: Map<string, Hostel>;
  private corporateOffices: Map<string, CorporateOffice>;
  private members: Map<string, Member>;
  private mealRecords: Map<string, MealRecord>;
  private payments: Map<string, Payment>;
  private feedbacks: Map<string, Feedback>;

  constructor() {
    this.users = new Map();
    this.roles = new Map();
    this.hostels = new Map();
    this.corporateOffices = new Map();
    this.members = new Map();
    this.mealRecords = new Map();
    this.payments = new Map();
    this.feedbacks = new Map();
    
    // Initialize default roles
    const superAdminRole: Role = {
      id: 'super-admin-role',
      name: 'Super Admin',
      description: 'Full system access',
      permissions: ['Manage Users', 'Manage Roles', 'Manage Hostels', 'Manage Members', 'View Reports', 'Manage Payments', 'Manage Feedback'],
      createdAt: new Date()
    };
    this.roles.set(superAdminRole.id, superAdminRole);

    const hostelOwnerRole: Role = {
      id: 'hostel-owner-role',
      name: 'Hostel Owner',
      description: 'Hostel management access',
      permissions: ['Manage Members', 'View Reports', 'Manage Payments'],
      createdAt: new Date()
    };
    this.roles.set(hostelOwnerRole.id, hostelOwnerRole);

    const corporateAdminRole: Role = {
      id: 'corporate-admin-role',
      name: 'Corporate Admin',
      description: 'Corporate office management access',
      permissions: ['Manage Members', 'View Reports'],
      createdAt: new Date()
    };
    this.roles.set(corporateAdminRole.id, corporateAdminRole);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      roleId: insertUser.roleId ?? null,
      entityId: insertUser.entityId ?? null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...userData };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Roles
  async getRole(id: string): Promise<Role | undefined> {
    return this.roles.get(id);
  }

  async getRoleByName(name: string): Promise<Role | undefined> {
    return Array.from(this.roles.values()).find(role => role.name === name);
  }

  async createRole(insertRole: InsertRole): Promise<Role> {
    const id = randomUUID();
    const role: Role = {
      ...insertRole,
      id,
      description: insertRole.description ?? null,
      createdAt: new Date()
    };
    this.roles.set(id, role);
    return role;
  }

  async updateRole(id: string, roleData: Partial<InsertRole>): Promise<Role | undefined> {
    const role = this.roles.get(id);
    if (!role) return undefined;
    const updated = { ...role, ...roleData };
    this.roles.set(id, updated);
    return updated;
  }

  async deleteRole(id: string): Promise<boolean> {
    return this.roles.delete(id);
  }

  async getAllRoles(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }

  // Hostels
  async getHostel(id: string): Promise<Hostel | undefined> {
    return this.hostels.get(id);
  }

  async createHostel(insertHostel: InsertHostel): Promise<Hostel> {
    const id = randomUUID();
    const hostel: Hostel = {
      ...insertHostel,
      id,
      createdAt: new Date()
    };
    this.hostels.set(id, hostel);
    return hostel;
  }

  async updateHostel(id: string, hostelData: Partial<InsertHostel>): Promise<Hostel | undefined> {
    const hostel = this.hostels.get(id);
    if (!hostel) return undefined;
    const updated = { ...hostel, ...hostelData };
    this.hostels.set(id, updated);
    return updated;
  }

  async deleteHostel(id: string): Promise<boolean> {
    return this.hostels.delete(id);
  }

  async getAllHostels(): Promise<Hostel[]> {
    return Array.from(this.hostels.values());
  }

  // Corporate Offices
  async getCorporateOffice(id: string): Promise<CorporateOffice | undefined> {
    return this.corporateOffices.get(id);
  }

  async createCorporateOffice(insertOffice: InsertCorporateOffice): Promise<CorporateOffice> {
    const id = randomUUID();
    const office: CorporateOffice = {
      ...insertOffice,
      id,
      createdAt: new Date()
    };
    this.corporateOffices.set(id, office);
    return office;
  }

  async updateCorporateOffice(id: string, officeData: Partial<InsertCorporateOffice>): Promise<CorporateOffice | undefined> {
    const office = this.corporateOffices.get(id);
    if (!office) return undefined;
    const updated = { ...office, ...officeData };
    this.corporateOffices.set(id, updated);
    return updated;
  }

  async deleteCorporateOffice(id: string): Promise<boolean> {
    return this.corporateOffices.delete(id);
  }

  async getAllCorporateOffices(): Promise<CorporateOffice[]> {
    return Array.from(this.corporateOffices.values());
  }

  // Members
  async getMember(id: string): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = randomUUID();
    const member: Member = {
      ...insertMember,
      id,
      phone: insertMember.phone ?? null,
      mealPlanType: insertMember.mealPlanType ?? null,
      isActive: insertMember.isActive ?? true,
      createdAt: new Date()
    };
    this.members.set(id, member);
    return member;
  }

  async updateMember(id: string, memberData: Partial<InsertMember>): Promise<Member | undefined> {
    const member = this.members.get(id);
    if (!member) return undefined;
    const updated = { ...member, ...memberData };
    this.members.set(id, updated);
    return updated;
  }

  async deleteMember(id: string): Promise<boolean> {
    return this.members.delete(id);
  }

  async getMembersByEntity(entityType: string, entityId: string): Promise<Member[]> {
    return Array.from(this.members.values()).filter(
      m => m.entityType === entityType && m.entityId === entityId
    );
  }

  async getAllMembers(): Promise<Member[]> {
    return Array.from(this.members.values());
  }

  // Meal Records
  async getMealRecord(id: string): Promise<MealRecord | undefined> {
    return this.mealRecords.get(id);
  }

  async createMealRecord(insertRecord: InsertMealRecord): Promise<MealRecord> {
    const id = randomUUID();
    const record: MealRecord = {
      ...insertRecord,
      id,
      createdAt: new Date()
    };
    this.mealRecords.set(id, record);
    return record;
  }

  async getMealRecordsByMember(memberId: string): Promise<MealRecord[]> {
    return Array.from(this.mealRecords.values()).filter(r => r.memberId === memberId);
  }

  async getMealRecordsByDateRange(startDate: Date, endDate: Date): Promise<MealRecord[]> {
    return Array.from(this.mealRecords.values()).filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }

  async getAllMealRecords(): Promise<MealRecord[]> {
    return Array.from(this.mealRecords.values());
  }

  // Payments
  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      ...insertPayment,
      id,
      stripePaymentId: insertPayment.stripePaymentId ?? null,
      createdAt: new Date()
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: string, paymentData: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    const updated = { ...payment, ...paymentData };
    this.payments.set(id, updated);
    return updated;
  }

  async getPaymentsByEntity(entityType: string, entityId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      p => p.entityType === entityType && p.entityId === entityId
    );
  }

  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  // Feedback
  async getFeedback(id: string): Promise<Feedback | undefined> {
    return this.feedbacks.get(id);
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedback: Feedback = {
      ...insertFeedback,
      id,
      entityType: insertFeedback.entityType ?? null,
      entityId: insertFeedback.entityId ?? null,
      comment: insertFeedback.comment ?? null,
      createdAt: new Date()
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }

  async getFeedbackByUser(userId: string): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter(f => f.userId === userId);
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values());
  }
}

export const storage = new MemStorage();
