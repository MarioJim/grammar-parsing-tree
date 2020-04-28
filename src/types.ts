export interface Symbol {
  name: string
  children?: Symbol[]
}

export interface GrammarStructure {
  [key: string]: string[][]
}
