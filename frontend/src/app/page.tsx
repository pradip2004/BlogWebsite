"use client"
import HomeLayout from '@/components/HomeLayout'
import Loading from '@/components/Loading'
import { useAppContext } from '@/context/AppContext'
import { Divide } from 'lucide-react'
import React from 'react'

const page = () => {
  const { loading, blogs, blogLoading } = useAppContext()
  return (

    <HomeLayout>
      {loading ? <Loading /> :
        <div className='container mx-auto px-4 '>

        </div>}
    </HomeLayout>

  )
}

export default page