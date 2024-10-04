"use client"


import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Home, LayoutDashboard, LogOut, Moon, Settings, Sun, Users } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Sidebar from '@/components/sidebar/page'
import Header from '@/components/header/page'
import DashboardForm from './components/dashboard-page'
import Footer from '@/components/footer/footer'

const data = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Feb',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Mar',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Apr',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Jun',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export default function Dashboard() {

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Header />
      <DashboardForm />
      </main>
    </div>

  )
}