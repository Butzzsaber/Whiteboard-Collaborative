import React from 'react'
import rectangle from '../resources/icons/rectangle.svg'
import line from '../resources/icons/line.svg'
import circle from '../resources/icons/circle.svg'
import rubber from '../resources/icons/rubber.svg'
import pencil from '../resources/icons/pencil.svg'
import text from '../resources/icons/text.svg'
import { toolTypes } from '../constants';
import {useDispatch,useSelector} from 'react-redux';
import { setElements, setToolType } from './whiteboardSlice';
const IconButton = ({src, type ,isRubber}) => {
  const dispatch = useDispatch();

  const selectedToolType = useSelector((state) => state.whiteboard.tool);

  const handleToolChange = () => {
    dispatch(setToolType(type));
  }
  const handleClearCanvas = () => {
    dispatch(setElements([]));
  }


    return (
        <button onClick={isRubber ? handleClearCanvas :handleToolChange} className={selectedToolType === type ? "menu_button_active" : "menu_button"}>
            <img width="80%" height ="80%" src={src}/> 
        </button>
    )
}

const Menu = () => {
  return (
    <div className='menu_container'>
        <IconButton src={rectangle} type={toolTypes.RECTANGLE } />
        <IconButton src={line} type={toolTypes.LINE} />
        <IconButton src={circle} type={toolTypes.CIRCLE} />
        <IconButton src={pencil} type={toolTypes.PENCIL} />
        <IconButton src={rubber} isRubber />
        <IconButton src={text} type={toolTypes.TEXT} />
    </div>
  )
}

export default Menu
