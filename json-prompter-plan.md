### **Product Plan: JSON Prompter Chrome Extension**

#### **1. Product Vision & Goal**

To empower AI users to create structured, accurate, and repeatable prompts effortlessly. Our goal is to build a Chrome extension that provides a simple, intuitive interface for generating, managing, and deploying JSON prompts, making it the go-to tool for anyone looking to get predictable, machine-readable outputs from LLMs.

#### **2. Target Audience**

- **Primary:** Software Developers, AI/ML Engineers, and Prompt Engineers who need structured data from LLMs for their applications.
- **Secondary:** Content Creators, Marketers, and Researchers who need to generate consistent outputs (e.g., blog post structures, ad copy variations, structured data extraction).
- **Tertiary:** Hobbyists and Students learning about AI and prompt engineering.

#### **3. The Core Problem**

Writing JSON by hand is tedious, error-prone, and unintuitive for many users. Remembering the correct syntax (curly braces, commas, quotes) is a distraction from the actual task: defining the prompt's logic. There is no easy way to build, visualize, save, and reuse these structured prompts directly within the browser where most users interact with LLMs.

#### **4. Key Features (Phased Rollout)**

##### **Phase 1: Minimum Viable Product (MVP) - "The Builder"**

The focus of the MVP is to solve the core problem with a simple and elegant tool.

- **Intuitive Form-Based UI:**
  - A clean interface where users can add fields with a single click.
  - Each field will have three parts:
    1.  **Key:** The JSON key (e.g., `"tone"`).
    2.  **Value/Instruction:** The JSON value, which is a natural language instruction for the AI (e.g., `"professional and witty"`).
    3.  **Data Type:** A dropdown to select the desired output type (`String`, `Number`, `Boolean`, `Array`, `Object`).
- **Nested Structures:**
  - The ability to create nested objects and arrays of objects. The UI will visually indent these structures to make the hierarchy clear and easy to understand.
- **Real-time JSON Preview:**
  - A side-by-side panel that instantly displays the generated raw JSON as the user builds the form. This provides immediate feedback and helps users learn the syntax.
- **One-Click Copy:**
  - A prominent "Copy JSON" button that copies the clean, minified JSON to the clipboard, ready to be pasted into any LLM interface.
- **Starter Templates:**
  - Include 3-5 pre-built templates for common use cases (e.g., "Summarize Article," "Generate Product Description," "Create a Social Media Post") to demonstrate value immediately.

##### **Phase 2: "The Power User"**

Building on the MVP, this phase introduces features for efficiency and workflow integration.

- **Save & Load Custom Templates:**
  - Users can save their own JSON prompt structures as named templates.
  - A personal library to manage, edit, and delete saved templates.
- **Direct Page Injection:**
  - With user permission, the ability to inject the generated JSON prompt directly into the active text area on popular AI websites (e.g., ChatGPT, Claude, Google AI Studio).
- **Import from JSON:**
  - Allow users to paste an existing raw JSON object, and the extension will automatically parse it into the visual form builder for easy editing.

##### **Phase 3: "The AI Assistant"**

This phase introduces AI-powered features to make the tool truly intelligent.

- **Natural Language to JSON Schema:**
  - A feature where the user can describe the desired output in plain English (e.g., "a list of three sci-fi movie ideas, each with a title, a logline, and a target audience").
  - The extension will use an LLM to generate the initial JSON prompt structure, which the user can then refine in the builder.
- **Advanced Data Constraints:**
  - For `Number` types, add options for `min`/`max` values.
  - For `String` types, add an option for `maxLength` or even regex pattern matching to further guide the LLM's output.

#### **5. UI/UX Design Principles**

- **Simplicity & Clarity:** The interface must be clean and uncluttered. The primary focus should always be on the task of building the prompt.
- **Immediate Feedback:** The user should see the result of their actions instantly (via the real-time preview).
- **Minimal Clicks:** The most common actions (adding a field, copying the output) should be achievable in a single click.
- **Guidance, Not Obstruction:** The tool should guide the user toward creating valid JSON but be flexible enough to allow for complex, custom structures.

<a href="https://www.flaticon.com/free-icons/chatbot" title="chatbot icons">Chatbot icons created by HideMaru - Flaticon</a>
