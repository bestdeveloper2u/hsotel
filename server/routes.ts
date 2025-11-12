import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, comparePassword, generateToken, authMiddleware, requirePermission, type AuthRequest } from "./auth";
import { 
  insertUserSchema, 
  insertRoleSchema,
  insertHostelSchema,
  insertCorporateOfficeSchema,
  insertMemberSchema,
  insertMealRecordSchema,
  insertPaymentSchema,
  insertFeedbackSchema,
  insertMealPriceSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test endpoint to debug database issues
  app.get("/api/test-db", async (_req, res) => {
    try {
      console.log('[TEST] Starting database test...');
      const roles = await storage.getAllRoles();
      console.log('[TEST] Got roles:', roles);
      res.json({ success: true, roles, count: roles.length });
    } catch (error: any) {
      console.error('[TEST] Database test failed:', error);
      console.error('[TEST] Error stack:', error.stack);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  });

  // Authentication routes (public)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, entityType, entityName, entityData } = req.body;
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      let entityId = null;
      
      // Create the entity based on type
      if (entityType === 'Hostel' && entityData) {
        const hostel = await storage.createHostel({
          name: entityName || entityData.name,
          address: entityData.address,
          contactEmail: email,
          contactPhone: entityData.contactPhone,
          capacity: entityData.capacity
        });
        entityId = hostel.id;
      } else if (entityType === 'Corporate' && entityData) {
        const office = await storage.createCorporateOffice({
          name: entityName || entityData.name,
          address: entityData.address,
          contactEmail: email,
          contactPhone: entityData.contactPhone
        });
        entityId = office.id;
      }

      const hashedPassword = await hashPassword(password);
      
      // Assign default role based on entity type
      let roleId = null;
      if (entityType === 'Hostel') {
        const role = await storage.getRoleByName('Hostel Owner');
        roleId = role?.id || null;
      } else if (entityType === 'Corporate') {
        const role = await storage.getRoleByName('Corporate Admin');
        roleId = role?.id || null;
      }

      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        entityType,
        entityId,
        roleId
      });

      const token = generateToken(user.id);
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user.id);
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // User routes (protected with permissions)
  app.get("/api/users", authMiddleware, requirePermission('Manage Users'), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:id", authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/users/:id", authMiddleware, requirePermission('Manage Users'), async (req, res) => {
    try {
      const updates = req.body;
      if (updates.password) {
        updates.password = await hashPassword(updates.password);
      }
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/users/:id", authMiddleware, requirePermission('Manage Users'), async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Role routes
  app.get("/api/roles/:id", authMiddleware, async (req, res) => {
    try {
      const role = await storage.getRole(req.params.id);
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }
      res.json(role);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/roles", authMiddleware, requirePermission('Manage Roles'), async (req, res) => {
    try {
      const roles = await storage.getAllRoles();
      res.json(roles);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/roles", authMiddleware, requirePermission('Manage Roles'), async (req, res) => {
    try {
      const data = insertRoleSchema.parse(req.body);
      const role = await storage.createRole(data);
      res.json(role);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/roles/:id", authMiddleware, requirePermission('Manage Roles'), async (req, res) => {
    try {
      const role = await storage.updateRole(req.params.id, req.body);
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }
      res.json(role);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/roles/:id", authMiddleware, requirePermission('Manage Roles'), async (req, res) => {
    try {
      const success = await storage.deleteRole(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Role not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Hostel routes
  app.get("/api/hostels", authMiddleware, requirePermission('Manage Hostels'), async (req, res) => {
    try {
      const hostels = await storage.getAllHostels();
      res.json(hostels);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/hostels", authMiddleware, requirePermission('Manage Hostels'), async (req, res) => {
    try {
      const data = insertHostelSchema.parse(req.body);
      const hostel = await storage.createHostel(data);
      res.json(hostel);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/hostels/:id", authMiddleware, requirePermission('Manage Hostels'), async (req, res) => {
    try {
      const hostel = await storage.updateHostel(req.params.id, req.body);
      if (!hostel) {
        return res.status(404).json({ error: "Hostel not found" });
      }
      res.json(hostel);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/hostels/:id", authMiddleware, requirePermission('Manage Hostels'), async (req, res) => {
    try {
      const success = await storage.deleteHostel(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Hostel not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Corporate Office routes
  app.get("/api/corporate-offices", authMiddleware, requirePermission('Manage Hostels'), async (req, res) => {
    try {
      const offices = await storage.getAllCorporateOffices();
      res.json(offices);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/corporate-offices", authMiddleware, requirePermission('Manage Hostels'), async (req, res) => {
    try {
      const data = insertCorporateOfficeSchema.parse(req.body);
      const office = await storage.createCorporateOffice(data);
      res.json(office);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Member routes
  app.get("/api/members", authMiddleware, requirePermission('Manage Members'), async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Super Admin can see all members, others only see their entity's members
      if (user.entityType && user.entityId) {
        const members = await storage.getMembersByEntity(user.entityType, user.entityId);
        res.json(members);
      } else {
        const members = await storage.getAllMembers();
        res.json(members);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/members", authMiddleware, requirePermission('Manage Members'), async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const data = insertMemberSchema.parse({
        ...req.body,
        entityType: user.entityType || req.body.entityType,
        entityId: user.entityId || req.body.entityId
      });
      
      const member = await storage.createMember(data);
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/members/:id", authMiddleware, requirePermission('Manage Members'), async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const existingMember = await storage.getMember(req.params.id);
      if (!existingMember) {
        return res.status(404).json({ error: "Member not found" });
      }

      // Check if user can edit this member (must be same entity or super admin)
      if (user.entityType && user.entityId) {
        if (existingMember.entityType !== user.entityType || existingMember.entityId !== user.entityId) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      const member = await storage.updateMember(req.params.id, req.body);
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/members/:id", authMiddleware, requirePermission('Manage Members'), async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const existingMember = await storage.getMember(req.params.id);
      if (!existingMember) {
        return res.status(404).json({ error: "Member not found" });
      }

      // Check if user can delete this member (must be same entity or super admin)
      if (user.entityType && user.entityId) {
        if (existingMember.entityType !== user.entityType || existingMember.entityId !== user.entityId) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      const success = await storage.deleteMember(req.params.id);
      res.json({ success });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Meal Record routes
  app.get("/api/meals", authMiddleware, async (req, res) => {
    try {
      const meals = await storage.getAllMealRecords();
      res.json(meals);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/meals", authMiddleware, async (req, res) => {
    try {
      const data = insertMealRecordSchema.parse(req.body);
      const meal = await storage.createMealRecord(data);
      res.json(meal);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/meals/member/:memberId", authMiddleware, async (req, res) => {
    try {
      const meals = await storage.getMealRecordsByMember(req.params.memberId);
      res.json(meals);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Payment routes
  app.get("/api/payments", authMiddleware, requirePermission('Manage Payments'), async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/payments", authMiddleware, requirePermission('Manage Payments'), async (req, res) => {
    try {
      const data = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(data);
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Feedback routes
  app.get("/api/feedback", authMiddleware, requirePermission('Manage Feedback'), async (req, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/feedback", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertFeedbackSchema.parse({
        ...req.body,
        userId: req.userId
      });
      const feedback = await storage.createFeedback(data);
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Meal Prices routes
  app.get("/api/meal-prices", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.entityType && user.entityId) {
        const mealPrice = await storage.getMealPriceByEntity(user.entityType, user.entityId);
        res.json(mealPrice || null);
      } else {
        const allPrices = await storage.getAllMealPrices();
        res.json(allPrices);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/meal-prices", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const data = insertMealPriceSchema.parse({
        ...req.body,
        entityType: user.entityType,
        entityId: user.entityId
      });
      
      const mealPrice = await storage.createMealPrice(data);
      res.json(mealPrice);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/meal-prices/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const mealPrice = await storage.getMealPrice(req.params.id);
      if (!mealPrice) {
        return res.status(404).json({ error: "Meal price not found" });
      }

      // Check entity access
      if (user.entityType && user.entityId) {
        if (mealPrice.entityType !== user.entityType || mealPrice.entityId !== user.entityId) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      // Enforce 6-hour restriction
      const sixHoursInMs = 6 * 60 * 60 * 1000;
      const lastUpdateTime = mealPrice.updatedAt ? new Date(mealPrice.updatedAt).valueOf() : new Date(mealPrice.createdAt!).valueOf();
      const timeSinceUpdate = Date.now() - lastUpdateTime;
      
      if (timeSinceUpdate > sixHoursInMs) {
        return res.status(403).json({ 
          error: "Cannot edit meal prices more than 6 hours after last update",
          remainingTime: 0
        });
      }

      const updated = await storage.updateMealPrice(req.params.id, req.body);
      res.json({
        ...updated,
        remainingEditTime: sixHoursInMs - timeSinceUpdate
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
