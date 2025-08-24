// src/lib/storage.ts
export interface SavedTemplate {
  id: string
  name: string
  fields: any[]
  createdAt: number
}

export const saveTemplate = (name: string, fields: any[]): SavedTemplate => {
  const template: SavedTemplate = {
    id: Date.now().toString(),
    name,
    fields,
    createdAt: Date.now()
  }
  
  const savedTemplates = getSavedTemplates()
  savedTemplates.push(template)
  localStorage.setItem('jsonPrompterTemplates', JSON.stringify(savedTemplates))
  
  return template
}

export const getSavedTemplates = (): SavedTemplate[] => {
  const templates = localStorage.getItem('jsonPrompterTemplates')
  return templates ? JSON.parse(templates) : []
}

export const deleteTemplate = (id: string): void => {
  const templates = getSavedTemplates()
  const filteredTemplates = templates.filter(template => template.id !== id)
  localStorage.setItem('jsonPrompterTemplates', JSON.stringify(filteredTemplates))
}