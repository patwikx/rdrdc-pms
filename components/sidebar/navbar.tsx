import {
    Building,
    Building2,
    CircleUser,
    HomeIcon,
    LifeBuoy,
    ListChecks,

    Settings,

    Triangle,
    Users2,
  } from "lucide-react"
  
  import { Button } from "@/components/ui/button"

  import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import Headerx from "../header/header"
import Link from "next/link"
import TeamSwitcher from "../header/team-switcher"
  
  export function Navbarx() {
    return (
      <div className="grid w-full">
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
            <h1 className="text-xl font-semibold"><TeamSwitcher /></h1>
            <div className="ml-auto">
                <Headerx />
            </div>
          
          </header>
        </div>
      </div>
    )
  }
  