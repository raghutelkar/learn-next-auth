'use client'

import React, { useEffect } from 'react'
import { redirect } from 'next/navigation';
import StudentsList from '@/components/StudentsList'
import Header from '@/components/Header';
import { useSession } from 'next-auth/react';

const StudentsListPage = () => {
  const { data: session } = useSession();

    useEffect(() => {
        if (!session || session?.user?.role !== 'admin') {
            redirect('/');
        }
    }, [session]);

  return (
    <>
      <Header userName={session?.user?.name} userRole={session?.user?.role} />
      <StudentsList />
    </>
  )
}

export default StudentsListPage