
import { Checkbox } from "@/components/ui/checkbox";

interface ConsentCheckboxProps {
  consent: boolean;
  onConsentChange: (checked: boolean) => void;
}

const ConsentCheckbox = ({ consent, onConsentChange }: ConsentCheckboxProps) => {
  return (
    <div className="flex items-start space-x-3">
      <Checkbox 
        id="consent" 
        checked={consent} 
        onCheckedChange={checked => onConsentChange(checked as boolean)} 
        className="mt-1" 
        required 
      />
      <label htmlFor="consent" className="text-sm text-slate-600 cursor-pointer">
        I consent to my data being processed per GDPR <span className="text-red-500">*</span>
      </label>
    </div>
  );
};

export default ConsentCheckbox;
