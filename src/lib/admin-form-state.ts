export type AdminFieldErrors = Record<string, string[]>

export type AdminFormState = {
    status: 'idle' | 'success' | 'error'
    message?: string
    fieldErrors?: AdminFieldErrors
    redirectTo?: string
    submissionId?: string
}

export type AdminFormAction = (
    state: AdminFormState,
    formData: FormData
) => Promise<AdminFormState>

export const initialAdminFormState: AdminFormState = {
    status: 'idle'
}

function createSubmissionId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function successFormState(message: string, redirectTo?: string): AdminFormState {
    return {
        status: 'success',
        message,
        redirectTo,
        submissionId: createSubmissionId()
    }
}

export function errorFormState(message: string, fieldErrors?: AdminFieldErrors): AdminFormState {
    return {
        status: 'error',
        message,
        fieldErrors,
        submissionId: createSubmissionId()
    }
}

export function zodIssuesToFieldErrors(
    issues: Array<{ path: ReadonlyArray<PropertyKey>; message: string }>
): AdminFieldErrors {
    return issues.reduce<AdminFieldErrors>((fieldErrors, issue) => {
        const firstPath = issue.path[0]
        const field = typeof firstPath === 'string'
            ? firstPath
            : typeof firstPath === 'number'
                ? String(firstPath)
                : 'form'
        fieldErrors[field] = [...(fieldErrors[field] || []), issue.message]
        return fieldErrors
    }, {})
}
