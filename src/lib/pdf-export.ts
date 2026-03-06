import jsPDF from "jspdf";
import { type AuditResult } from "@/lib/generate-mock-audit";

const COLORS = {
  primary: [37, 99, 235] as [number, number, number],
  dark: [30, 41, 59] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  lightBg: [241, 245, 249] as [number, number, number],
  green: [22, 163, 74] as [number, number, number],
  orange: [234, 88, 12] as [number, number, number],
  red: [220, 38, 38] as [number, number, number],
};

function getScoreColor(score: number): [number, number, number] {
  if (score >= 75) return COLORS.green;
  if (score >= 50) return COLORS.orange;
  return COLORS.red;
}

function getScoreLabel(score: number): string {
  if (score >= 75) return "Excellent";
  if (score >= 50) return "Good";
  if (score >= 25) return "Needs Work";
  return "Critical";
}

class PdfBuilder {
  private pdf: jsPDF;
  private y = 20;
  private pageWidth: number;
  private margin = 15;
  private contentWidth: number;

  constructor() {
    this.pdf = new jsPDF("p", "mm", "a4");
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.contentWidth = this.pageWidth - this.margin * 2;
  }

  private checkPage(needed: number) {
    const pageHeight = this.pdf.internal.pageSize.getHeight();
    if (this.y + needed > pageHeight - 15) {
      this.pdf.addPage();
      this.y = 15;
    }
  }

  private setFont(style: "bold" | "normal", size: number, color: [number, number, number] = COLORS.dark) {
    this.pdf.setFontSize(size);
    this.pdf.setFont("helvetica", style);
    this.pdf.setTextColor(...color);
  }

  private writeWrapped(text: string, fontSize: number, style: "bold" | "normal" = "normal", color: [number, number, number] = COLORS.dark, indent = 0) {
    this.setFont(style, fontSize, color);
    const lines = this.pdf.splitTextToSize(text, this.contentWidth - indent);
    const lineHeight = fontSize * 0.45;
    this.checkPage(lines.length * lineHeight + 2);
    this.pdf.text(lines, this.margin + indent, this.y);
    this.y += lines.length * lineHeight + 1;
  }

  drawHeader(businessName: string, overallScore: number) {
    // Header bar
    this.pdf.setFillColor(...COLORS.primary);
    this.pdf.rect(0, 0, this.pageWidth, 40, "F");
    
    this.setFont("bold", 20, COLORS.white);
    this.pdf.text("Digital Presence Audit", this.margin, 18);
    this.setFont("normal", 11, COLORS.white);
    this.pdf.text(businessName, this.margin, 26);
    this.setFont("normal", 9, COLORS.white);
    this.pdf.text(`Generated: ${new Date().toLocaleDateString()}`, this.margin, 33);

    // Overall score circle area
    const scoreX = this.pageWidth - 35;
    this.pdf.setFillColor(...COLORS.white);
    this.pdf.circle(scoreX, 20, 13, "F");
    const scoreColor = getScoreColor(overallScore);
    this.setFont("bold", 18, scoreColor);
    this.pdf.text(String(overallScore), scoreX, 22, { align: "center" });
    this.setFont("normal", 6, COLORS.muted);
    this.pdf.text(getScoreLabel(overallScore), scoreX, 28, { align: "center" });

    this.y = 48;
  }

  drawSectionHeader(title: string, score?: number) {
    this.checkPage(14);
    this.pdf.setFillColor(...COLORS.lightBg);
    this.pdf.roundedRect(this.margin, this.y - 4, this.contentWidth, 10, 2, 2, "F");
    
    this.setFont("bold", 11, COLORS.primary);
    this.pdf.text(title, this.margin + 3, this.y + 2);

    if (score !== undefined) {
      const scoreColor = getScoreColor(score);
      this.setFont("bold", 11, scoreColor);
      this.pdf.text(`${score}/100`, this.pageWidth - this.margin - 3, this.y + 2, { align: "right" });
    }
    this.y += 10;
  }

  drawSubHeading(text: string) {
    this.checkPage(8);
    this.setFont("bold", 9, COLORS.muted);
    this.pdf.text(text.toUpperCase(), this.margin + 2, this.y);
    this.y += 5;
  }

  drawBulletList(items: string[]) {
    for (const item of items) {
      this.checkPage(8);
      this.pdf.setFillColor(...COLORS.primary);
      this.pdf.circle(this.margin + 4, this.y - 1, 1, "F");
      this.writeWrapped(item, 9, "normal", COLORS.dark, 7);
      this.y += 1;
    }
    this.y += 1;
  }

  drawQuote(text: string) {
    this.checkPage(12);
    this.pdf.setFillColor(...COLORS.lightBg);
    const lines = this.pdf.splitTextToSize(`"${text}"`, this.contentWidth - 10);
    const blockH = lines.length * 4.5 + 4;
    this.pdf.roundedRect(this.margin + 2, this.y - 3, this.contentWidth - 4, blockH, 1, 1, "F");
    this.setFont("normal", 8.5, COLORS.muted);
    this.pdf.text(lines, this.margin + 5, this.y + 1);
    this.y += blockH + 2;
  }

