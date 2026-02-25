import type { AuditFormData } from "@/components/AuditForm";

export interface AuditResult {
  businessName: string;
  websiteUrl: string;
  overallScore: number;
  brandConsistency: {
    score: number;
    notes: string[];
    suggestions: string[];
  };
  websiteAudit: {
    score: number;
    findings: string[];
    suggestions: string[];
    ctaRewrites: string[];
  };
  socialMedia: {
    platform: string;
    score: number;
    bioRewrite: string;
    contentImprovements: string[];
    hookExamples: string[];
    engagementSuggestions: string[];
  }[];
  googleBusiness?: {
    score: number;
    reviewCount: number;
    starRating: number;
    suggestions: string[];
    descriptionRewrite: string;
    visibilityPlan: string[];
  };
  youtube?: {
    score: number;
    titleExamples: string[];
    thumbnailAdvice: string[];
    shortsStrategy: string[];
  };
  contentFunnel: {
    awareness: boolean;
    authority: boolean;
    conversion: boolean;
    suggestions: string[];
  };
  growthPlan: {
    thirtyDays: string[];
    sixtyDays: string[];
    ninetyDays: string[];
  };
  actionChecklist: string[];
}

export function generateMockAudit(formData: AuditFormData): AuditResult {
  const name = formData.businessName;
  const socialMedia: AuditResult["socialMedia"] = [];

  if (formData.instagram) {
    socialMedia.push({
      platform: "Instagram",
      score: 62,
      bioRewrite: `${name} | Helping businesses grow online 🚀 | Free audit below ⬇️ | DM us for collabs`,
      contentImprovements: [
        "Add Reels with trending audio to increase reach by 40%",
        "Use carousel posts for educational content — they get 3x more saves",
        "Create a branded hashtag and use it consistently across posts",
      ],
      hookExamples: [
        `"Most ${name.toLowerCase()} clients don't realize this one mistake…"`,
        `"Here's what we changed to get 3x more leads this month"`,
        `"Stop doing this on your website (it's costing you customers)"`,
      ],
      engagementSuggestions: [
        "Respond to every comment within 1 hour to boost algorithm visibility",
        "Add polls and questions to Stories daily to increase interaction rate",
        "Collaborate with 2-3 micro-influencers in your niche monthly",
      ],
    });
  }

  if (formData.tiktok) {
    socialMedia.push({
      platform: "TikTok",
      score: 48,
      bioRewrite: `${name} 🔥 Digital tips you won't find anywhere else | Link below for free audit`,
      contentImprovements: [
        "Post 3-5x per week minimum — TikTok rewards consistency heavily",
        "Focus on the first 2 seconds: use text overlays and zoom-ins",
        "Repurpose Instagram Reels with TikTok-native captions and sounds",
      ],
      hookExamples: [
        `"I audited a random business and here's what I found…"`,
        `"This is why your social media isn't growing"`,
        `"3 things every business gets wrong about their website"`,
      ],
      engagementSuggestions: [
        "Jump on trending sounds within 24 hours of them trending",
        "Use reply-to-comment videos to re-engage your audience",
        "Pin your top 3 performing videos to your profile",
      ],
    });
  }

  return {
    businessName: name,
    websiteUrl: formData.websiteUrl,
    overallScore: 64,
    brandConsistency: {
      score: 72,
      notes: [
        "Business name matches across website and social profiles",
        "Profile images differ between Instagram and website — inconsistent branding",
        "Contact email is missing from social media bios",
        "Location listed on website but not on social profiles",
      ],
      suggestions: [
        "Use the same high-quality logo/headshot across all platforms",
        "Add consistent contact info (email + location) to all bios",
        "Align your tagline/description across website and social media",
      ],
    },
    websiteAudit: {
      score: 58,
      findings: [
        "Headline is vague — does not clearly state the value proposition",
        "No clear CTA above the fold — visitors may bounce",
        "Missing testimonials or social proof elements",
        "H1 tag present but H2 structure is inconsistent",
        "Contact page exists but no phone number is visible",
        "Mobile layout has minor spacing issues on smaller screens",
      ],
      suggestions: [
        "Rewrite headline to focus on the client's outcome, not your services",
        "Add a prominent CTA button above the fold with action-oriented text",
        "Include at least 3 client testimonials with names and photos",
        "Improve H2 usage for better SEO structure",
        "Add a click-to-call phone number for mobile visitors",
      ],
      ctaRewrites: [
        `"Get Your Free ${name} Growth Plan Today" → Direct, outcome-focused`,
        `"See How We've Helped 200+ Businesses Grow" → Social proof-driven`,
        `"Book a Free 15-Min Strategy Call" → Low-commitment, high-value`,
      ],
    },
    socialMedia,
    googleBusiness: formData.googleBusinessUrl
      ? {
          score: 55,
          reviewCount: 23,
          starRating: 4.2,
          suggestions: [
            "Increase review count to 50+ for stronger local SEO signal",
            "Respond to all reviews (positive and negative) within 24 hours",
            "Add at least 20 high-quality photos of your work/team/location",
            "Update business description with relevant local keywords",
          ],
          descriptionRewrite: `${name} is a leading digital services provider in [City]. We help local businesses grow their online presence through expert web design, social media management, and SEO. Contact us today for a free consultation.`,
          visibilityPlan: [
            "Week 1-2: Ask 10 recent clients for Google reviews via personalized email",
            "Week 2-3: Add 15+ photos including team, workspace, and project results",
            "Week 3-4: Optimize description with 5 local keywords",
            "Ongoing: Post Google Business updates weekly with offers and tips",
          ],
        }
      : undefined,
    youtube: formData.youtubeUrl
      ? {
          score: 45,
          titleExamples: [
            `"How ${name} Helped a Local Business Get 10x More Leads"`,
            `"5 Website Mistakes Killing Your Conversions (Fix These Today)"`,
            `"The #1 Social Media Strategy for Small Businesses in 2025"`,
            `"Before & After: Complete Digital Makeover for [Client]"`,
            `"I Audited a Random Business — Here's My Honest Review"`,
          ],
          thumbnailAdvice: [
            "Use bold text overlays with no more than 5 words",
            "Include a face with an expressive emotion for higher CTR",
            "Use contrasting colors (yellow/blue or red/white work best)",
            "Maintain a consistent thumbnail template for brand recognition",
          ],
          shortsStrategy: [
            "Repurpose every long-form video into 3-5 Shorts clips",
            "Focus on one tip per Short — keep it under 30 seconds",
            "Use text-on-screen and captions for silent viewers (85% watch muted)",
            "Post Shorts daily for the first 30 days to build momentum",
          ],
        }
      : undefined,
    contentFunnel: {
      awareness: true,
      authority: false,
      conversion: false,
      suggestions: [
        "AWARENESS ✅ — You have content that attracts attention. Keep creating top-of-funnel posts.",
        "AUTHORITY ❌ — Add case studies, detailed tutorials, and industry insights to build trust",
        "CONVERSION ❌ — Create comparison content, testimonials, and clear CTAs that drive action",
        "Recommended: Launch a simple lead magnet (free guide, checklist, or audit) to capture emails",
      ],
    },
    growthPlan: {
      thirtyDays: [
        "Fix website headline and add a clear CTA above the fold",
        "Unify brand visuals across all platforms (logo, colors, bio)",
        "Request 10 Google reviews from recent clients",
        "Post 3x/week on primary social platform with hook-first content",
      ],
      sixtyDays: [
        "Publish 2 case studies or client success stories",
        "Launch a lead magnet (free guide or mini-audit) on website",
        "Start a YouTube Shorts or TikTok series (daily for 30 days)",
        "Optimize all social bios with clear CTAs and links",
      ],
      ninetyDays: [
        "Build an email nurture sequence for leads from the lead magnet",
        "Collaborate with 3-5 complementary businesses for cross-promotion",
        "Achieve 50+ Google reviews with active response strategy",
        "Develop a content calendar for the next quarter with funnel-aligned topics",
      ],
    },
    actionChecklist: [
      "Rewrite website headline to focus on client outcomes",
      "Add CTA button above the fold on homepage",
      "Unify profile image and bio across all platforms",
      "Add 3+ testimonials to website",
      "Request 10 Google reviews this week",
      "Create a branded content template for social posts",
      "Write and publish 1 case study",
      "Set up a lead magnet landing page",
      "Optimize YouTube thumbnails with consistent template",
      "Plan 30 days of social media content in advance",
    ],
  };
}
