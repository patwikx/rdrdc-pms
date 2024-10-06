import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'
import React from 'react'
import { BillingManagement } from './components/billing-form'



const BillingPage = () => {
  return (
    <div className='flex h-screen bg-background'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto'>
        <Header />
        <div className='ml-8 mr-8 mt-12'>
        <BillingManagement />
        </div>

      </main>
    </div>
  )
}

export default BillingPage