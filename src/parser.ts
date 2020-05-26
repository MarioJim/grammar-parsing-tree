import { updateTree } from './parsing_tree';
import { Derivation, isTerminalSymbol } from './types';

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
    let [qSymbol, qLevel] = queue.shift();
    const q = qSymbol.name;

    // Search first non terminal symbol
    let index: number = -1;
    do {
      index++;
    } while (index < q.length && isTerminalSymbol(q.charAt(index)));

    if (index === q.length) continue;

    window.grammarStructure.nonTerminalSymbols[q.charAt(index)].forEach(production => {
      // Create new derivation with uAv as uwv and add new derivation to tree
      const newDerivation: Derivation = {
        name: q.replace(q.charAt(index), production),
        children: [],
      };
      // Check if p equals uwv
      if (newDerivation.name === input) {
        buildString = newDerivation.name;
        done = true;
        qSymbol.children.push(newDerivation);
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
      qSymbol.children.push(newDerivation);
      queue.push([newDerivation, qLevel + 1,]);
    });
  }

  if (input === buildString && input !== '') {
    console.log('Accepted');
  } else {
    console.log('Not accepted');
    // TODO: Show sad message
  }

  updateTree();
};

export default parser;
