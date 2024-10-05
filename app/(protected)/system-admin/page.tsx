import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'
import React from 'react'
import SystemAdminDetails from './components/system-admin'


const SystemAdminPage = () => {



  return (
    <div className='flex h-screen bg-background'>
        <Sidebar />
        <main className='flex-1 overflow-y-auto'>
        <Header />
        <SystemAdminDetails />
        </main>
    </div>
  )
}

export default SystemAdminPage