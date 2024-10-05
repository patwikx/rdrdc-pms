import { Loader2 } from "lucide-react";
import { FC } from "react";

const Loading: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`flex items-center justify-center min-h-screen ${className}`}
    >
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
