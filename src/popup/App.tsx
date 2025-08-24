import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Save,
  Edit,
  Trash2,
  X,
  Plus,
  FolderPlus,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Crown,
  Sparkles,
  Wand2,
} from "lucide-react";
import { starterTemplates } from "@/lib/templates";
import { JSONField as JSONFieldType } from "@/types";
import icon from "../../public/icon48.png";

// Simplified interface - only string or object types
interface SimpleJSONField extends JSONFieldType {
  dataType?: "string" | "object";
}

// Custom template interface
interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  fields: SimpleJSONField[];
  createdAt: string;
  updatedAt?: string;
}

// Storage keys for persistence
const STORAGE_KEYS = {
  FIELDS: "jsonPrompter_fields",
  TEMPLATE: "jsonPrompter_selectedTemplate",
  CUSTOM_TEMPLATES: "jsonPrompter_customTemplates",
} as const;

// Generate a more robust ID
const generateId = (): string => {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get default fields from minimal template
const getDefaultFields = (): SimpleJSONField[] => {
  const minimalTemplate = starterTemplates.find(
    (t) => t.id === "minimal-prompt"
  );
  if (minimalTemplate) {
    return minimalTemplate.fields.map((field) => ({
      id: generateId(),
      keyName: field.keyName,
      value: field.value,
      dataType: field.dataType as "string" | "object",
      children: field.children?.map((child) => ({
        id: generateId(),
        keyName: child.keyName,
        value: child.value,
        dataType: child.dataType as "string" | "object",
      })),
    }));
  }

  // Fallback if template not found
  return [
    {
      id: generateId(),
      keyName: "role",
      value:
        "You are a helpful assistant that provides clear and accurate responses.",
      dataType: "string",
    },
    {
      id: generateId(),
      keyName: "task",
      value: "Complete the following request based on the provided input.",
      dataType: "string",
    },
    {
      id: generateId(),
      keyName: "input",
      value: "[Your content or question here]",
      dataType: "string",
    },
    {
      id: generateId(),
      keyName: "output_format",
      value: "Provide a clear, well-structured response.",
      dataType: "string",
    },
  ];
};

// Simplified JSON generation
const generateJSON = (fields: SimpleJSONField[]): string => {
  const obj: any = {};

  fields.forEach((field) => {
    // Skip completely empty fields
    if (!field.keyName.trim()) return;

    // Handle fields with children (objects)
    if (field.children && field.children.length > 0) {
      obj[field.keyName] = JSON.parse(generateJSON(field.children));
    } else if (field.value.trim() !== "") {
      obj[field.keyName] = field.value;
    }
  });

  return JSON.stringify(obj, null, 2);
};

// Storage utilities for persistence
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to storage:", error);
  }
};

const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error("Failed to load from storage:", error);
    return defaultValue;
  }
};

// Custom template utilities
const saveCustomTemplate = (template: CustomTemplate) => {
  const existingTemplates = loadFromStorage(STORAGE_KEYS.CUSTOM_TEMPLATES, []);
  const updatedTemplates = [...existingTemplates, template];
  saveToStorage(STORAGE_KEYS.CUSTOM_TEMPLATES, updatedTemplates);
};

const updateCustomTemplate = (template: CustomTemplate) => {
  const existingTemplates = loadFromStorage(STORAGE_KEYS.CUSTOM_TEMPLATES, []);
  const updatedTemplates = existingTemplates.map((t: CustomTemplate) =>
    t.id === template.id ? template : t
  );
  saveToStorage(STORAGE_KEYS.CUSTOM_TEMPLATES, updatedTemplates);
};

const deleteCustomTemplate = (templateId: string) => {
  const existingTemplates = loadFromStorage(STORAGE_KEYS.CUSTOM_TEMPLATES, []);
  const updatedTemplates = existingTemplates.filter(
    (t: CustomTemplate) => t.id !== templateId
  );
  saveToStorage(STORAGE_KEYS.CUSTOM_TEMPLATES, updatedTemplates);
};

// Auto-expanding textarea component
const AutoExpandTextarea = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.max(60, textarea.scrollHeight) + "px";
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    adjustTextareaHeight();
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`${className} resize-none overflow-hidden`}
      style={{ minHeight: "60px" }}
    />
  );
};

