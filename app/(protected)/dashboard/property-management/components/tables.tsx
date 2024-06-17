
import { Suspense, useEffect, useState, } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import axios from 'axios'; // Import Axios
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from './data-table';
import { columns } from './columns';


export default function PropertyTable() {

  const user = useCurrentUser();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch('/api/fetch-property', { cache: 'no-store' }) 
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setProperties(data.properties))
      .catch(() =>
        toast.error('An error occurred while fetching approvers. Please try again.')
      );
  }, []);
 

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col p-4 mt-[-10px]">
        <div className="flex-1 overflow-auto mt-8">
          <Card>
            <CardHeader className='font-semibold'>
              Property Details
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton />}>
                <DataTable data={properties} columns={columns} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
