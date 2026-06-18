import { useCallback, useState } from 'react'

type PermissionState = NotificationPermission | 'unsupported'

export function useNotifications() {
  const supported = 'Notification' in window

  const [permission, setPermission] = useState<PermissionState>(
    supported ? Notification.permission : 'unsupported',
  )

  const request = useCallback(async () => {
    if (!supported) return
    const result = await Notification.requestPermission()
    setPermission(result)
  }, [supported])

  return { permission, request, supported }
}
