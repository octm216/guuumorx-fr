'use strict';
function Connector(conf) {
	this.name = conf.connectionName;
	this.windowName = conf.windowName;
	this.windowCount = conf.windowCount;
	this.windows = {};
	this.windowSearch = {};
	// this.connectionStart = new Event('frameconnectorstart');
}
Connector.prototype.finalize = function () {
	Object.keys(this.windowSearch).forEach(function (wn) {
		this.windowSearch[wn][this.name].windows = this.windowSearch;
		this.windowSearch[wn].dispatchEvent(this.windowSearch[wn][this.name].connectionStart);
	}, this);
};
Connector.prototype.walkFrames = function (w) {
	var i,
		framesLength,
		frameAccessElem,
		currentFrame;
	if (!w) {
		w = top;
	}
	framesLength = w.frames.length;
	for (i = 0; i < framesLength; i++) {
		currentFrame = w.frames[i];
		try {
			frameAccessElem = currentFrame.document;
			if (frameAccessElem && currentFrame[this.name]) {
				this.windowSearch[currentFrame[this.name].windowName] = currentFrame;
				if (Object.keys(this.windowSearch).length === this.windowCount) {
					this.finalize();
				}
			}
		} catch (e) {}
		if (currentFrame.frames.length > 0) {
			this.walkFrames(currentFrame);
		}
	}
};
Connector.prototype.init = function () {
	this.connectionStart = document.createEvent('Event');
	this.connectionStart.initEvent('frameconnectorstart', true, true);
	this.walkFrames();
};
