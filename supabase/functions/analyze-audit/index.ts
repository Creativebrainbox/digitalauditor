const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessName, websiteContent, websiteUrl, instagram, tiktok, youtubeUrl, googleBusinessUrl } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const platformsList = [];
    if (instagram) platformsList.push(`Instagram: @${instagram}`);
    if (tiktok) platformsList.push(`TikTok: @${tiktok}`);
    if (youtubeUrl) platformsList.push(`YouTube: ${youtubeUrl}`);
    if (googleBusinessUrl) platformsList.push(`Google Business: ${googleBusinessUrl}`);

    const systemPrompt = `You are a professional digital marketing auditor. You analyze publicly available information about businesses and provide actionable insights.

IMPORTANT RULES:
- Only analyze public information provided to you
- Never claim access to private analytics
- Be specific and actionable in your recommendations
- Provide realistic scores based on the content quality

You MUST respond with a valid JSON object matching this exact structure (no markdown, no code blocks, just raw JSON):
{
  "overallScore": <number 0-100>,
  "brandConsistency": {
    "score": <number 0-100>,
    "notes": [<string array of 3-5 findings>],
    "suggestions": [<string array of 3-4 improvement suggestions>]
  },
  "websiteAudit": {
    "score": <number 0-100>,
    "findings": [<string array of 4-6 findings about headline, CTA, mobile, trust, SEO, contact>],
    "suggestions": [<string array of 4-5 improvement suggestions>],
    "ctaRewrites": [<string array of 3 CTA rewrite examples>]
  },
  "socialMedia": [
    ${instagram ? `{
      "platform": "Instagram",
      "score": <number 0-100>,
      "bioRewrite": "<suggested bio rewrite>",
      "contentImprovements": [<3 strings>],
      "hookExamples": [<3 hook examples tailored to their niche>],
      "engagementSuggestions": [<3 strings>]
    }` : ''}
    ${tiktok ? `${instagram ? ',' : ''}{
      "platform": "TikTok",
      "score": <number 0-100>,
      "bioRewrite": "<suggested bio rewrite>",
      "contentImprovements": [<3 strings>],
      "hookExamples": [<3 hook examples>],
      "engagementSuggestions": [<3 strings>]
    }` : ''}
  ],
  ${googleBusinessUrl ? `"googleBusiness": {
    "score": <number 0-100>,
    "reviewCount": <estimated number>,
    "starRating": <number like 4.2>,
    "suggestions": [<4 strings>],
    "descriptionRewrite": "<optimized description>",
    "visibilityPlan": [<4 week-by-week steps>]
  },` : ''}
  ${youtubeUrl ? `"youtube": {
    "score": <number 0-100>,
    "titleExamples": [<5 improved title examples>],
    "thumbnailAdvice": [<4 strings>],
    "shortsStrategy": [<4 strings>]
  },` : ''}
  "contentFunnel": {
    "awareness": <boolean>,
    "authority": <boolean>,
    "conversion": <boolean>,
    "suggestions": [<4 strings explaining what's present/missing>]
  },
  "growthPlan": {
    "thirtyDays": [<4 action items>],
    "sixtyDays": [<4 action items>],
    "ninetyDays": [<4 action items>]
  },
  "actionChecklist": [<10 priority action items>]
}`;

    const userPrompt = `Audit the digital presence of "${businessName}" (${websiteUrl}).

WEBSITE CONTENT (scraped from their public website):
${websiteContent ? websiteContent.substring(0, 8000) : 'Could not be scraped. Analyze based on URL alone.'}

SOCIAL MEDIA PROFILES:
${platformsList.length > 0 ? platformsList.join('\n') : 'No social media profiles provided.'}

Provide a thorough, honest, and actionable audit. Score generously but realistically. Tailor all suggestions specifically to "${businessName}" and their apparent niche/industry.`;

    console.log('Calling AI for audit analysis...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response - strip any markdown formatting if present
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    const auditResult = JSON.parse(cleanedContent);

    return new Response(
      JSON.stringify({ success: true, audit: auditResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Audit error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Audit analysis failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
