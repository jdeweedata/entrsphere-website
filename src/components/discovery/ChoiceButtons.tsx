// Multiple choice buttons for router questions

import { RouterOption } from '@/types/discovery';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChoiceButtonsProps {
  options: RouterOption[];
  onSelect: (optionId: string) => void;
  disabled?: boolean;
  selectedId?: string;
}

const ChoiceButtons = ({
  options,
  onSelect,
  disabled = false,
  selectedId,
}: ChoiceButtonsProps) => {
  return (
    <div className="grid gap-3 mt-4">
      {options.map((option) => {
        const isSelected = selectedId === option.id;

        return (
          <Button
            key={option.id}
            variant="outline"
            className={cn(
              'h-auto py-3 px-4 justify-start text-left whitespace-normal',
              'border-2 transition-all duration-200',
              'hover:border-slate-900 hover:bg-slate-50',
              isSelected && 'border-slate-900 bg-slate-50',
              disabled && !isSelected && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !disabled && onSelect(option.id)}
            disabled={disabled && !isSelected}
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-slate-900">{option.label}</span>
              {option.description && (
                <span className="text-sm text-slate-500 font-normal">
                  {option.description}
                </span>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default ChoiceButtons;
