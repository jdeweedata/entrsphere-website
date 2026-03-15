import { Envelope, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

export default function AuditFooter() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display text-lg text-foreground italic">
            EntrSphere
          </p>

          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <a
              href="mailto:hello@entrsphere.com"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Envelope className="h-4 w-4" weight="light" />
              hello@entrsphere.com
            </a>
            <a
              href="https://wa.me/27000000000"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappLogo className="h-4 w-4" weight="light" />
              WhatsApp
            </a>
          </div>
        </div>

        <p className="text-muted-foreground/40 text-xs text-center mt-8">
          &copy; {new Date().getFullYear()} EntrSphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
