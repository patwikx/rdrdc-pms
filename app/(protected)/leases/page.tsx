import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'
import React from 'react'
import LeaseForm from './components/lease-form'

const LeasePage = () => {
  return (
    <div className='flex h-screen bg-background'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto'>
      <Header />
      <LeaseForm />
      </main>
      </div>
  )
}

export default LeasePage