import { useReadContract } from 'wagmi'
import config from "./../app/config";

function ReadContract() {
  const { data: result } = useReadContract({
    ...config,
    functionName: 'getfeed',
  })

  return (
    <div>Balance: {result?.toString()}</div>
  )
}
export default ReadContract