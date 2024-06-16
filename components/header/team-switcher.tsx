"use client"

import * as React from "react"
import {
  CaretSortIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import {
  Dialog,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image"
import { useRouter } from "next/navigation"

const groups = [
  {
    label: "Company",
    teams: [
      {
        label: "RD Group - Property Management System",
        value: "company",
      },
    ],
  },
]

type Team = (typeof groups)[number]["teams"][number]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {}


export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(
    groups[0].teams[0]
  )

  const router = useRouter()

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-full sm:w-auto justify-between", className)}
            onClick={() => router.push("/dashboard")}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarFallback> <Image src="/assets/rdrdc.webp" alt="Image" width={50} height={50} className="flex flex-col"/></AvatarFallback>
            </Avatar>
            {selectedTeam.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </Popover>
    </Dialog>
  )
}