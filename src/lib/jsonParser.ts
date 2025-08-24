// src/lib/jsonParser.ts
export interface JSONField {
  id: string
  keyName: string
  value: string
  children?: JSONField[]
}

// Generate a simple ID for our fields
const generateId = () => Math.random().toString(36).substr(2, 9)

export const parseJSON = (obj: any): JSONField[] => {
  const fields: JSONField[] = []
  
  for (const [key, value] of Object.entries(obj)) {
    const field: JSONField = {
      id: generateId(),
      keyName: key,
      value: '',
    }
    
    if (typeof value === 'string') {
      field.value = value
    } else if (typeof value === 'number') {
      field.value = value.toString()
    } else if (typeof value === 'boolean') {
      field.value = value.toString()
    } else if (Array.isArray(value)) {
      // For arrays, we'll leave the value empty for now
    } else if (value !== null && typeof value === 'object') {
      field.children = parseJSON(value)
    }
    
    fields.push(field)
  }
  
  return fields
}