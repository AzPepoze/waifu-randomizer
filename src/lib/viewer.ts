import type Viewer from "viewerjs";

export interface ViewerImageData {
	x: number;
	y: number;
	width: number;
	height: number;
	naturalWidth: number;
	naturalHeight: number;
	ratio: number;
	scaleX: number;
	scaleY: number;
}

export interface ViewerContainerData {
	width: number;
	height: number;
}

export type ViewerInstance = Viewer & {
	imageData: ViewerImageData;
	containerData: ViewerContainerData;
	options: Viewer.Options;
};
