import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'
import React from 'react'
import PropertyList from './component/property-list'

const PropertyPage = () => {
  return (
    <div className='flex h-screen bg-background'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto'>
      <Header />
      <PropertyList />
      </main>
      </div>
  )
}

export default PropertyPage