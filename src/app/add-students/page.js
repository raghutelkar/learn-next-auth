'use client';

import AddStudentsForm from '@/components/AddStudentsForm';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from "react";
import Header from "@/components/Header";

const AddStudentsPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
      if (!session || session?.user?.role !== 'admin') {
          redirect('/');
      }
  }, [session]);
  return (
    <>
      <Header userName={session?.user?.name} userRole={session?.user?.role} />
      <AddStudentsForm userId={session?.user?.id} />
    </>
  );
}

export default AddStudentsPage