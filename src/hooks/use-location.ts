import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { addressesApis } from '~/apis/addresses.apis'

type UseLocationProps = {
  enabledGetProvinces?: boolean
  provinceId: string
  districtId: string
}

export default function useLocation({ enabledGetProvinces, provinceId, districtId }: UseLocationProps) {
  const getProvincesQuery = useQuery({
    queryKey: ['get-provinces'],
    queryFn: () => addressesApis.getProvinces(),
    enabled: enabledGetProvinces,
    staleTime: 10000
  })

  const provinces = React.useMemo(
    () => getProvincesQuery.data?.data.data.provinces ?? [],
    [getProvincesQuery.data?.data.data.provinces]
  )

  const getDistrictsQuery = useQuery({
    queryKey: ['get-districts', provinceId],
    queryFn: () => addressesApis.getDistricts(provinceId),
    enabled: !!provinceId
  })

  const districts = React.useMemo(
    () => getDistrictsQuery.data?.data.data.districts ?? [],
    [getDistrictsQuery.data?.data.data.districts]
  )

  const getWardsQuery = useQuery({
    queryKey: ['get-wards', provinceId, districtId],
    queryFn: () => addressesApis.getWards({ provinceId, districtId }),
    enabled: !!(provinceId && districtId)
  })

  const wards = React.useMemo(() => getWardsQuery.data?.data.data.wards ?? [], [getWardsQuery.data?.data.data.wards])

  return {
    provinces,
    districts,
    wards
  }
}
