export interface Symbol {
  name: string
  children?: Symbol[]
}

export interface GrammarStructure {
  startingSymbol: string
  nonTerminalSymbols: {
    [key: string]: string[]
  }
  terminalSymbols: string[]
}
