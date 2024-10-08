import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'
import React from 'react'
import SettingsForm from './components/settings-form'

const SettingsPage = () => {
  return (
    <div className='flex h-screen bg-background'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto'>
      <Header />
      <SettingsForm />
      </main>
      </div>
  )
}

export default SettingsPage