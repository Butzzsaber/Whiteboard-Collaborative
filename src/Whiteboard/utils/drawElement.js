import { toolTypes } from "../../constants";
import getStroke from 'perfect-freehand';
import { getSvgPathFromStroke } from "./getSvgPathFromStroke";

const drawPencilElement = (context, element) => {
    const myStroke = getStroke(element.points,{
        size: 10,
        smoothing: 0.5,
    });
    const pathdata= getSvgPathFromStroke(myStroke);

    const mypath = new Path2D(pathdata);
    context.fill(mypath);
};

const drawTextElement = (context, element) => {
    context.textBaseline = "top";
    context.font = "25px sans-serif";
    context.fillText(element.text, element.x1, element.y1);
};

export const drawElement = ({ roughCanvas, context, element }) => {
    switch (element.type){
        case toolTypes.RECTANGLE:
        case toolTypes.LINE:
        case toolTypes.CIRCLE:
            return roughCanvas.draw(element.roughElement);
        case toolTypes.PENCIL:
            return drawPencilElement(context, element);
        case toolTypes.TEXT:
            drawTextElement(context, element);
            break;
        default:
            throw new Error("tool not found");
    }
};