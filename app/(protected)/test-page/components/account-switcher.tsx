"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface AccountSwitcherProps {
  isCollapsed: boolean
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
}

type Companiesx = {
  id: string;
  companyName: string;
}

export function AccountSwitcher({
  isCollapsed,
  accounts,
}: AccountSwitcherProps) {
  const [selectedAccount, setSelectedAccount] = React.useState<string>(
    accounts[0].email
  )

  const [companies, setCompanies] = React.useState<Companiesx[]>([]);

  React.useEffect(() => {
    fetch('/api/fetch-company')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setCompanies(data.companies))
      .catch(() =>
        toast.error('An error occurred while fetching approvers. Please try again.')
      );
  }, []);

  return (



    <div className="w-[350px]">
<Select defaultValue={selectedAccount} onValueChange={setSelectedAccount}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          {companies.find((company) => company.companyName === selectedAccount)?.id || null}
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {
              companies.find((company) => company.companyName === selectedAccount)
                ?.id
            }
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {companies.map((company) => (
          <SelectItem key={company.companyName} value={company.companyName}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {company.id}
              {company.companyName}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    </div>
    
  )
}
