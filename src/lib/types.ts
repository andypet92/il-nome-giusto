export interface NameResult {
  name: string
  origin: string
  description: string
  tags: string[]
}

export interface GenerateResponse {
  names: NameResult[]
  error?: string
}
