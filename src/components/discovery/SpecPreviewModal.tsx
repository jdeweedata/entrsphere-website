// SPEC Preview Modal with Email Capture
// Freemium flow: Email → Preview → Upgrade CTA

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SpecPreview, generateSpecPreview, saveSpecPreviewLead } from '@/services/discoveryService';
import { DiscoveryRoute } from '@/types/discovery';
import { FileJson, Lock, Sparkles, Check, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import posthog from 'posthog-js';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  route: DiscoveryRoute;
  signals: { A: number; B: number; C: number; D: number };
  messages: ChatMessage[];
}

type Step = 'email' | 'generating' | 'preview' | 'error';

const SpecPreviewModal = ({ isOpen, onClose, sessionId, route, signals, messages }: Props) => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [preview, setPreview] = useState<SpecPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmitEmail = async () => {
    if (!email.trim()) {
      setEmailError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setEmailError(null);
    setStep('generating');

    // Track email capture
    posthog.capture('spec_preview_email_submitted', {
      sessionId,
      route,
      email,
    });

    try {
      // Save lead to Convex
      await saveSpecPreviewLead(email, sessionId, route, signals, messages.length);

      // Generate preview
      const result = await generateSpecPreview(messages, sessionId, route, email);

      if (result.success && result.preview) {
        setPreview(result.preview);
        setStep('preview');

        posthog.capture('spec_preview_generated', {
          sessionId,
          route,
          featuresCount: result.preview.locked_content.full_features_count,
        });
      } else {
        setError(result.error || 'Failed to generate preview');
        setStep('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('error');
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setPreview(null);
    setError(null);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitEmail();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step === 'email' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-violet-600" />
                Generate SPEC.json Preview
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <p className="text-sm text-slate-600">
                Get a preview of your project specification based on this discovery conversation.
                Enter your email to receive the preview.
              </p>

              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Project summary & detected route</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>2-3 key features identified</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Lock className="h-4 w-4" />
                  <span>Full features & acceptance criteria (upgrade)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Lock className="h-4 w-4" />
                  <span>Integrations & technical specs (upgrade)</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={emailError ? 'border-red-500' : ''}
                />
                {emailError && (
                  <p className="text-sm text-red-500">{emailError}</p>
                )}
              </div>

              <Button onClick={handleSubmitEmail} className="w-full bg-violet-600 hover:bg-violet-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Preview
              </Button>

              <p className="text-xs text-slate-500 text-center">
                We'll send you updates about EntrSphere. Unsubscribe anytime.
              </p>
            </div>
          </>
        )}

        {step === 'generating' && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 text-violet-600 animate-spin mx-auto" />
            <div>
              <h3 className="font-semibold text-slate-900">Generating your SPEC preview...</h3>
              <p className="text-sm text-slate-500">Analyzing your discovery conversation</p>
            </div>
          </div>
        )}

        {step === 'preview' && preview && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-green-600" />
                SPEC.json Preview Ready
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Project Summary */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-1">Route {preview.project.route}</div>
                <h3 className="font-bold text-lg">{preview.project.name}</h3>
                <p className="text-sm text-slate-300 mt-1">{preview.project.summary}</p>
              </div>

              {/* Features Preview */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900 text-sm">Features Identified</h4>
                {preview.features_preview.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-slate-50 rounded-lg p-3">
                    <span className="text-slate-400">{feature.id}</span>
                    <span className="flex-1">{feature.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      feature.priority === 'must-have'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {feature.priority}
                    </span>
                  </div>
                ))}
              </div>

              {/* Locked Content Teaser */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700 text-sm">Unlock Full SPEC.json</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    {preview.locked_content.full_features_count} total features
                  </div>
                  {preview.locked_content.has_integrations && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-violet-400" />
                      Integration specs
                    </div>
                  )}
                  {preview.locked_content.has_constraints && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-violet-400" />
                      Constraints & rules
                    </div>
                  )}
                  {preview.locked_content.has_acceptance_criteria && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-violet-400" />
                      Acceptance criteria
                    </div>
                  )}
                  {preview.locked_content.has_risks && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-violet-400" />
                      Risk assessment
                    </div>
                  )}
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg p-4 text-white">
                <h4 className="font-semibold mb-1">Get the Full Discovery Toolkit</h4>
                <p className="text-sm text-violet-100 mb-3">
                  Generate complete SPEC.json files with acceptance criteria, technical specs, and risk assessments.
                </p>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/solutions/discovery-router" onClick={handleClose}>
                    Unlock Full Toolkit
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <Button variant="outline" onClick={handleClose} className="w-full">
                Continue Discovery
              </Button>
            </div>
          </>
        )}

        {step === 'error' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Generation Failed
              </DialogTitle>
            </DialogHeader>

            <div className="py-8 text-center space-y-4">
              <p className="text-slate-600">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setStep('email')}>
                  Try Again
                </Button>
                <Button variant="ghost" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SpecPreviewModal;
