
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ChallengeSelectProps {
  challenge: string;
  otherChallenge: string;
  onChallengeChange: (value: string) => void;
  onOtherChallengeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
}

const ChallengeSelect = ({
  challenge,
  otherChallenge,
  onChallengeChange,
  onOtherChallengeChange,
  error = false,
}: ChallengeSelectProps) => {
  return (
    <div>
      <label htmlFor="challenge" className="block text-sm font-medium text-slate-700 mb-2">
        What's your biggest challenge? <span className="text-red-500">*</span>
      </label>
      <Select value={challenge} onValueChange={onChallengeChange}>
        <SelectTrigger className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
          error ? 'border-red-500' : 'border-slate-200 focus:border-slate-400'
        }`}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-slate-200 shadow-lg rounded-lg">
          <SelectItem value="manual_processes">Manual processes</SelectItem>
          <SelectItem value="high_costs">High operational costs</SelectItem>
          <SelectItem value="digital_transformation">Digital transformation</SelectItem>
          <SelectItem value="scaling_operations">Scaling operations</SelectItem>
          <SelectItem value="other">Other (please specify)</SelectItem>
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500 mt-1">Please select your biggest challenge.</p>}

      {challenge === "other" && (
        <div className="mt-4">
          <label htmlFor="other_challenge" className="block text-sm font-medium text-slate-700 mb-2">
            Please specify your challenge:
          </label>
          <Input 
            type="text" 
            id="other_challenge" 
            value={otherChallenge} 
            onChange={onOtherChallengeChange} 
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-slate-400 transition-all duration-200" 
            placeholder="Describe your challenge" 
            required={challenge === "other"} 
          />
        </div>
      )}
    </div>
  );
};

export default ChallengeSelect;
