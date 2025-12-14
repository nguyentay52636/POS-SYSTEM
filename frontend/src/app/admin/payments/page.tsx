'use client';
import React from 'react';
import PaymentManager from '@/components/Admin/components/Payment/ManagerPayment';
import { PaginationProvider } from '@/context/PaginationContext';

export default function Page() {
  return (
    <PaginationProvider>
      <PaymentManager />
    </PaginationProvider>
  );
}
