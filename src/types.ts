export interface Symbol {
  name: string
  id: number
  children?: Symbol[]
}

export interface GrammarStructure {
  startingSymbol: string
  nonTerminalSymbols: {
    [key: string]: string[]
  }
  terminalSymbols: string[]
}

export interface Point {
  x: number
  y: number
}

/**
 * Checks if a symbol its terminal
 * @param symbolName the name of the symbol
 */
export const isTerminalSymbol = (symbolName: string): boolean =>
  window.grammarStructure.terminalSymbols.includes(symbolName);
