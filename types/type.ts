import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export type SideNavItemGroup = {
  title: string;
  menuList: SideNavItem[]
}

export interface SidebarItems {
  links: Array<{
    label: string;
    href: string;
    icon?: LucideIcon;
  }>;
  extras?: ReactNode;
}

export type Property = {
  id: number;
  propertyCode: string;
  propertyName: string;
  titleNo: string;
  lotNo: string;
  registeredOwner: string;
  city: string;
  province: string;
  address: string;
  propertyType: string;
  units: number;
  rent: number;
  space: Space[]; 
  rpt: RPT[];
  attachments: Attachments[]
};

export type Space = {
  id: string;
  spaceArea: string;
  spaceNumber: string;
  spaceStatus: string;
};

export type RPT = {
  id: string;
  TaxDecNo: string;
  PaymentMode: String;
  DueDate: string;
  Status: string;
  custodianRemarks: string;
};

export type Attachments = {
  id: string;
  files: string;
}