  drawFunnelStages(funnel: { awareness: boolean; authority: boolean; conversion: boolean }) {
    this.checkPage(10);
    const stages = [
      { label: "Awareness", active: funnel.awareness },
      { label: "Authority", active: funnel.authority },
      { label: "Conversion", active: funnel.conversion },
    ];
    let x = this.margin + 2;
    for (const stage of stages) {
      const color = stage.active ? COLORS.green : COLORS.red;
      this.pdf.setFillColor(...(stage.active ? [220, 252, 231] as [number, number, number] : [254, 226, 226] as [number, number, number]));
      this.pdf.roundedRect(x, this.y - 3, 35, 8, 1, 1, "F");
      this.setFont("normal", 8, color);
      this.pdf.text(`${stage.active ? "✓" : "✗"} ${stage.label}`, x + 3, this.y + 1);
      x += 38;
    }
    this.y += 10;
  }

  drawChecklist(items: string[]) {
    for (const item of items) {
      this.checkPage(8);
      this.pdf.setDrawColor(...COLORS.primary);
      this.pdf.rect(this.margin + 3, this.y - 3, 3.5, 3.5);
      this.writeWrapped(item, 9, "normal", COLORS.dark, 10);
      this.y += 1;
    }
  }

  addSpace(mm: number) {
    this.y += mm;
  }

  drawDisclaimer() {
    this.checkPage(15);
    this.pdf.setFillColor(...COLORS.lightBg);
    this.pdf.roundedRect(this.margin, this.y, this.contentWidth, 12, 2, 2, "F");
    this.setFont("normal", 7, COLORS.muted);
    this.pdf.text(
      "This audit is based on publicly available data only. No private analytics or internal metrics were accessed. Results are AI-generated recommendations.",
      this.pageWidth / 2,
      this.y + 6,
      { align: "center", maxWidth: this.contentWidth - 10 }
    );
  }

  save(filename: string) {
    this.pdf.save(filename);
  }
}

export async function exportReportAsPdf(_elementId: string, businessName: string, audit?: AuditResult) {
  if (!audit) return;

  const b = new PdfBuilder();
  b.drawHeader(audit.businessName || businessName, audit.overallScore);

  // Brand Consistency
  b.drawSectionHeader("Brand Consistency Check", audit.brandConsistency.score);
  b.drawSubHeading("Findings");
  b.drawBulletList(audit.brandConsistency.notes);
  b.drawSubHeading("Recommendations");
  b.drawBulletList(audit.brandConsistency.suggestions);
  b.addSpace(3);

  // Website Audit
  b.drawSectionHeader("Website Audit", audit.websiteAudit.score);
  b.drawSubHeading("Analysis");
  b.drawBulletList(audit.websiteAudit.findings);
  b.drawSubHeading("Improvement Suggestions");
  b.drawBulletList(audit.websiteAudit.suggestions);
  b.drawSubHeading("CTA Rewrite Examples");
  b.drawBulletList(audit.websiteAudit.ctaRewrites);
  b.addSpace(3);

  // Social Media
  for (const platform of audit.socialMedia) {
    b.drawSectionHeader(`${platform.platform} Audit`, platform.score);
    b.drawSubHeading("Bio Rewrite Suggestion");
    b.drawQuote(platform.bioRewrite);
    b.drawSubHeading("Content Format Improvements");
    b.drawBulletList(platform.contentImprovements);
    b.drawSubHeading("Hook Examples");
    b.drawBulletList(platform.hookExamples);
    b.drawSubHeading("Engagement Growth Suggestions");
    b.drawBulletList(platform.engagementSuggestions);
    b.addSpace(3);
  }

  // Google Business
  if (audit.googleBusiness) {
    b.drawSectionHeader("Google Business Profile", audit.googleBusiness.score);
    b.drawSubHeading("Suggestions");
    b.drawBulletList(audit.googleBusiness.suggestions);
    b.drawSubHeading("Optimized Description");
    b.drawQuote(audit.googleBusiness.descriptionRewrite);
    b.drawSubHeading("30-Day Local Visibility Plan");
    b.drawBulletList(audit.googleBusiness.visibilityPlan);
    b.addSpace(3);
  }

  // YouTube
  if (audit.youtube) {
    b.drawSectionHeader("YouTube Channel Audit", audit.youtube.score);
    b.drawSubHeading("Improved Title Examples");
    b.drawBulletList(audit.youtube.titleExamples);
    b.drawSubHeading("Thumbnail Improvement Advice");
    b.drawBulletList(audit.youtube.thumbnailAdvice);
    b.drawSubHeading("Shorts Repurposing Strategy");
    b.drawBulletList(audit.youtube.shortsStrategy);
    b.addSpace(3);
  }

  // Content Funnel
  b.drawSectionHeader("Content Funnel Analysis");
  b.drawFunnelStages(audit.contentFunnel);
  b.drawBulletList(audit.contentFunnel.suggestions);
  b.addSpace(3);

  // Growth Plan
  b.drawSectionHeader("30-60-90 Day Growth Plan");
  b.drawSubHeading("First 30 Days");
  b.drawBulletList(audit.growthPlan.thirtyDays);
  b.drawSubHeading("Days 30–60");
  b.drawBulletList(audit.growthPlan.sixtyDays);
  b.drawSubHeading("Days 60–90");
  b.drawBulletList(audit.growthPlan.ninetyDays);
  b.addSpace(3);

  // Action Checklist
  b.drawSectionHeader("Priority Action Checklist");
  b.drawChecklist(audit.actionChecklist);
  b.addSpace(5);

  // Disclaimer
  b.drawDisclaimer();

  b.save(`${(audit.businessName || businessName).replace(/\s+/g, "-")}-Digital-Audit-Report.pdf`);
}
