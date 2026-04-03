import React, {useLayoutEffect, useRef} from "react";
import Menu from "./Menu";
import rough from 'roughjs/bundled/rough.esm';
import { useSelector,useDispatch } from "react-redux";
import {actions, toolTypes} from "../constants";
import { useState } from "react";
import { createElement,updateElement,drawElement } from "./utils/index";
import { v4 as uuid } from "uuid";
import { updateElements as updateElementsInStore } from "./whiteboardSlice";


let selectedElement;

const setSelectedElement = (el) => {
  selectedElement = el;
};




const Whiteboard = () => {
  const canvasRef = useRef();
  const toolType = useSelector((state)=>state.whiteboard.tool);
  const [action, setActions] = useState(null)
  const elements = useSelector((state) => state.whiteboard.elements);
  const dispatch = useDispatch();

  useLayoutEffect(() =>{
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0,0,canvas.width,canvas.height);

    
    const rc = rough.canvas(canvas);
    elements.forEach((element) => {
    drawElement({ roughCanvas: rc, context:ctx, element });  
    }
    );

    
  },[elements]);
  const handleMouseDown = (event) => {
     const {clientX, clientY} = event;
     console.log(toolType);
     
     if(toolType === toolTypes.RECTANGLE){
       setActions(actions.DRAWING);
     }
     const element = createElement({
      x1: clientX,
      y1: clientY,
      x2: clientX,
      y2: clientY,
      toolType,
      id: uuid(),
   
     });
     setSelectedElement(element);

     dispatch(updateElementsInStore(element));
     

    };
    const handleMouseUp = () => {
      setActions(null);
      setSelectedElement(null);
    }
    const handleMouseMove = (event) =>{
      const {clientX, clientY} = event;

      if(action === actions.DRAWING){
        const index = elements.findIndex((el) => el.id === selectedElement.id);

        if(index!==-1){
          updateElement({
            index,
            id:elements[index].id,
            x1: elements[index].x1,
            y1: elements[index].y1,
            x2: clientX,
            y2: clientY,
            type: elements[index].type,
          },elements);
        }
      }
    }

 
  
  return (
    <div>
      <Menu />
      <canvas ref={canvasRef}
             onMouseDown={handleMouseDown}
             onMouseUp={handleMouseUp}
             onMouseMove={handleMouseMove}
             width = {window.innerWidth}
             height = {window.innerHeight}
             
      
      />
    </div>
  );
};

export default Whiteboard;
