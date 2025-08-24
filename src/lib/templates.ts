export interface JSONField {
  id: string;
  keyName: string;
  value: any;
  dataType: "string" | "object";
  children?: JSONField[];
}

export interface JSONTemplate {
  id: string;
  name: string;
  description: string;
  fields: JSONField[];
}

export const starterTemplates: JSONTemplate[] = [
  {
    id: "comprehensive-prompt",
    name: "Comprehensive Prompt",
    description: "Full-featured template following best prompting practices",
    fields: [
      {
        id: "role",
        keyName: "role",
        value:
          "You are an expert assistant specializing in [domain]. You provide accurate, helpful, and well-structured responses.",
        dataType: "string",
      },
      {
        id: "task",
        keyName: "task",
        value:
          "Analyze the provided content and generate a comprehensive response that addresses the user's needs.",
        dataType: "string",
      },
      {
        id: "context",
        keyName: "context",
        value:
          "The user is looking for [specific context about the situation or domain].",
        dataType: "string",
      },
      {
        id: "input",
        keyName: "input",
        value:
          "[Insert the actual content, data, or information to be processed]",
        dataType: "string",
      },
      {
        id: "output_format",
        keyName: "output_format",
        value:
          "Provide your response in a clear, structured format with headings, bullet points, and actionable insights.",
        dataType: "string",
      },
      {
        id: "requirements",
        keyName: "requirements",
        value: "",
        dataType: "object",
        children: [
          {
            id: "tone",
            keyName: "tone",
            value: "Professional and conversational",
            dataType: "string",
          },
          {
            id: "length",
            keyName: "length",
            value: "Comprehensive but concise (200-500 words)",
            dataType: "string",
          },
          {
            id: "focus",
            keyName: "focus",
            value: "Prioritize actionable insights and practical solutions",
            dataType: "string",
          },
        ],
      },
      {
        id: "constraints",
        keyName: "constraints",
        value:
          "Base responses on provided information. If information is insufficient, clearly state limitations and ask clarifying questions.",
        dataType: "string",
      },
    ],
  },
  {
    id: "minimal-prompt",
    name: "Minimal Prompt",
    description: "Essential fields for effective prompting",
    fields: [
      {
        id: "role",
        keyName: "role",
        value:
          "You are a helpful assistant that provides clear and accurate responses.",
        dataType: "string",
      },
      {
        id: "task",
        keyName: "task",
        value: "Complete the following request based on the provided input.",
        dataType: "string",
      },
      {
        id: "input",
        keyName: "input",
        value: "[Your content or question here]",
        dataType: "string",
      },
      {
        id: "output_format",
        keyName: "output_format",
        value: "Provide a clear, well-structured response.",
        dataType: "string",
      },
    ],
  },
  {
    id: "cinematic-video-prompt",
    name: "Cinematic Video Prompt",
    description:
      "Template for AI video generation with detailed cinematic specifications",
    fields: [
      {
        id: "description",
        keyName: "description",
        value:
          "Detailed description of the main scene, camera movements, and visual narrative from start to finish",
        dataType: "string",
      },
      {
        id: "style",
        keyName: "style",
        value:
          "Visual style and aesthetic approach (e.g., cinematic, documentary, commercial, artistic)",
        dataType: "string",
      },
      {
        id: "camera",
        keyName: "camera",
        value: "Camera type, movement, angles, and shooting techniques",
        dataType: "string",
      },
      {
        id: "lighting",
        keyName: "lighting",
        value: "Lighting conditions, time of day, and atmospheric effects",
        dataType: "string",
      },
      {
        id: "environment",
        keyName: "environment",
        value: "Setting, location, and environmental details",
        dataType: "string",
      },
      {
        id: "elements",
        keyName: "elements",
        value:
          "Key visual elements, objects, and subjects in the scene (comma-separated)",
        dataType: "string",
      },
      {
        id: "motion",
        keyName: "motion",
        value: "Movement patterns, speed changes, and dynamic elements",
        dataType: "string",
      },
      {
        id: "ending",
        keyName: "ending",
        value: "How the shot concludes, final focus, and resolution",
        dataType: "string",
      },
      {
        id: "text",
        keyName: "text",
        value: 'Text overlays, titles, or "none" if no text required',
        dataType: "string",
      },
      {
        id: "keywords",
        keyName: "keywords",
        value: "Technical specs, aspect ratio, and key tags (comma-separated)",
        dataType: "string",
      },
    ],
  },
  {
    id: "veo3-video-generation",
    name: "VEO3 Video Generation",
    description:
      "Professional template for Google VEO3 AI video generation with structured parameters",
    fields: [
      {
        id: "shot",
        keyName: "shot",
        value: "",
        dataType: "object",
        children: [
          {
            id: "composition",
            keyName: "composition",
            value:
              "Camera angle and framing (e.g., wide shot, close-up, tracking shot, aerial view)",
            dataType: "string",
          },
          {
            id: "lens",
            keyName: "lens",
            value:
              "Lens type and characteristics (e.g., telephoto, wide-angle, macro, shallow/deep depth of field)",
            dataType: "string",
          },
          {
            id: "frame_rate",
            keyName: "frame_rate",
            value: "24fps",
            dataType: "string",
          },
          {
            id: "camera_movement",
            keyName: "camera_movement",
            value:
              "Camera motion and dynamics (e.g., static, dolly, pan, tilt, handheld, gimbal)",
            dataType: "string",
          },
        ],
      },
      {
        id: "subject",
        keyName: "subject",
        value: "",
        dataType: "object",
        children: [
          {
            id: "description",
            keyName: "description",
            value:
              "Main subject or character description, including physical attributes and actions",
            dataType: "string",
          },
          {
            id: "wardrobe",
            keyName: "wardrobe",
            value:
              'Clothing, costume, or appearance details (use "N/A" if not applicable)',
            dataType: "string",
          },
          {
            id: "props",
            keyName: "props",
            value: "Objects, tools, or accessories relevant to the scene",
            dataType: "string",
          },
        ],
      },
      {
        id: "scene",
        keyName: "scene",
        value: "",
        dataType: "object",
        children: [
          {
            id: "location",
            keyName: "location",
            value:
              "Physical setting and environment (indoor/outdoor, specific location type)",
            dataType: "string",
          },
          {
            id: "time_of_day",
            keyName: "time_of_day",
            value:
              "Time period and lighting conditions (dawn, morning, afternoon, twilight, night)",
            dataType: "string",
          },
          {
            id: "environment",
            keyName: "environment",
            value:
              "Environmental details, weather, atmosphere, and ambient conditions",
            dataType: "string",
          },
        ],
      },
      {
        id: "visual_details",
        keyName: "visual_details",
        value: "",
        dataType: "object",
        children: [
          {
            id: "action",
            keyName: "action",
            value: "Primary action and movement happening in the scene",
            dataType: "string",
          },
          {
            id: "special_effects",
            keyName: "special_effects",
            value:
              "Visual effects, particles, smoke, explosions, or other dynamic elements",
            dataType: "string",
          },
          {
            id: "hair_clothing_motion",
            keyName: "hair_clothing_motion",
            value:
              'Movement of hair, fabric, or clothing (use "N/A" if not applicable)',
            dataType: "string",
          },
        ],
      },
      {
        id: "cinematography",
        keyName: "cinematography",
        value: "",
        dataType: "object",
        children: [
          {
            id: "lighting",
            keyName: "lighting",
            value:
              "Lighting setup, direction, and quality (natural, artificial, dramatic, soft)",
            dataType: "string",
          },
          {
            id: "color_palette",
            keyName: "color_palette",
            value:
              "Color scheme and grading (warm, cool, muted, vibrant, specific colors)",
            dataType: "string",
          },
          {
            id: "tone",
            keyName: "tone",
            value:
              "Emotional and aesthetic mood (dramatic, peaceful, intense, mysterious, uplifting)",
            dataType: "string",
          },
        ],
      },
      {
        id: "audio",
        keyName: "audio",
        value: "",
        dataType: "object",
        children: [
          {
            id: "music",
            keyName: "music",
            value:
              "Background music style and mood (cinematic score, ambient, electronic, orchestral)",
            dataType: "string",
          },
          {
            id: "ambient",
            keyName: "ambient",
            value:
              "Environmental and background sounds (wind, water, traffic, nature)",
            dataType: "string",
          },
          {
            id: "sound_effects",
            keyName: "sound_effects",
            value:
              "Specific sound effects and foley (footsteps, mechanical sounds, impacts)",
            dataType: "string",
          },
          {
            id: "mix_level",
            keyName: "mix_level",
            value:
              "Audio mixing style and emphasis (film standard, dialogue-heavy, action-focused)",
            dataType: "string",
          },
        ],
      },
      {
        id: "dialogue",
        keyName: "dialogue",
        value: "",
        dataType: "object",
        children: [
          {
            id: "character",
            keyName: "character",
            value:
              "Speaking character identification (leave empty if no dialogue)",
            dataType: "string",
          },
          {
            id: "line",
            keyName: "line",
            value:
              "Spoken dialogue or voice-over text (leave empty if no dialogue)",
            dataType: "string",
          },
          {
            id: "subtitles",
            keyName: "subtitles",
            value: "false",
            dataType: "string",
          },
        ],
      },
    ],
  },
  {
    id: "analysis-prompt",
    name: "Analysis & Research",
    description: "Template for analytical and research tasks",
    fields: [
      {
        id: "role",
        keyName: "role",
        value:
          "You are a skilled analyst with expertise in research and critical thinking.",
        dataType: "string",
      },
      {
        id: "task",
        keyName: "task",
        value:
          "Analyze the provided information and deliver comprehensive insights.",
        dataType: "string",
      },
      {
        id: "data",
        keyName: "data",
        value: "[Insert data, documents, or information to analyze]",
        dataType: "string",
      },
      {
        id: "analysis_focus",
        keyName: "analysis_focus",
        value:
          "[Specify what aspects to focus on: trends, patterns, implications, etc.]",
        dataType: "string",
      },
      {
        id: "output_structure",
        keyName: "output_structure",
        value:
          "Structure your analysis with: 1) Key findings, 2) Supporting evidence, 3) Implications, 4) Recommendations",
        dataType: "string",
      },
    ],
  },
  {
    id: "creative-writing",
    name: "Creative Writing",
    description: "Template for creative content generation",
    fields: [
      {
        id: "role",
        keyName: "role",
        value:
          "You are a creative writer with excellent storytelling abilities and strong command of language.",
        dataType: "string",
      },
      {
        id: "task",
        keyName: "task",
        value: "Create engaging, original content based on the provided brief.",
        dataType: "string",
      },
      {
        id: "brief",
        keyName: "brief",
        value:
          "[Describe the content type, theme, audience, and key requirements]",
        dataType: "string",
      },
      {
        id: "style_guidelines",
        keyName: "style_guidelines",
        value: "",
        dataType: "object",
        children: [
          {
            id: "tone",
            keyName: "tone",
            value: "[e.g., conversational, formal, humorous, inspiring]",
            dataType: "string",
          },
          {
            id: "voice",
            keyName: "voice",
            value:
              "[e.g., first person, third person, authoritative, personal]",
            dataType: "string",
          },
          {
            id: "target_length",
            keyName: "target_length",
            value: "[Specify word count or approximate length]",
            dataType: "string",
          },
        ],
      },
    ],
  },
  {
    id: "code-generation",
    name: "Code Generation",
    description: "Template for programming and code-related tasks",
    fields: [
      {
        id: "role",
        keyName: "role",
        value:
          "You are an experienced software developer proficient in multiple programming languages and best practices.",
        dataType: "string",
      },
      {
        id: "task",
        keyName: "task",
        value:
          "Generate clean, efficient, and well-documented code based on the requirements.",
        dataType: "string",
      },
      {
        id: "requirements",
        keyName: "requirements",
        value:
          "[Describe the functionality, inputs, outputs, and any specific requirements]",
        dataType: "string",
      },
      {
        id: "technical_specs",
        keyName: "technical_specs",
        value: "",
        dataType: "object",
        children: [
          {
            id: "language",
            keyName: "language",
            value: "[Specify programming language: Python, JavaScript, etc.]",
            dataType: "string",
          },
          {
            id: "framework",
            keyName: "framework",
            value: "[If applicable: React, Django, Express, etc.]",
            dataType: "string",
          },
          {
            id: "style_guide",
            keyName: "style_guide",
            value:
              "Follow best practices with clear variable names, comments, and error handling",
            dataType: "string",
          },
        ],
      },
    ],
  },
  {
    id: "summarization",
    name: "Summarization",
    description: "Template for content summarization tasks",
    fields: [
      {
        id: "role",
        keyName: "role",
        value:
          "You are a skilled editor who excels at distilling complex information into clear, concise summaries.",
        dataType: "string",
      },
      {
        id: "task",
        keyName: "task",
        value:
          "Summarize the provided content while preserving key information and main insights.",
        dataType: "string",
      },
      {
        id: "content",
        keyName: "content",
        value: "[Insert the text, article, or document to summarize]",
        dataType: "string",
      },
      {
        id: "summary_type",
        keyName: "summary_type",
        value:
          "Create a [executive summary/bullet points/paragraph format] that captures the essential points",
        dataType: "string",
      },
      {
        id: "target_audience",
        keyName: "target_audience",
        value:
          "[Specify who will read this summary and their level of expertise]",
        dataType: "string",
      },
    ],
  },
  {
    id: "qa-prompt",
    name: "Question & Answer",
    description: "Template for Q&A and knowledge retrieval tasks",
    fields: [
      {
        id: "role",
        keyName: "role",
        value:
          "You are a knowledgeable expert who provides accurate, helpful answers with clear explanations.",
        dataType: "string",
      },
      {
        id: "task",
        keyName: "task",
        value:
          "Answer the question thoroughly using the provided context and your knowledge.",
        dataType: "string",
      },
      {
        id: "question",
        keyName: "question",
        value: "[Insert the specific question to be answered]",
        dataType: "string",
      },
      {
        id: "context",
        keyName: "context",
        value:
          "[Provide any relevant background information, documents, or context]",
        dataType: "string",
      },
      {
        id: "answer_requirements",
        keyName: "answer_requirements",
        value:
          "Provide a clear, accurate answer with explanations. If uncertain, state your confidence level and suggest further resources.",
        dataType: "string",
      },
    ],
  },
  {
    id: "content-creation",
    name: "Content Creation",
    description: "Template for marketing and content creation",
    fields: [
      {
        id: "role",
        keyName: "role",
        value:
          "You are a content marketing specialist with expertise in creating engaging, audience-focused content.",
        dataType: "string",
      },
      {
        id: "task",
        keyName: "task",
        value:
          "Create compelling content that resonates with the target audience and achieves the specified goals.",
        dataType: "string",
      },
      {
        id: "content_brief",
        keyName: "content_brief",
        value:
          "[Describe the content type: blog post, social media, email, etc.]",
        dataType: "string",
      },
      {
        id: "target_audience",
        keyName: "target_audience",
        value: "[Define demographics, interests, pain points, and motivations]",
        dataType: "string",
      },
      {
        id: "objectives",
        keyName: "objectives",
        value: "",
        dataType: "object",
        children: [
          {
            id: "primary_goal",
            keyName: "primary_goal",
            value: "[e.g., increase engagement, drive traffic, generate leads]",
            dataType: "string",
          },
          {
            id: "key_message",
            keyName: "key_message",
            value: "[Main message or value proposition to communicate]",
            dataType: "string",
          },
          {
            id: "call_to_action",
            keyName: "call_to_action",
            value: "[Desired action from the audience]",
            dataType: "string",
          },
        ],
      },
    ],
  },
];
