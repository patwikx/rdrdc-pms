import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PropertyLoadingSkeleton = () => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48 mb-2" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-64 mb-1" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
};

export default PropertyLoadingSkeleton;
