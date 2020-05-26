/**
 * Parses the file into grammarStructure, located in window
 * @param file the file to be parsed
 */
const parseFile = (file: string) => {
  // Initialize the structure
  window.grammarStructure = {
    startingSymbol: '',
    terminalSymbols: [],
    nonTerminalSymbols: {},
  };
  // Split the file into lines
  const lines = file.split('\n').map(line => line.trim()).filter(line => line !== '');
  // Split the non terminal symbols and initialize its array
  window.grammarStructure.nonTerminalSymbols = Object.fromEntries(
    lines.shift().split(',').map(nonTerminalSymbol => [nonTerminalSymbol, []])
  );
  // Split the terminal symbols
  window.grammarStructure.terminalSymbols = lines.shift().split(',');
  // Set the starting symbol
  window.grammarStructure.startingSymbol = lines.shift();
  // Split the productions into its parts and add it to the list
  lines.forEach(line => {
    const [nonTerminalSymbol, production] = line.split('->');
    window.grammarStructure.nonTerminalSymbols[nonTerminalSymbol].push(production);
  });
};

export default parseFile;
