'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import {usePathname, useParams, redirect} from 'next/navigation';
import { PageContainer } from '@toolpad/core/PageContainer';
import SidebarFooterAccount from './SidebarFooterAccount';

function CustomActions() {
  return (
    <Stack direction="row" alignItems="center">
      <ThemeSwitcher />
    </Stack>
  );
}

export default function Layout(props: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const [employeeId] = params.segments ?? [];

  const title = React.useMemo(() => {
    if (pathname === '/employees/new') {
      return 'New Employee';
    }
    if (employeeId && pathname.includes('/edit')) {
      return `Employee ${employeeId} - Edit`;
    }
    if (employeeId) {
      return `Employee ${employeeId}`;
    }
    return undefined;
  }, [employeeId, pathname]);

  return (
    <DashboardLayout
      slots={{
        toolbarActions: CustomActions,
        sidebarFooter: SidebarFooterAccount,
      }}
    >
      <PageContainer title={title}>
        {props.children}
      </PageContainer>
    </DashboardLayout>
  );
}
