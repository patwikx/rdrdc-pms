'use client'

import React from 'react'

import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import KanbanForm from './components/kanban-page'

const KanbanPage = () => {

  return (
    <div className='flex h-screen bg-background'>
      <Sidebar />
      <main className='flex-1 overflow-hidden flex flex-col'>
        <Header />
        <div className='flex-1 p-6 space-y-6'>
          <KanbanForm />
       </div>
      </main>
    </div>
  )
}

export default KanbanPage
