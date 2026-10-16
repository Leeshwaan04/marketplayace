import React, { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface ToastProps {
  message: string | null
  onDismiss: () => void
  actionLabel?: string
  onAction?: () => void
}

/** Polite, auto-dismissing confirmation. Announced to screen readers via aria-live. */
export const Toast: React.FC<ToastProps> = ({ message, onDismiss, actionLabel, onAction }) => {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [message, onDismiss])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4"
    >
      {message && (
        <div className="animate-rise pointer-events-auto flex max-w-md items-center gap-3 rounded-xl border border-line-strong bg-surface-2 px-4 py-3 text-sm text-white shadow-2xl shadow-black/50">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden />
          <span className="min-w-0 truncate">{message}</span>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={() => {
                onAction()
                onDismiss()
              }}
              className="shrink-0 rounded-md px-2 py-1 font-semibold text-accent hover:bg-surface-3"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
