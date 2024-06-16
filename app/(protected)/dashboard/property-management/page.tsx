
import { Activity, CheckCheckIcon, Hourglass, Trash, } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCompanies, fetchCustodians, fetchProperties } from "@/actions/queries";
import PropertyTable from "./components/tables";


function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

export default async function PropertyManagementPage() {
  const user = await auth();

  {/* 

  if (!user) {
    return <p className='flex flex-col items-center justify-center text-center'>Unauthorized access.</p>;
  }

  const isAdmin = user.user.role === 'Administrator';
  const isUser = user.user.role === 'Custodian';


  if (!isAdmin && !isUser ) {
    return <p className='flex flex-col items-center justify-center text-center'>Unauthorized access.</p>;
  }
  
  */}

  const properties = await fetchProperties();
  const totalProperties = properties.length;
  const companies = await fetchCompanies();
  const totalCompanies = companies.length;
  const custodians = await fetchCustodians();
  const totalCustodians = custodians.length;

  return (
    <div className="flex flex-1 max-h-screen w-full flex-col">
      <div className="flex justify-between items-center mb-[-8px] ml-8 mr-8 mt-3">
        <Label className="text-2xl font-bold">Welcome to Property Management System, {user?.user.firstName}!</Label>
      </div>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total # of Properties</CardTitle>
              <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{totalProperties}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total # of Companies</CardTitle>
              <CheckCheckIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{totalCompanies}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total # of Custodians</CardTitle>
              <Trash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{totalCustodians}</div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total # of properties with unpaid RPT</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-3">{totalProperties}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="allProperties" className="space-y-4">
          <div className="flex justify-center w-full space-x-4 mb-[-30px]">
          <TabsList>
            <TabsTrigger value="allProperties">Assigned Properties</TabsTrigger>
            <TabsTrigger value="forApproval">Approve Leaves</TabsTrigger>
          </TabsList>
          </div>
            
            <TabsContent value="allProperties" className="space-y-4 mt-[-20px]">
            <div className="flex gap-2 md:grid-cols-2 mb-[-20px]">
              <div className="w-full">
                 <PropertyTable />
              </div>
              </div>
            </TabsContent>
            <TabsContent value="forApproval" className="space-y-4">
            <div className="flex grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
            
              </div>

  
  </div>
</TabsContent>
<TabsContent value="forPosting" className="space-y-4">
            <div className="flex grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
            
              </div>

  
  </div>
</TabsContent>
<TabsContent value="leaveHistory" className="space-y-4">
            <div className="flex grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
          
              </div>

  
  </div>
</TabsContent>
          </Tabs>

      </main>
    </div>
  );
}
