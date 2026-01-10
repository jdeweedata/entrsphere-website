// Email capture form component

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight, X } from 'lucide-react';

interface EmailCaptureProps {
  onSubmit: (email: string, wantsUpdates: boolean) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

const EmailCapture = ({ onSubmit, onSkip, isLoading = false }: EmailCaptureProps) => {
  const [email, setEmail] = useState('');
  const [wantsUpdates, setWantsUpdates] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    onSubmit(email, wantsUpdates);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="updates"
            checked={wantsUpdates}
            onCheckedChange={(checked) => setWantsUpdates(checked as boolean)}
            disabled={isLoading}
          />
          <Label
            htmlFor="updates"
            className="text-sm text-slate-600 font-normal cursor-pointer"
          >
            Send me tips on avoiding scope creep and building better specs
          </Label>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              'Sending...'
            ) : (
              <>
                Get My Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onSkip}
            disabled={isLoading}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Skip</span>
          </Button>
        </div>

        <p className="text-xs text-slate-400 text-center">
          No spam. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
};

export default EmailCapture;
