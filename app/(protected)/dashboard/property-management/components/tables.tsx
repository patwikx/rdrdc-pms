'use client'
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import axios from 'axios'; // Import Axios
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCheckIcon, Hourglass, Trash } from 'lucide-react';
import { DataTable } from './data-table';
import { columns } from './columns';

export default function PropertyTable() {
  const [properties, setProperties] = useState([]);
  const user = useCurrentUser();

  // Function to fetch properties data
  const fetchProperties = () => {
    axios.get('/api/fetch-property')
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => setProperties(data.properties))
      .catch((error) => {
        toast.error('An error occurred while fetching properties. Please try again.');
      });
  };

  // Fetch properties data initially and on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Periodically refetch data (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(fetchProperties,  3 * 1000); // Fetch every 5 minutes

    return () => clearInterval(interval); // Cleanup interval on unmount
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
