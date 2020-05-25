import parser from './parser';
import { parseFile } from './grammar_parsing';
import setupInputs from './input_fields';
import { setupTree } from './parsing_tree';
import { GrammarStructure, Point, Symbol } from './types';

declare global {
  interface Window {
    grammarStructure: GrammarStructure
    parsingTree: Symbol
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
  // Add hardcoded tree for d3 tests
  window.parsingTree = {
    name: 'S',
    id: 0,
    children: [
      {
        name: 'A',
        id: 1,
        children: [
          {
            name: 'a',
            id: 2,
          },
        ],
      },
      {
        name: 'b',
        id: 3,
      },
      {
        name: 'B',
        id: 4,
        children: [
          {
            name: 'A',
            id: 5,
            children: [
              {
                name: 'a',
                id: 6,
              },
            ],
          },
          {
            name: 'a',
            id: 7,
          },
          {
            name: 'A',
            id: 8,
            children: [
              {
                name: 'a',
                id: 9,
              },
            ],
          },
        ],
      },
    ],
  };
  setupTree();
};
