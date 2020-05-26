import { updateTree } from "./parsing_tree";
import { Symbol } from './types';

const getRandomId = () => Math.floor(Math.random() * 100000);

const parser = (input: string, depth: number) => {
  const treeQueue: string[] = [];
  const treeQueueLevels: number[] = [];
  const treeQueueSymbols: Symbol[] = [];
  treeQueue.push(window.grammarStructure.startingSymbol);
  treeQueueLevels.push(1);
  
  window.parsingTree = {
    name: window.grammarStructure.startingSymbol,
    id: getRandomId(),
    children: []
  };

  treeQueueSymbols.push(window.parsingTree);

  let buildString: string  = "";
  let done: boolean = false;

  while (treeQueue.length != 0 && !done) {
    let q: string = treeQueue.shift();
    let qLevel: number = treeQueueLevels.shift();
    let qSymbol: Symbol = treeQueueSymbols.shift();

    let index: number = -1;
    for (let i=0; i<q.length; i++) {
      if ((q.charAt(i)>='A') && (q.charAt(i)<='Z')) {
        index = i;
        break;
      }
    }

    if (index != -1)
      window.grammarStructure.nonTerminalSymbols[`${q.charAt(index)}`].forEach(function (value) {
        let tempString: string = q.replace(`${q.charAt(index)}`, value);
        let check: boolean = true; 

        // Check if p equals uwv
        if (tempString == input) {
          buildString = tempString;
          done = true;
        }
        
        if (tempString.length > input.length) {
          check = false;
        } else {
          // Check if the prefix of uwv matches the prefix in p
          for (let i=0; i<tempString.length && i<input.length; i++) {
            if ((tempString.charAt(i)>='A')&&(tempString.charAt(i)<='Z'))
              break;

            if (tempString.charAt(i) != input.charAt(i))
              check = false;
          }
        }

        if (check && qLevel+1<=depth) {
          treeQueue.push(tempString);
          treeQueueLevels.push(qLevel+1);
          qSymbol.children.push({name:tempString, id:getRandomId(), children: []});
          treeQueueSymbols.push(qSymbol.children[qSymbol.children.length-1]);
        }
      }); 
  }

  if (input == buildString && input != "") {
    console.log("Accepted");
  } else {
    console.log("Not accepted");
    // TODO: Show sad message
  }

  updateTree();
};

export default parser;


//aaabbbba