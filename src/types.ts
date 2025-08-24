export interface JSONField {
  id: string
  keyName: string
  value: string
  children?: JSONField[]
}