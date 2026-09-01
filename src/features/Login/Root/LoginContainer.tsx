import { LoginPresentational } from '@/features/Login/Root/LoginPresentational'
import { useLoginMutationHandler } from '@/features/Login/Root/hooks/handlers/useLoginMutationHandler'

export const LoginContainer = () => {
  const { data, uiState, handlers } = useLoginMutationHandler()

  return (
    <>
      <LoginPresentational data={data} uiState={uiState} handlers={handlers} />
    </>
  )
}
