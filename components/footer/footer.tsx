
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "../ui/separator";

const Footer = () => {
  return (
    <footer className="bg-background text-center py-4">
        <Separator className="mt-[-16px]" />
      <p className="text-sm text-muted-foreground mt-4">
        &copy; 2024 RD REALTY DEVELOPMENT CORPORATION
      </p>
      <div className="mt-[-10px] mb-[-10px]">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-sm text-primary underline">
            Developer Information
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Developer Information</DialogTitle>
            <DialogDescription>
  This web application was developed by 
   <a href="https://facebook.com/fatwiks" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline ml-1">
    Patrick Miranda
  </a>.
  <div>
  For inquiries, contact us at 
   <a href="mailto:patricklacapmiranda@gmail.com" className="font-semibold text-blue-600 hover:underline ml-1">
    patricklacapmiranda@gmail.com
  </a>.
  </div>

</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      </div>

    </footer>
  );
};

export default Footer;