// Custom hook for field operations
const useFieldOperations = () => {
  // Update field by ID recursively
  const updateFieldById = useCallback(
    (
      fieldsArray: SimpleJSONField[],
      id: string,
      updater: (field: SimpleJSONField) => SimpleJSONField
    ): SimpleJSONField[] => {
      return fieldsArray.map((field) => {
        if (field.id === id) {
          return updater(field);
        } else if (field.children && field.children.length > 0) {
          return {
            ...field,
            children: updateFieldById(field.children, id, updater),
          };
        }
        return field;
      });
    },
    []
  );

  // Add field after specific ID
  const addFieldAfterId = useCallback(
    (
      fieldsArray: SimpleJSONField[],
      id: string,
      newField: SimpleJSONField
    ): SimpleJSONField[] => {
      const result: SimpleJSONField[] = [];

      for (let i = 0; i < fieldsArray.length; i++) {
        const field = fieldsArray[i];
        result.push(field);

        if (field.id === id) {
          result.push(newField);
        } else if (field.children && field.children.length > 0) {
          result[result.length - 1] = {
            ...field,
            children: addFieldAfterId(field.children, id, newField),
          };
        }
      }

      return result;
    },
    []
  );

  // Fixed removeFieldById - handles last child conversion
  const removeFieldById = useCallback(
    (fieldsArray: SimpleJSONField[], id: string): SimpleJSONField[] => {
      return fieldsArray
        .filter((field) => field.id !== id)
        .map((field) => {
          if (field.children && field.children.length > 0) {
            const updatedChildren = removeFieldById(field.children, id);

            // If this was the last child, convert parent back to string field
            if (updatedChildren.length === 0 && field.children.length > 0) {
              return {
                ...field,
                children: undefined,
                value: field.value || "",
                dataType: "string",
              };
            }

            return {
              ...field,
              children: updatedChildren,
            };
          }
          return field;
        });
    },
    []
  );

  // Add child to field by ID
  const addChildToField = useCallback(
    (
      fieldsArray: SimpleJSONField[],
      id: string,
      child: SimpleJSONField
    ): SimpleJSONField[] => {
      return fieldsArray.map((field) => {
        if (field.id === id) {
          return {
            ...field,
            dataType: "object",
            value: "", // Clear value when converting to object
            children: field.children ? [...field.children, child] : [child],
          };
        } else if (field.children && field.children.length > 0) {
          return {
            ...field,
            children: addChildToField(field.children, id, child),
          };
        }
        return field;
      });
    },
    []
  );

  return {
    updateFieldById,
    addFieldAfterId,
    removeFieldById,
    addChildToField,
  };
};

