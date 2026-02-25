import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Instagram, Play, MapPin, Youtube, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { runAudit } from "@/lib/run-audit";
export interface AuditFormData {
  businessName: string;
  websiteUrl: string;
  instagram?: string;
  tiktok?: string;
  youtubeUrl?: string;
  googleBusinessUrl?: string;
}

const AuditForm = forwardRef<HTMLDivElement>((_, ref) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AuditFormData>({
    businessName: "",
    websiteUrl: "",
    instagram: "",
    tiktok: "",
    youtubeUrl: "",
    googleBusinessUrl: "",
  });

  const update = (key: keyof AuditFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auditResult = await runAudit(form);
      navigate("/report", { state: { formData: form, auditResult } });
    } catch (err) {
      console.error("Audit error:", err);
      toast({
        title: "Audit Failed",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValid = form.businessName.trim() && form.websiteUrl.trim();

  return (
    <section ref={ref} className="py-20 bg-background" id="audit-form">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-2">Start Your Audit</h2>
          <p className="text-muted-foreground text-center mb-10">
            Enter your business details below. Only public information will be analyzed.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border bg-card p-6 card-elevated space-y-5">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Required Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="e.g. Acme Digital Agency"
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL *</Label>
                <Input
                  id="websiteUrl"
                  placeholder="e.g. https://acmedigital.com"
                  type="url"
                  value={form.websiteUrl}
                  onChange={(e) => update("websiteUrl", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 card-elevated space-y-5">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Instagram className="h-5 w-5 text-primary" />
                Social Media (Optional)
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram Username</Label>
                  <Input
                    id="instagram"
                    placeholder="@username"
                    value={form.instagram}
                    onChange={(e) => update("instagram", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok Username</Label>
                  <Input
                    id="tiktok"
                    placeholder="@username"
                    value={form.tiktok}
                    onChange={(e) => update("tiktok", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeUrl" className="flex items-center gap-1.5">
                  <Youtube className="h-4 w-4" /> YouTube Channel URL
                </Label>
                <Input
                  id="youtubeUrl"
                  placeholder="https://youtube.com/@channel"
                  value={form.youtubeUrl}
                  onChange={(e) => update("youtubeUrl", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleBusinessUrl" className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Google Business Profile Link
                </Label>
                <Input
                  id="googleBusinessUrl"
                  placeholder="https://maps.google.com/..."
                  value={form.googleBusinessUrl}
                  onChange={(e) => update("googleBusinessUrl", e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-lg py-6 rounded-xl font-semibold"
              disabled={!isValid || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Full Digital Audit...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Generate Full Digital Audit
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
});

AuditForm.displayName = "AuditForm";

export default AuditForm;
