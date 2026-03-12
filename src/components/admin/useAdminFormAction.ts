'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    type AdminFormAction,
    type AdminFormState,
    initialAdminFormState
} from '@/lib/admin-form-state'

type UseAdminFormActionOptions = {
    onSuccess?: (state: AdminFormState) => void
    onError?: (state: AdminFormState) => void
    refreshOnSuccess?: boolean
}

export function useAdminFormAction(
    action: AdminFormAction,
    options: UseAdminFormActionOptions = {}
) {
    const router = useRouter()
    const handledSubmissionId = useRef<string | undefined>(undefined)
    const [state, formAction, isPending] = useActionState(action, initialAdminFormState)

    useEffect(() => {
        if (!state.submissionId || handledSubmissionId.current === state.submissionId) {
            return
        }

        handledSubmissionId.current = state.submissionId

        if (state.status === 'success') {
            toast.success(state.message || '保存しました')
            options.onSuccess?.(state)

            if (state.redirectTo) {
                router.push(state.redirectTo)
                return
            }

            if (options.refreshOnSuccess ?? true) {
                router.refresh()
            }
            return
        }

        if (state.status === 'error') {
            toast.error(state.message || '保存に失敗しました')
            options.onError?.(state)
        }
    }, [options, router, state])

    return { state, formAction, isPending }
}
