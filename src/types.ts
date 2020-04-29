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

/**
 * Checks if a symbol its terminal
 * @param symbolName the name of the symbol
 */
export const isTerminalSymbol = (symbolName: string): boolean =>
  window.grammarStructure.terminalSymbols.includes(symbolName);
