import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Download, Globe, Paintbrush, BarChart3, Instagram, MapPin, Youtube,
  Layers, CalendarDays, CheckSquare, Shield, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreRing from "@/components/audit/ScoreRing";
import AuditSection, { BulletList, SubHeading } from "@/components/audit/AuditSection";
import { type AuditResult } from "@/lib/generate-mock-audit";
import { exportReportAsPdf } from "@/lib/pdf-export";
import type { AuditFormData } from "@/components/AuditForm";

const AuditReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData as AuditFormData | undefined;
  const auditResult = location.state?.auditResult as AuditResult | undefined;
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!formData || !auditResult) {
      navigate("/");
      return;
    }
    // Brief delay for smooth transition
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [formData, auditResult, navigate]);

  const audit = useMemo<AuditResult | null>(() => {
    if (!formData || !auditResult) return null;
    return {
      ...auditResult,
      businessName: formData.businessName,
      websiteUrl: formData.websiteUrl,
    };
  }, [formData, auditResult]);

  const handleExport = async () => {
    if (!audit) return;
    setExporting(true);
    try {
      await exportReportAsPdf("audit-report", audit.businessName);
    } finally {
      setExporting(false);
    }
  };

  if (!formData || !audit) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">Analyzing {formData.businessName}...</h2>
        <p className="text-muted-foreground">Scanning public data across all platforms</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hero-gradient">
        <div className="container flex items-center justify-between py-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> New Audit
          </Button>
          <Button onClick={handleExport} disabled={exporting} className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download Professional PDF Report
          </Button>
        </div>
      </div>

      <div id="audit-report" className="container max-w-4xl py-10 space-y-8">
        {/* Executive Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-8 card-elevated text-center">
          <h1 className="text-3xl font-bold mb-1">Digital Presence Audit</h1>
          <p className="text-lg text-muted-foreground mb-6">{audit.businessName}</p>
          <div className="flex justify-center mb-6">
            <ScoreRing score={audit.overallScore} size={140} label="Overall Score" />
          </div>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            This audit is based on publicly available data. No private analytics or hidden data were accessed.
          </p>
        </motion.div>

        {/* Brand Consistency */}
        <AuditSection title="Brand Consistency Check" icon={Paintbrush} score={audit.brandConsistency.score} scoreLabel="Brand Score" delay={0.1}>
          <SubHeading>Findings</SubHeading>
          <BulletList items={audit.brandConsistency.notes} />
          <SubHeading>Recommendations</SubHeading>
          <BulletList items={audit.brandConsistency.suggestions} variant="success" />
        </AuditSection>

        {/* Website Audit */}
        <AuditSection title="Website Audit" icon={Globe} score={audit.websiteAudit.score} scoreLabel="Website Score" delay={0.15}>
          <SubHeading>Analysis</SubHeading>
          <BulletList items={audit.websiteAudit.findings} variant="warning" />
          <SubHeading>Improvement Suggestions</SubHeading>
          <BulletList items={audit.websiteAudit.suggestions} variant="success" />
          <SubHeading>CTA Rewrite Examples</SubHeading>
          <BulletList items={audit.websiteAudit.ctaRewrites} />
        </AuditSection>

        {/* Social Media */}
        {audit.socialMedia.map((platform, i) => (
          <AuditSection
            key={platform.platform}
            title={`${platform.platform} Audit`}
            icon={platform.platform === "Instagram" ? Instagram : BarChart3}
            score={platform.score}
            scoreLabel={`${platform.platform} Score`}
            delay={0.2 + i * 0.05}
          >
            <SubHeading>Bio Rewrite Suggestion</SubHeading>
            <div className="rounded-lg bg-muted p-4 text-sm italic text-foreground/80">"{platform.bioRewrite}"</div>
            <SubHeading>Content Format Improvements</SubHeading>
            <BulletList items={platform.contentImprovements} variant="success" />
            <SubHeading>Hook Examples for Your Niche</SubHeading>
            <BulletList items={platform.hookExamples} />
            <SubHeading>Engagement Growth Suggestions</SubHeading>
            <BulletList items={platform.engagementSuggestions} variant="success" />
          </AuditSection>
        ))}

        {/* Google Business */}
        {audit.googleBusiness && (
          <AuditSection title="Google Business Profile Audit" icon={MapPin} score={audit.googleBusiness.score} scoreLabel="Local SEO" delay={0.3}>
            <div className="flex gap-6 mb-4">
              <div className="rounded-lg bg-muted px-4 py-3 text-center">
                <p className="text-2xl font-bold">{audit.googleBusiness.reviewCount}</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
              <div className="rounded-lg bg-muted px-4 py-3 text-center">
                <p className="text-2xl font-bold">{audit.googleBusiness.starRating}⭐</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
            <SubHeading>Suggestions</SubHeading>
            <BulletList items={audit.googleBusiness.suggestions} variant="success" />
            <SubHeading>Optimized Description</SubHeading>
            <div className="rounded-lg bg-muted p-4 text-sm italic text-foreground/80">"{audit.googleBusiness.descriptionRewrite}"</div>
            <SubHeading>30-Day Local Visibility Plan</SubHeading>
            <BulletList items={audit.googleBusiness.visibilityPlan} />
          </AuditSection>
        )}

        {/* YouTube */}
        {audit.youtube && (
          <AuditSection title="YouTube Channel Audit" icon={Youtube} score={audit.youtube.score} scoreLabel="Channel Score" delay={0.35}>
            <SubHeading>Improved Title Examples</SubHeading>
            <BulletList items={audit.youtube.titleExamples} />
            <SubHeading>Thumbnail Improvement Advice</SubHeading>
            <BulletList items={audit.youtube.thumbnailAdvice} variant="success" />
            <SubHeading>Shorts Repurposing Strategy</SubHeading>
            <BulletList items={audit.youtube.shortsStrategy} variant="success" />
          </AuditSection>
        )}

        {/* Content Funnel */}
        <AuditSection title="Content Funnel Analysis" icon={Layers} delay={0.4}>
          <div className="flex gap-4 mb-4 flex-wrap">
            {[
              { label: "Awareness", active: audit.contentFunnel.awareness },
              { label: "Authority", active: audit.contentFunnel.authority },
              { label: "Conversion", active: audit.contentFunnel.conversion },
            ].map((stage) => (
              <div
                key={stage.label}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  stage.active ? "bg-score-excellent/10 text-score-excellent" : "bg-score-poor/10 text-score-poor"
                }`}
              >
                {stage.active ? "✅" : "❌"} {stage.label}
              </div>
            ))}
          </div>
          <BulletList items={audit.contentFunnel.suggestions} />
        </AuditSection>

        {/* Growth Plan */}
        <AuditSection title="30-60-90 Day Growth Plan" icon={CalendarDays} delay={0.45}>
          <SubHeading>First 30 Days</SubHeading>
          <BulletList items={audit.growthPlan.thirtyDays} variant="success" />
          <SubHeading>Days 30–60</SubHeading>
          <BulletList items={audit.growthPlan.sixtyDays} />
          <SubHeading>Days 60–90</SubHeading>
          <BulletList items={audit.growthPlan.ninetyDays} />
        </AuditSection>

        {/* Action Checklist */}
        <AuditSection title="Priority Action Checklist" icon={CheckSquare} delay={0.5}>
          <div className="space-y-3">
            {audit.actionChecklist.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                <div className="mt-0.5 h-5 w-5 rounded border-2 border-primary/30 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </AuditSection>

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="rounded-xl border bg-muted/50 p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Disclaimer</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-lg mx-auto">
            This audit is based on publicly available data only. No private analytics, hidden data, or internal metrics were accessed.
            Results are AI-generated recommendations and should be reviewed before implementation.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuditReport;
