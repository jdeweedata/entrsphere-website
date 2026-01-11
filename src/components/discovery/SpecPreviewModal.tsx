// SPEC Preview Modal with Email Capture
// Freemium flow: Email → Preview → Upgrade CTA
// Brand: EntrSphere Liquid Tech Design System

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SpecPreview, generateSpecPreview, saveSpecPreviewLead } from '@/services/discoveryService';
import { DiscoveryRoute } from '@/types/discovery';
import { FileCode, Lock, Sparkle, Check, SpinnerGap, ArrowRight, WarningCircle } from '@phosphor-icons/react';
import Link from 'next/link';
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
      <DialogContent className="sm:max-w-lg bg-[#112B58] border border-[#88D2E8]/20 text-white">
        {step === 'email' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <FileCode weight="duotone" className="h-5 w-5 text-[#88D2E8]" />
                Generate SPEC.json Preview
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <p className="text-sm text-blue-200">
                Get a preview of your project specification based on this discovery conversation.
                Enter your email to receive the preview.
              </p>

              <div className="bg-[#2069A8]/10 backdrop-blur-md rounded-2xl p-4 space-y-2 border border-[#88D2E8]/20">
                <div className="flex items-center gap-2 text-sm">
                  <Check weight="duotone" className="h-4 w-4 text-[#88D2E8]" />
                  <span className="text-blue-100">Project summary & detected route</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check weight="duotone" className="h-4 w-4 text-[#88D2E8]" />
                  <span className="text-blue-100">2-3 key features identified</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-300/60">
                  <Lock weight="duotone" className="h-4 w-4" />
                  <span>Full features & acceptance criteria (upgrade)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-300/60">
                  <Lock weight="duotone" className="h-4 w-4" />
                  <span>Integrations & technical specs (upgrade)</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-100">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`bg-[#112B58]/80 border-[#88D2E8]/30 text-white placeholder:text-blue-300/50 rounded-xl focus:border-[#88D2E8] ${emailError ? 'border-red-400' : ''}`}
                />
                {emailError && (
                  <p className="text-sm text-red-400">{emailError}</p>
                )}
              </div>

              <Button onClick={handleSubmitEmail} className="w-full bg-gradient-to-r from-[#2069A8] to-[#88D2E8] hover:opacity-90 rounded-xl border-0">
                <Sparkle weight="duotone" className="h-4 w-4 mr-2" />
                Generate Preview
              </Button>

              <p className="text-xs text-blue-300/60 text-center">
                We'll send you updates about EntrSphere. Unsubscribe anytime.
              </p>
            </div>
          </>
        )}

        {step === 'generating' && (
          <div className="py-12 text-center space-y-4">
            <SpinnerGap weight="duotone" className="h-12 w-12 text-[#88D2E8] animate-spin mx-auto" />
            <div>
              <h3 className="font-semibold text-white">Generating your SPEC preview...</h3>
              <p className="text-sm text-blue-200">Analyzing your discovery conversation</p>
            </div>
          </div>
        )}

        {step === 'preview' && preview && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <FileCode weight="duotone" className="h-5 w-5 text-[#88D2E8]" />
                SPEC.json Preview Ready
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Project Summary */}
              <div className="bg-gradient-to-br from-[#2069A8] to-[#112B58] rounded-2xl p-4 border border-[#88D2E8]/30">
                <div className="text-xs text-[#88D2E8] mb-1">Route {preview.project.route}</div>
                <h3 className="font-bold text-lg text-white">{preview.project.name}</h3>
                <p className="text-sm text-blue-200 mt-1">{preview.project.summary}</p>
              </div>

              {/* Features Preview */}
              <div className="space-y-2">
                <h4 className="font-semibold text-white text-sm">Features Identified</h4>
                {preview.features_preview.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-[#2069A8]/10 backdrop-blur-md rounded-xl p-3 border border-[#88D2E8]/20">
                    <span className="text-[#88D2E8] font-mono text-xs">{feature.id}</span>
                    <span className="flex-1 text-blue-100">{feature.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      feature.priority === 'must-have'
                        ? 'bg-[#88D2E8]/20 text-[#88D2E8] border border-[#88D2E8]/30'
                        : 'bg-[#2069A8]/30 text-blue-200 border border-[#2069A8]/50'
                    }`}>
                      {feature.priority}
                    </span>
                  </div>
                ))}
              </div>

              {/* Locked Content Teaser */}
              <div className="border border-[#88D2E8]/20 rounded-2xl p-4 bg-[#2069A8]/10 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-3">
                  <Lock weight="duotone" className="h-4 w-4 text-blue-300/60" />
                  <span className="font-medium text-blue-200 text-sm">Unlock Full SPEC.json</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-300/60">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#88D2E8]" />
                    {preview.locked_content.full_features_count} total features
                  </div>
                  {preview.locked_content.has_integrations && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#88D2E8]" />
                      Integration specs
                    </div>
                  )}
                  {preview.locked_content.has_constraints && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#88D2E8]" />
                      Constraints & rules
                    </div>
                  )}
                  {preview.locked_content.has_acceptance_criteria && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#88D2E8]" />
                      Acceptance criteria
                    </div>
                  )}
                  {preview.locked_content.has_risks && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#88D2E8]" />
                      Risk assessment
                    </div>
                  )}
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="bg-gradient-to-r from-[#2069A8] to-[#88D2E8] rounded-2xl p-4 text-white">
                <h4 className="font-semibold mb-1">Get the Full Discovery Toolkit</h4>
                <p className="text-sm text-blue-100 mb-3">
                  Generate complete SPEC.json files with acceptance criteria, technical specs, and risk assessments.
                </p>
                <Button asChild variant="secondary" className="w-full bg-white text-[#112B58] hover:bg-blue-50 rounded-xl">
                  <Link href="/solutions/discovery-router" onClick={handleClose}>
                    Unlock Full Toolkit
                    <ArrowRight weight="duotone" className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <Button variant="outline" onClick={handleClose} className="w-full border-[#88D2E8]/30 text-blue-200 hover:bg-[#2069A8]/20 hover:text-white rounded-xl">
                Continue Discovery
              </Button>
            </div>
          </>
        )}

        {step === 'error' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-400">
                <WarningCircle weight="duotone" className="h-5 w-5" />
                Generation Failed
              </DialogTitle>
            </DialogHeader>

            <div className="py-8 text-center space-y-4">
              <p className="text-blue-200">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setStep('email')} className="border-[#88D2E8]/30 text-blue-200 hover:bg-[#2069A8]/20 rounded-xl">
                  Try Again
                </Button>
                <Button variant="ghost" onClick={handleClose} className="text-blue-300 hover:text-white hover:bg-[#2069A8]/20 rounded-xl">
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
