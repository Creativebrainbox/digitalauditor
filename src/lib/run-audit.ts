import { supabase } from "@/integrations/supabase/client";
import type { AuditFormData } from "@/components/AuditForm";
import type { AuditResult } from "@/lib/generate-mock-audit";

export async function runAudit(formData: AuditFormData): Promise<AuditResult> {
  // Step 1: Scrape the website
  let websiteContent = "";
  try {
    const { data: scrapeData, error: scrapeError } = await supabase.functions.invoke("scrape-website", {
      body: { url: formData.websiteUrl },
    });

    if (scrapeError) {
      console.warn("Scrape warning:", scrapeError);
    } else {
      websiteContent = scrapeData?.data?.markdown || scrapeData?.markdown || "";
    }
  } catch (err) {
    console.warn("Could not scrape website, proceeding with URL-only analysis:", err);
  }

  // Step 2: Send to AI for analysis
  const { data, error } = await supabase.functions.invoke("analyze-audit", {
    body: {
      businessName: formData.businessName,
      websiteUrl: formData.websiteUrl,
      websiteContent,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      youtubeUrl: formData.youtubeUrl,
      googleBusinessUrl: formData.googleBusinessUrl,
    },
  });

  if (error) {
    throw new Error(error.message || "Audit analysis failed");
  }

  if (!data?.success || !data?.audit) {
    throw new Error(data?.error || "Failed to generate audit");
  }

  const audit = data.audit;

  return {
    businessName: formData.businessName,
    websiteUrl: formData.websiteUrl,
    overallScore: audit.overallScore,
    brandConsistency: audit.brandConsistency,
    websiteAudit: audit.websiteAudit,
    socialMedia: audit.socialMedia || [],
    googleBusiness: audit.googleBusiness,
    youtube: audit.youtube,
    contentFunnel: audit.contentFunnel,
    growthPlan: audit.growthPlan,
    actionChecklist: audit.actionChecklist,
  };
}
