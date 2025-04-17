import { useQuery } from '@tanstack/react-query'
import { Crown, Headset, ShoppingCart } from 'lucide-react'
import React from 'react'

import usersApis from '~/apis/users.apis'
import { userColumns } from '~/components/columns/user'
import { DataTable } from '~/components/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { UserRole } from '~/constants/enum'

export default function DashboardUserPage() {
  const getAllUsersQuery = useQuery({
    queryKey: ['getAllUsers'],
    queryFn: () => usersApis.getAllUsers()
  })

  const users = React.useMemo(
    () => getAllUsersQuery.data?.data.data.users ?? [],
    [getAllUsersQuery.data?.data.data.users]
  )

  const totalUsers = React.useMemo(
    () => getAllUsersQuery.data?.data.data.pagination.totalRows ?? 0,
    [getAllUsersQuery.data?.data.data.pagination.totalRows]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Danh sách người dùng</CardTitle>
        <CardDescription>Có {totalUsers} người dùng trên hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={userColumns}
          data={users}
          searchField='email'
          facetedFilters={[
            {
              columnName: 'role',
              title: 'Vai trò',
              options: [
                {
                  value: String(UserRole.Admin),
                  label: 'Admin',
                  icon: Crown
                },
                {
                  value: String(UserRole.Staff),
                  label: 'Nhân viên',
                  icon: Headset
                },
                {
                  value: String(UserRole.Customer),
                  label: 'Khách hàng',
                  icon: ShoppingCart
                }
              ]
            }
          ]}
        />
      </CardContent>
    </Card>
  )
}
