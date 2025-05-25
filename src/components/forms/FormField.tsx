
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
}

const FormField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  error = false,
  errorMessage,
}: FormFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input 
        type={type} 
        id={id} 
        value={value} 
        onChange={onChange} 
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
          error ? 'border-red-500' : 'border-slate-200 focus:border-slate-400'
        }`} 
        placeholder={placeholder} 
        required={required} 
      />
      {error && errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default FormField;
