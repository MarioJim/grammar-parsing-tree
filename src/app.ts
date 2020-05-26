import parser from './parser';
import { parseFile } from './grammar_parsing';
import setupInputs from './input_fields';
import { setupTree } from './parsing_tree';
import { GrammarStructure, Point, Derivation } from './types';

declare global {
  interface Window {
    grammarStructure: GrammarStructure
    parsingTree: Derivation
    oldSourcePoint: Point
  }
}

// When document is ready, call add_drop_listener
document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive')
    addDropListener();
});

const ignoreEvent = (event: DragEvent) => {
  event.stopPropagation();
  event.preventDefault();
};

/**
 * Adds the drop listener to the body.
 * 
 * When an plain text file is dropped into the area, recieved_file
 * is called with the string of the file as a parameter.
 */
const addDropListener = () => {
  const page = document.getElementsByTagName('body')[0];
  page.ondragenter = ignoreEvent;
  page.ondragover = ignoreEvent;
  page.ondrop = event => {
    ignoreEvent(event);
    if (event.dataTransfer.files.length !== 1) return;
    const file = event.dataTransfer.files[0];
    if (file.type !== 'text/plain') return;
    const reader = new FileReader();
    reader.onload = event => {
      if (typeof event.target.result === 'string')
        recievedFile(event.target.result);
    };
    reader.readAsText(file);
  };
};

/**
 * Processes the recieved file
 * @param file 
 */
const recievedFile = (file: string) => {
  console.log(file);
  parseFile(file);
  setupInputs(parser);
  setupTree();
};
