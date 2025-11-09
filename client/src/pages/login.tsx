import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerEntityType, setRegisterEntityType] = useState("Individual");
  const [registerLoading, setRegisterLoading] = useState(false);
  
  // Entity-specific fields
  const [entityName, setEntityName] = useState("");
  const [entityAddress, setEntityAddress] = useState("");
  const [entityPhone, setEntityPhone] = useState("");
  const [hostelCapacity, setHostelCapacity] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Success",
        description: "Logged in successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    
    try {
      const payload: any = {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        entityType: registerEntityType
      };

      // Add entity data if not Individual
      if (registerEntityType !== 'Individual') {
        payload.entityName = entityName;
        payload.entityData = {
          name: entityName,
          address: entityAddress,
          contactPhone: entityPhone
        };

        if (registerEntityType === 'Hostel') {
          payload.entityData.capacity = parseInt(hostelCapacity) || 10;
        }
      }

      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Manually set auth state
      localStorage.setItem('token', response.token);
      window.location.href = '/';

      toast({
        title: "Success",
        description: "Account created successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const showEntityFields = registerEntityType !== 'Individual';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-lg">
              <Building2 className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">Hostel Manager</CardTitle>
          <CardDescription>Manage your hostel, meals, and members</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    data-testid="input-login-email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    data-testid="input-login-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loginLoading} data-testid="button-login">
                  {loginLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    data-testid="input-register-name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    data-testid="input-register-email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    data-testid="input-register-password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Type</label>
                  <Select value={registerEntityType} onValueChange={setRegisterEntityType}>
                    <SelectTrigger data-testid="select-entity-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Hostel">Hostel</SelectItem>
                      <SelectItem value="Corporate">Corporate Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {showEntityFields && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {registerEntityType === 'Hostel' ? 'Hostel' : 'Company'} Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter name"
                        value={entityName}
                        onChange={(e) => setEntityName(e.target.value)}
                        required
                        data-testid="input-entity-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address</label>
                      <Input
                        type="text"
                        placeholder="Enter address"
                        value={entityAddress}
                        onChange={(e) => setEntityAddress(e.target.value)}
                        required
                        data-testid="input-entity-address"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contact Phone</label>
                      <Input
                        type="tel"
                        placeholder="+1234567890"
                        value={entityPhone}
                        onChange={(e) => setEntityPhone(e.target.value)}
                        required
                        data-testid="input-entity-phone"
                      />
                    </div>
                    {registerEntityType === 'Hostel' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Capacity</label>
                        <Input
                          type="number"
                          placeholder="Number of beds"
                          value={hostelCapacity}
                          onChange={(e) => setHostelCapacity(e.target.value)}
                          required
                          data-testid="input-hostel-capacity"
                        />
                      </div>
                    )}
                  </>
                )}

                <Button type="submit" className="w-full" disabled={registerLoading} data-testid="button-register">
                  {registerLoading ? 'Registering...' : 'Register'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
