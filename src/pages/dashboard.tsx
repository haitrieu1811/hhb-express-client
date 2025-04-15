import React from 'react'

import { Chart } from '~/components/chart'
import { Chart2 } from '~/components/chart2'
import { DataTable } from '~/components/data-table'
import SectionCard from '~/components/section-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { columns } from '~/lib/columns'
import tasks from '~/lib/tasks.json'

export default function DashboardPage() {
  return (
    <React.Fragment>
      <div className='flex justify-end'>
        <Select>
          <SelectTrigger className='w-full md:w-[180px]'>
            <SelectValue placeholder='Khoảng thời gian' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='week'>Tuần này</SelectItem>
            <SelectItem value='month'>Tháng này</SelectItem>
            <SelectItem value='quarter'>Quý này</SelectItem>
            <SelectItem value='year'>Năm này</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid auto-rows-min gap-4 md:grid-cols-4'>
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <SectionCard key={index} />
          ))}
      </div>
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-span-6'>
          <Chart />
        </div>
        <div className='col-span-6'>
          <Chart2 />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lorem, ipsum dolor.</CardTitle>
          <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={tasks} columns={columns} />
        </CardContent>
      </Card>
    </React.Fragment>
  )
}
