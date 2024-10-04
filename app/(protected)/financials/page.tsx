'use client'

import React, { useState } from 'react'
import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'
import FinancialForms from './components/financial-form'


const FinancialsPage = () => {


  return (
    <div className='flex h-screen bg-background'>
      <Sidebar />
      <main className='flex-1 overflow-hidden'>
        <Header />
        <FinancialForms />
      </main>
    </div>
  )
}

export default FinancialsPage