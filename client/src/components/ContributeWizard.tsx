import { useState } from 'react'
import { Button } from '@/components/ui/button'

const STEPS = [
  { label: 'Connect', description: 'Connect your wallet' },
  { label: 'Your Data', description: 'Select what you want to contribute' },
  { label: 'Terms', description: 'Set your usage terms and pricing' },
  { label: 'Review', description: 'Review and submit' },
]

interface Props {
  onClose: () => void
}

export function ContributeWizard({ onClose }: Props) {
  const [step, setStep] = useState(0)
  const isFirst = step === 0
  const isLast = step === STEPS.length - 1

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-purple-400/20 bg-card text-left overflow-hidden">

      {/* Step indicator */}
      <div className="flex items-center px-6 pt-6 pb-4 gap-0">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => i < step && setStep(i)}
              className="flex items-center gap-2 group shrink-0"
            >
              <span
                className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors',
                  i === step
                    ? 'bg-purple-600 text-white'
                    : i < step
                    ? 'bg-purple-600/30 text-purple-300 cursor-pointer group-hover:bg-purple-600/50'
                    : 'bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {i < step ? '✓' : i + 1}
              </span>
              <span
                className={[
                  'text-sm hidden sm:block',
                  i === step ? 'text-foreground font-medium' : 'text-muted-foreground',
                ].join(' ')}
              >
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  'h-px flex-1 mx-3 transition-colors',
                  i < step ? 'bg-purple-600/40' : 'bg-border',
                ].join(' ')}
              />
            )}
          </div>
        ))}
      </div>

      <div className="h-px bg-border" />

      {/* Step content */}
      <div className="px-6 py-8 min-h-48">
        <p className="text-xs font-medium tracking-widest uppercase text-purple-400 mb-2">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          {STEPS[step].label}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {STEPS[step].description}
        </p>

        {/* TODO: add step-specific content here */}
        <div className="rounded-lg border border-dashed border-border h-28 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Content coming soon</span>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Navigation */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          Cancel
        </Button>
        <div className="flex gap-2">
          {!isFirst && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </Button>
          )}
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-500 text-white"
            onClick={() => (isLast ? onClose() : setStep((s) => s + 1))}
          >
            {isLast ? 'Submit' : 'Next →'}
          </Button>
        </div>
      </div>
    </div>
  )
}