export default function App() {
  // Load initial state from storage
  const [fields, setFields] = useState<SimpleJSONField[]>(() =>
    loadFromStorage(STORAGE_KEYS.FIELDS, getDefaultFields())
  );

  const [selectedTemplate, setSelectedTemplate] = useState(() =>
    loadFromStorage(STORAGE_KEYS.TEMPLATE, "minimal-prompt")
  );

  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>(() =>
    loadFromStorage(STORAGE_KEYS.CUSTOM_TEMPLATES, [])
  );

  const [copyButtonText, setCopyButtonText] = useState("Copy JSON");
  const [copyButtonIcon, setCopyButtonIcon] = useState<React.ReactNode>(
    <Copy size={16} />
  );
  const [copyButtonDisabled, setCopyButtonDisabled] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] =
    useState<CustomTemplate | null>(null);

  // Auto-save fields to storage whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FIELDS, fields);
  }, [fields]);

  // Auto-save selected template whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TEMPLATE, selectedTemplate);
  }, [selectedTemplate]);

  const { updateFieldById, addFieldAfterId, removeFieldById, addChildToField } =
    useFieldOperations();

  // Memoized JSON generation for performance
  const generatedJSON = useMemo(() => generateJSON(fields), [fields]);

  // Check if current template is custom
  const currentCustomTemplate = customTemplates.find(
    (t) => t.id === selectedTemplate
  );
  const isCustomTemplate = selectedTemplate.startsWith("custom_");

  // Set template name when switching to custom template for editing
  useEffect(() => {
    if (isCustomTemplate && currentCustomTemplate && showSaveTemplate) {
      setTemplateName(currentCustomTemplate.name);
    }
  }, [isCustomTemplate, currentCustomTemplate, showSaveTemplate]);

  const handleAddField = useCallback(() => {
    setFields((prev) => [
      ...prev,
      {
        id: generateId(),
        keyName: "",
        value: "",
        dataType: "string",
      },
    ]);
  }, []);

  const handleCopyJSON = useCallback(async () => {
    if (copyButtonDisabled) return;

    setCopyButtonDisabled(true);
    setCopyButtonText("Copying...");
    setCopyButtonIcon(<Clock size={16} />);

    try {
      await navigator.clipboard.writeText(generatedJSON);
      setCopyButtonText("Copied!");
      setCopyButtonIcon(<Check size={16} />);

      // Reset button after 2 seconds - no toast notification
      setTimeout(() => {
        setCopyButtonText("Copy JSON");
        setCopyButtonIcon(<Copy size={16} />);
        setCopyButtonDisabled(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy JSON:", error);

      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = generatedJSON;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        setCopyButtonText("Copied!");
        setCopyButtonIcon(<Check size={16} />);
        setTimeout(() => {
          setCopyButtonText("Copy JSON");
          setCopyButtonIcon(<Copy size={16} />);
          setCopyButtonDisabled(false);
        }, 2000);
      } catch (fallbackError) {
        setCopyButtonText("Failed");
        setCopyButtonIcon(<AlertTriangle size={16} />);
        toast.error("Failed to copy JSON to clipboard");
        setTimeout(() => {
          setCopyButtonText("Copy JSON");
          setCopyButtonIcon(<Copy size={16} />);
          setCopyButtonDisabled(false);
        }, 2000);
      }
    }
  }, [generatedJSON, copyButtonDisabled]);

  const handleSaveAsTemplate = useCallback(() => {
    if (!templateName.trim()) return;

    if (isCustomTemplate && currentCustomTemplate) {
      // Update existing template
      const updatedTemplate: CustomTemplate = {
        ...currentCustomTemplate,
        name: templateName.trim(),
        description: `Custom template with ${fields.length} fields`,
        fields: JSON.parse(JSON.stringify(fields)), // Deep clone
        updatedAt: new Date().toISOString(),
      };

      updateCustomTemplate(updatedTemplate);
      setCustomTemplates((prev) =>
        prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t))
      );
      toast.success(`Template "${updatedTemplate.name}" updated successfully!`);
    } else {
      // Create new template
      const newTemplate: CustomTemplate = {
        id: `custom_${generateId()}`,
        name: templateName.trim(),
        description: `Custom template with ${fields.length} fields`,
        fields: JSON.parse(JSON.stringify(fields)), // Deep clone
        createdAt: new Date().toISOString(),
      };

      saveCustomTemplate(newTemplate);
      setCustomTemplates((prev) => [...prev, newTemplate]);

      // Immediately select the new template
      setSelectedTemplate(newTemplate.id);

      toast.success(`Template "${newTemplate.name}" created successfully!`);
    }

    setTemplateName("");
    setShowSaveTemplate(false);
  }, [templateName, fields, isCustomTemplate, currentCustomTemplate]);

  const handleDeleteTemplate = useCallback((template: CustomTemplate) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeleteTemplate = useCallback(() => {
    if (!templateToDelete) return;

    deleteCustomTemplate(templateToDelete.id);
    setCustomTemplates((prev) =>
      prev.filter((t) => t.id !== templateToDelete.id)
    );

    // If the deleted template was selected, switch to minimal-prompt
    if (selectedTemplate === templateToDelete.id) {
      setSelectedTemplate("minimal-prompt");
    }

    // Show success notification
    toast.success(`Template "${templateToDelete.name}" deleted successfully!`);

    setDeleteDialogOpen(false);
    setTemplateToDelete(null);
  }, [templateToDelete, selectedTemplate]);

  const createFieldFromTemplate = useCallback(
    (templateField: any): SimpleJSONField => {
      const field: SimpleJSONField = {
        id: generateId(),
        keyName: templateField.keyName,
        value: templateField.value,
        dataType: "string",
      };

      if (templateField.children && templateField.children.length > 0) {
        field.children = templateField.children.map(createFieldFromTemplate);
        field.dataType = "object";
        field.value = ""; // Clear value for objects
      }

      return field;
    },
    []
  );

  const handleTemplateChange = useCallback(
    (templateId: string) => {
      setSelectedTemplate(templateId);

      if (templateId.startsWith("custom_")) {
        // Load custom template
        const customTemplate = customTemplates.find((t) => t.id === templateId);
        if (customTemplate) {
          const templateFields = customTemplate.fields.map(
            createFieldFromTemplate
          );
          setFields(templateFields);
        }
      } else {
        // Load starter template
        const template = starterTemplates.find((t) => t.id === templateId);
        if (template) {
          const templateFields = template.fields.map(createFieldFromTemplate);
          setFields(templateFields);
        }
      }
    },
    [createFieldFromTemplate, customTemplates]
  );

  // Enhanced field update handlers
  const handleKeyNameChange = useCallback(
    (id: string, value: string) => {
      setFields((prev) =>
        updateFieldById(prev, id, (field) => ({
          ...field,
          keyName: value,
        }))
      );
    },
    [updateFieldById]
  );

  const handleValueChange = useCallback(
    (id: string, value: string) => {
      setFields((prev) =>
        updateFieldById(prev, id, (field) => ({
          ...field,
          value,
        }))
      );
    },
    [updateFieldById]
  );

  const handleAddNestedField = useCallback(
    (parentId: string) => {
      const newField: SimpleJSONField = {
        id: generateId(),
        keyName: "",
        value: "",
        dataType: "string",
      };

      setFields((prev) => addChildToField(prev, parentId, newField));
    },
    [addChildToField]
  );

  const handleAddSiblingField = useCallback(
    (fieldId: string) => {
      const newField: SimpleJSONField = {
        id: generateId(),
        keyName: "",
        value: "",
        dataType: "string",
      };

      setFields((prev) => addFieldAfterId(prev, fieldId, newField));
    },
    [addFieldAfterId]
  );

  const handleDeleteField = useCallback(
    (fieldId: string) => {
      setFields((prev) => {
        const updated = removeFieldById(prev, fieldId);
        // Ensure we always have at least one field
        return updated.length === 0 ? getDefaultFields() : updated;
      });
    },
    [removeFieldById]
  );

  // Enhanced recursive field renderer with lucide icons
  const renderFields = useCallback(
    (fieldsArray: SimpleJSONField[], nestingLevel = 0): JSX.Element => {
      const indentStyle = {
        paddingLeft: `${nestingLevel * 8}px`,
      };

      const maxNestingLevel = 2;

      return (
        <div style={indentStyle}>
          {fieldsArray.map((field) => (
            <div key={field.id} className="group relative mb-3">
              <div className="flex items-center w-full gap-2 mb-2">
                <Input
                  value={field.keyName}
                  onChange={(e) =>
                    handleKeyNameChange(field.id, e.target.value)
                  }
                  placeholder="Key"
                  className="w-32 text-sm"
                />

                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                  {nestingLevel < maxNestingLevel && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddNestedField(field.id)}
                          className="w-8 h-8 p-0 hover:bg-purple-50 text-purple-600"
                        >
                          <FolderPlus size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Add nested object (Level {nestingLevel + 1}/
                          {maxNestingLevel})
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddSiblingField(field.id)}
                        className="w-8 h-8 p-0 hover:bg-green-50 text-green-600"
                      >
                        <Plus size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add field below</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteField(field.id)}
                        className="w-8 h-8 p-0 text-gray-500 hover:text-red-500 hover:bg-red-50"
                      >
                        <X size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete field</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {(!field.children || field.children.length === 0) && (
                <div className="mb-2">
                  <AutoExpandTextarea
                    value={field.value}
                    onChange={(e) =>
                      handleValueChange(field.id, e.target.value)
                    }
                    placeholder="Instruction for AI"
                    className="w-full text-sm"
                  />
                </div>
              )}

              {field.children && field.children.length > 0 && (
                <div className="border-l-2 border-purple-200 ml-0.5 mt-2 pl-1.5 bg-purple-50/30 rounded-r-lg">
                  <div className="py-2">
                    {renderFields(field.children, nestingLevel + 1)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    },
    [
      handleKeyNameChange,
      handleValueChange,
      handleAddNestedField,
      handleAddSiblingField,
      handleDeleteField,
    ]
  );

  return (
    <TooltipProvider>
      <div className="w-[700px] min-h-[500px] p-0 bg-gray-50 relative">
        <Card className="h-full flex flex-col m-0 border-none rounded-none shadow-sm">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between px-3 py-2 border-b bg-white">
            <div className="flex items-center space-x-2">
              {/* LARGER LOGO - Changed from w-4 h-4 to w-6 h-6 */}
              <img src={icon} alt="JSON Prompter" className="w-6 h-6" />
              <CardTitle className="text-sm font-semibold text-gray-800">
                JSON Prompter
              </CardTitle>
              {/* PRO FEATURE TOOLTIP WITH SMALLER FONTS */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Sparkles
                    size={16}
                    className="text-purple-500 cursor-default hover:text-purple-600 transition-colors"
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-white text-gray-900 border shadow-md max-w-lg">
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-purple-600" />
                      <p className="font-medium text-purple-800 text-xs">
                        AI-Powered Prompt Builder
                      </p>
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium whitespace-nowrap">
                        <Crown size={10} className="inline mr-1" />
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-xs text-grey-400 leading-relaxed">
                      Type your prompt in plain English, and let AI convert it
                      into a perfect JSON structure automatically. No more
                      manual field building - just describe what you want and
                      watch the magic happen!
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger className="w-56 text-xs h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="templates"
                    disabled
                    className="text-gray-400"
                  >
                    ── Starter Templates ──
                  </SelectItem>
                  {starterTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id}
                      className="pl-6"
                    >
                      {template.name}
                    </SelectItem>
                  ))}
                  {customTemplates.length > 0 && (
                    <SelectItem
                      value="custom-divider"
                      disabled
                      className="text-gray-400"
                    >
                      ── Custom Templates ──
                    </SelectItem>
                  )}
                  {customTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id}
                      className="pl-6"
                    >
                      {template.name}
                      {template.updatedAt && (
                        <span className="text-xs text-gray-400 ml-1">
                          (edited)
                        </span>
                      )}
                    </SelectItem>
                  ))}

                  {/* PRO SECTION IN TEMPLATES */}
                  <SelectItem
                    value="pro-divider"
                    disabled
                    className="text-gray-400"
                  >
                    ── Pro Templates ──
                  </SelectItem>
                  <SelectItem value="pro-coming-soon" disabled className="pl-6">
                    <div className="flex items-center gap-2 text-purple-600">
                      <Crown size={14} />
                      <span className="text-sm">
                        AI Prompt Builder (Coming Soon)
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Delete button for custom templates - outside dropdown */}
              {isCustomTemplate && currentCustomTemplate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDeleteTemplate(currentCustomTemplate)
                      }
                      className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete current custom template</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSaveTemplate(!showSaveTemplate)}
                    className="text-xs h-7 px-2"
                  >
                    {isCustomTemplate ? <Edit size={14} /> : <Save size={14} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isCustomTemplate
                      ? "Edit current template"
                      : "Save as new template"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>

          {/* Save template input */}
          {showSaveTemplate && (
            <div className="px-3 py-2 bg-blue-50 border-b">
              <div className="flex items-center gap-2">
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder={
                    isCustomTemplate
                      ? "Update template name..."
                      : "Template name..."
                  }
                  className="text-xs h-7 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveAsTemplate();
                    }
                  }}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveAsTemplate}
                      disabled={!templateName.trim()}
                      className="text-xs h-7 px-3 gap-1"
                    >
                      {isCustomTemplate ? (
                        <Edit size={12} />
                      ) : (
                        <Save size={12} />
                      )}
                      {isCustomTemplate ? "Update" : "Save"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isCustomTemplate
                        ? "Update template"
                        : "Save new template"}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowSaveTemplate(false);
                        setTemplateName("");
                      }}
                      className="text-xs h-7 px-2"
                    >
                      <X size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

          <CardContent className="flex-1 flex gap-4 p-4">
            {/* Left Panel - Field Builder */}
            <div className="flex-1 flex flex-col">
              <Label className="text-sm font-medium text-gray-700 mb-3">
                Field Builder
              </Label>

              <div className="flex-1 overflow-y-auto max-h-[435px] pr-2">
                {fields.length === 0 ? (
                  /* PRO EMPTY STATE */
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Wand2 size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      No fields yet
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Add fields manually or wait for our AI assistant
                    </p>
                    <div className="w-full max-w-xs p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border-2 border-dashed border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown size={16} className="text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-xs text-purple-600">
                        "Create a blog post prompt with title, content, and SEO
                        tags"
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-purple-500">
                        <Sparkles size={12} />
                        <span>AI will build this for you</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  renderFields(fields)
                )}

                <div className="mt-4 pt-2 border-t border-gray-200">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddField}
                        className="text-sm h-8 px-3 w-full gap-2"
                      >
                        <Plus size={16} />
                        Add Field
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add a new field</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Right Panel - JSON Preview */}
            <div className="flex-1 flex flex-col">
              <Label className="text-sm font-medium text-gray-700 mb-3">
                JSON Preview
              </Label>
              <pre className="bg-white p-4 rounded-lg text-xs border border-gray-200 font-mono leading-relaxed whitespace-pre-wrap word-wrap break-words h-[380px] overflow-auto">
                {generatedJSON}
              </pre>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={`mt-4 w-full transition-all duration-200 gap-2 ${
                      copyButtonText.includes("Copied")
                        ? "bg-green-600 hover:bg-green-700"
                        : copyButtonText.includes("Failed")
                        ? "bg-red-600 hover:bg-red-700"
                        : ""
                    }`}
                    variant="default"
                    onClick={handleCopyJSON}
                    disabled={copyButtonDisabled}
                  >
                    {copyButtonIcon}
                    {copyButtonText}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy JSON to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Shadcn Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 size={20} className="text-red-600" />
                Delete Template
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the template "
                {templateToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="gap-2"
              >
                <X size={16} />
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteTemplate}
                className="gap-2"
              >
                <Trash2 size={16} />
                Delete Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Shadcn Sonner Toaster */}
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
