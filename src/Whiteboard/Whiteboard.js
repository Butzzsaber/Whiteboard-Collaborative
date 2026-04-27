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


// let selectedElement;

// const setSelectedElement = (el) => {
//   selectedElement = el;
// };




const Whiteboard = () => {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const toolType = useSelector((state)=>state.whiteboard.tool);
  const [action, setActions] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
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

     if(selectedElement && action === actions.WRITING){
      return;
     }
     
     const element = createElement({
      x1: clientX,
      y1: clientY,
      x2: clientX,
      y2: clientY,
      toolType,
      id: uuid(),
   
     });
    switch(toolType){
      case toolTypes.RECTANGLE:
      case toolTypes.LINE:
      case toolTypes.CIRCLE:
      case toolTypes.PENCIL:{
        setActions(actions.DRAWING);
        break;
      }
      case toolTypes.TEXT:{
        setActions(actions.WRITING);
        break;
      }
    }
    setSelectedElement(element);

    dispatch(updateElementsInStore(element));
     };
    const handleMouseUp = (event) => {
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
          socket.emit("draw-end", updateElementData);

          console.log("mouseUp: ", updateElementData);
          
        }
      
      setActions(null);
      setSelectedElement(null);
      }
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
        console.log("selectedElement:", selectedElement);
console.log("elements:", elements);
console.log("index:", index);
      }
    }

  const handleTextareaBlur = (event) => {
    const {id,x1,y1,type} = selectedElement;


    const index = elements.findIndex((el) => el.id === selectedElement.id);
    if(index !== -1){
      updateElement({
        id,
        x1,
        y1,
        text: event.target.value,
        type,
        index
      }, elements);
      setActions(null);

    }
  };
 
  
  return (
    <div>
      <Menu />
      {action === actions.WRITING ? <textarea
      ref={textAreaRef}
      onBlur={handleTextareaBlur}
      style={{
        position: "absolute",
        left: selectedElement.x1,
        top: selectedElement.y1 - 3,
        fontSize: "16px",
        font: '25px Sans-Serif',
        margin: 0,
        padding: 0,
        border: "1px solid black",
        resize: "auto",
        overflow: "hidden",
        background: "transparent",
        whiteSpace: "pre",

      }}
      /> : null}
      <canvas ref={canvasRef}
             onMouseDown={handleMouseDown}
             onMouseUp={handleMouseUp}
             onMouseMove={handleMouseMove}
             width = {window.innerWidth}
             height = {window.innerHeight}
             id="canvas"
             
      
      />
    </div>
  );
};

export default Whiteboard;
