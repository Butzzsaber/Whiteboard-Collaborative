import { createElement } from ".";
import { toolTypes } from "../../constants";
import { store } from "../../store/store";
import { setElements } from "../whiteboardSlice";

export const updateElement =({id,x1,x2,y1,y2,type,index},elements) => {
    const elementCopy = [...elements];
    
    switch(type){
    case toolTypes.LINE:
    case toolTypes.CIRCLE:
    case toolTypes.RECTANGLE:
          const updateElement = createElement({
            id,
            x1,
            y1,
            x2,
            y2,
            toolType:type,
          });
            elementCopy[index] = updateElement; 

            store.dispatch(setElements(elementCopy));
            break;
    case toolTypes.PENCIL:
          elementCopy[index] = {
            ...elementCopy[index],
            points: [
                ...elementCopy[index].points,
                {
                    x:x2,
                    y:y2,
                }
            ]
        } 
        const updatedPencilElement = elementCopy[index];
        store.dispatch(setElements(elementCopy));
        break;
    case toolTypes.TEXT:
         const textWidth= document.getElementById("canvas").getContext("2d").measureText(text).width;
        const textHeight = 25;

          elementCopy[index] = {
            ...createElement({
                id,
                x1,
                y1,
                x2:x1 + textWidth,
                y2:y1 + textHeight,
                toolType:type,
                text,
            }),
           };
           const updatedTextElement = elementCopy[index];
            store.dispatch(setElements(elementCopy));
            emitElementUpdate(updatedTextElement);
            break;
    default:
        throw new Error("tool not found");
  }

};