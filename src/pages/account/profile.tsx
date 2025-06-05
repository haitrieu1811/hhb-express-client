import ProfileForm from '~/components/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import useMe from '~/hooks/use-me'

export default function AccountProfilePage() {
  const { meData } = useMe()
  return (
    <Card className='rounded-md'>
      <CardHeader>
        <CardTitle className='text-lg'>Hồ sơ của tôi</CardTitle>
        <CardDescription>Quản lý thông tin hồ sơ để bảo mật tài khoản</CardDescription>
      </CardHeader>
      <CardContent>{meData && <ProfileForm user={meData} />}</CardContent>
    </Card>
  )
}
