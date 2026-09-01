import { ACCOUNT_TYPE_LABEL } from '@/share/constants/accountTypeLabel'
import { useGetMeQuery } from '@/share/hooks/queries/useGetMeQuery'

export const useGetMeHandler = () => {
  const { data: me } = useGetMeQuery()

  return {
    data: {
      userName: me?.name ?? '',
      roleLabel: me ? ACCOUNT_TYPE_LABEL[me.role] : '',
      role: me?.role ?? 'sales',
    },
  }
}
