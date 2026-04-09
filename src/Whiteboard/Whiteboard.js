import React, {useEffect, useLayoutEffect, useRef} from "react";
import Menu from "./Menu";
import rough from 'roughjs/bundled/rough.esm';
import { useSelector,useDispatch } from "react-redux";
import {actions, toolTypes} from "../constants";
import { useState } from "react";
import { createElement,updateElement,drawElement } from "./utils/index";
import { v4 as uuid } from "uuid";
import { updateElements as updateElementsInStore, setElements } from "./whiteboardSlice";
import { socket } from "../socketconn/socketConn";


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
    console.log("Drawing elements:", elements);
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0,0,canvas.width,canvas.height);

    
    const rc = rough.canvas(canvas);
    elements.forEach((element) => {
    drawElement({ roughCanvas: rc, context:ctx, element });  
    }
    );

    
  },[elements]);


  useEffect(() => {
    if (!socket) {
      console.log("socket not ready");
      return;
    }
    const handler = (elementData) => {
      const fullElement = { ...elementData, toolType: elementData.toolType || elementData.type };
      console.log("data:",fullElement);
      const element = createElement(fullElement)
      dispatch(updateElementsInStore(element));
    };

    socket.on("draw-received", handler);

    return () => {
      socket.off("draw-received", handler);
    };
  }, [dispatch]);


  useEffect(() => {
    const handler = (serverElements) => {
      console.log("INIT:", serverElements);

      const elements = serverElements.map((el) =>
        createElement({
          id: el.id,
          x1: el.x1,
          y1: el.y1,
          x2: el.x2,
          y2: el.y2,
          toolType: el.toolType || el.type,
        })
      );

      dispatch(setElements(elements)); 
    };

    socket.on("init", handler);

    return () => {
      socket.off("init", handler);
    };
  }, [dispatch]);




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
      const sendElement = {
        id: selectedElement.id,
        toolType: selectedElement.type,
        x1: selectedElement.x1,
        y1: selectedElement.y1,
        x2: selectedElement.x2,
        y2: selectedElement.y2
      };
      console.log("mouseUp: ", sendElement);
      socket.emit("draw-end", selectedElement);
      setActions(null);
      setSelectedElement(null);
    }
    const handleMouseMove = (event) =>{
      const {clientX, clientY} = event;

      if(action === actions.DRAWING){
        const index = elements.findIndex((el) => el.id === selectedElement.id);

        if(index!==-1){
          const updateElementData = {
            index,
            id:elements[index].id,
            x1: elements[index].x1,
            y1: elements[index].y1,
            x2: clientX,
            y2: clientY,
            type: elements[index].type,
          }

          updateElement(updateElementData,elements);
        
          if (!socket) {
            console.log("socket not ready");
            return;
          }
          socket.emit("draw", updateElementData);

          
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
