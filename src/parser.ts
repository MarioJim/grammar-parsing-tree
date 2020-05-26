import { updateTree } from './parsing_tree';
import { Derivation, isTerminalSymbol } from './types';

/**
 * Parses the provided string within a maximum depth
 * @param input the string to try to parse
 * @param depth the maximum depth of the tree
 */
const parser = (input: string, depth: number) => {
  window.parsingTree = {
    name: window.grammarStructure.startingSymbol,
    children: [],
  };

  const queue: [Derivation, number][] = [];
  queue.push([window.parsingTree, 1,]);

  let buildString: string = '';
  let done: boolean = false;

  while (queue.length !== 0 && !done) {
    // Let q = uAv where A is the left most variable in q
    const [qDerivation, qLevel] = queue.shift();
    const q = qDerivation.name;

    // Search first non terminal symbol
    let index: number = -1;
    do {
      index++;
    } while (index < q.length && isTerminalSymbol(q.charAt(index)));

    // if there aren't non terminal symbols continue to the next derivation
    if (index === q.length) continue;

    window.grammarStructure.nonTerminalSymbols[q.charAt(index)].forEach(production => {
      // Create new derivation with uAv as uwv and add the new derivation to the tree
      const newDerivation: Derivation = {
        name: q.replace(q.charAt(index), production),
        children: [],
      };
      // Check if p equals uwv
      if (newDerivation.name === input) {
        buildString = newDerivation.name;
        done = true;
        qDerivation.children.push(newDerivation);
        return;
      }
      // Check if the prefix of uwv matches the prefix in p
      for (let i = 0; i < Math.min(newDerivation.name.length, input.length); i++) {
        if (!isTerminalSymbol(newDerivation.name.charAt(i))) break;
        if (newDerivation.name.charAt(i) !== input.charAt(i)) return;
      }
      // Check if we are still within the depth limit
      if (qLevel >= depth) return;
      // Add the derivation to the tree and to the queue to continue parsing
      qDerivation.children.push(newDerivation);
      queue.push([newDerivation, qLevel + 1,]);
    });
  }

  // Select message element and display the message
  const messageElement = document.getElementById('message').children[0];
  if (input === '') {
    messageElement.textContent = 'Enter a string';
  } else if (input === buildString) {
    messageElement.textContent = 'String accepted';
  } else {
    messageElement.textContent = 'String not accepted';
  }

  updateTree();
};

export default parser;
