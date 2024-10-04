'use client'

import React, { useState } from 'react'
import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'
import TenantsForm from './components/tenants-form'

const TenantsPage = () => {
  return (
    <div className='flex h-screen bg-background'>
      <Sidebar />
      <main className='flex-1 overflow-hidden flex flex-col'>
        <Header />
      <TenantsForm />
      </main>
    </div>
  )
}

export default TenantsPage;
