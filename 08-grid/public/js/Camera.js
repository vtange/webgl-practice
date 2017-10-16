var eventPrefix = BABYLON.Tools.GetPointerPrefix();

var MyArcRotateCameraPointersInput = (function () {
// constructor
function MyArcRotateCameraPointersInput() {
	this.angularSensibilityX = 1000.0;
	this.angularSensibilityY = 1000.0;
	this.pinchPrecision = 6.0;
	this.panningSensibility = 50.0;
	this._isPanClick = false;
	this.pinchInwards = true;
	this.wheelPrecision = 3.0;
}
MyArcRotateCameraPointersInput.prototype.attachControl = function (element, noPreventDefault) {
	var _this = this;
	var engine = this.camera.getEngine();
	var cacheSoloPointer; // cache pointer object for better perf on camera rotation
	var pointA, pointB;
	var previousPinchDistance = 0;

	// mouse wheel input
	this._wheel = function (p, s) {
		//sanity check - this should be a PointerWheel event.
		if (p.type !== BABYLON.PointerEventTypes.POINTERWHEEL)
			return;
		var event = p.event;
		var delta = 0;
		if (event.wheelDelta) {
			delta = event.wheelDelta / (_this.wheelPrecision * 40);
		}
		else if (event.detail) {
			delta = -event.detail / _this.wheelPrecision;
		}
		if (delta)
			_this.camera.inertialRadiusOffset += delta;
		if (event.preventDefault) {
			if (!noPreventDefault) {
				event.preventDefault();
			}
		}
	};
	this._observer = this.camera.getScene().onPointerObservable.add(this._wheel, BABYLON.PointerEventTypes.POINTERWHEEL);

	// pointer input
	this._pointerInput = function (p, s) {
		var evt = p.event;
		if (p.type === BABYLON.PointerEventTypes.POINTERDOWN) {
			try {
				evt.srcElement.setPointerCapture(evt.pointerId);
			}
			catch (e) {
			}
			// Manage panning with pan button click
			_this._isPanClick = evt.button === 1; // middle mouse button
			// manage pointers
			cacheSoloPointer = { x: evt.clientX, y: evt.clientY, pointerId: evt.pointerId, type: evt.pointerType };
			if (pointA === undefined) {
				pointA = cacheSoloPointer;
			}
			else if (pointB === undefined) {
				pointB = cacheSoloPointer;
			}
			if (!noPreventDefault) {
				evt.preventDefault();
				element.focus();
			}
		}
		else if (p.type === BABYLON.PointerEventTypes.POINTERUP) {
			try {
				evt.srcElement.releasePointerCapture(evt.pointerId);
			}
			catch (e) {
			}
			cacheSoloPointer = null;
			previousPinchDistance = 0;
			//would be better to use pointers.remove(evt.pointerId) for multitouch gestures, 
			//but emptying completly pointers collection is required to fix a bug on iPhone : 
			//when changing orientation while pinching camera, one pointer stay pressed forever if we don't release all pointers  
			//will be ok to put back pointers.remove(evt.pointerId); when iPhone bug corrected
			pointA = pointB = undefined;
			if (!noPreventDefault) {
				evt.preventDefault();
			}
		}
		else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {
			if (!noPreventDefault) {
				evt.preventDefault();
			}
			console.log(evt.movementX);
			engine.cursor.style.top = evt.clientY+"px";
			engine.cursor.style.left = evt.clientX+"px";
			// One button down
			if (pointA && pointB === undefined) {
				
				// invoke panning when pan click button is pressed
				if (_this.panningSensibility !== 0 && _this._isPanClick) {	
					_this.camera
						.inertialPanningX += -(evt.clientX - cacheSoloPointer.x) / _this.panningSensibility;
					_this.camera
						.inertialPanningY += (evt.clientY - cacheSoloPointer.y) / _this.panningSensibility;
				}
				else {

//							alert( "un-handled event: " + evt.buttons)
				}
				cacheSoloPointer.x = evt.clientX;
				cacheSoloPointer.y = evt.clientY;
			}
			else if (pointA && pointB) {
				/*
				if(  evt.buttons == 6 ) // middle + right
				{
					var offsetX = evt.clientX - cacheSoloPointer.x;
					var offsetY = evt.clientY - cacheSoloPointer.y;
					_this.camera.inertialAlphaOffset -= offsetX / _this.angularSensibilityX;
					_this.camera.inertialBetaOffset -= offsetY / _this.angularSensibilityY;
				}
				
				//if (noPreventDefault) { evt.preventDefault(); } //if pinch gesture, could be useful to force preventDefault to avoid html page scroll/zoom in some mobile browsers
				var ed = (pointA.pointerId === evt.pointerId) ? pointA : pointB;
				ed.x = evt.clientX;
				ed.y = evt.clientY;
				var direction = _this.pinchInwards ? 1 : -1;
				var distX = pointA.x - pointB.x;
				var distY = pointA.y - pointB.y;
				var pinchSquaredDistance = (distX * distX) + (distY * distY);
				
				if (previousPinchDistance === 0) {
					previousPinchDistance = pinchSquaredDistance;
					return;
				}
				if (pinchSquaredDistance !== previousPinchDistance) {
					_this.camera
						.inertialRadiusOffset += (pinchSquaredDistance - previousPinchDistance) /
						(_this.pinchPrecision *
							((_this.angularSensibilityX + _this.angularSensibilityY) / 2) *
							direction);
					previousPinchDistance = pinchSquaredDistance;
				}*/
			}
		}
	};
	this._observer += this.camera.getScene().onPointerObservable.add(this._pointerInput, BABYLON.PointerEventTypes.POINTERDOWN | BABYLON.PointerEventTypes.POINTERUP | BABYLON.PointerEventTypes.POINTERMOVE);

	this._onContextMenu = function (evt) {
		evt.preventDefault();
	};
	if (!this.camera._useCtrlForPanning) {
		element.addEventListener("contextmenu", this._onContextMenu, false);
	}
	this._onLostFocus = function () {
		//this._keys = [];
		pointA = pointB = undefined;
		previousPinchDistance = 0;
		cacheSoloPointer = null;
	};
	this._onMouseMove = function (evt) {
		if (!engine.isPointerLock) {
			return;
		}
		var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
		var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
		_this.camera.inertialAlphaOffset -= offsetX / _this.angularSensibilityX;
		_this.camera.inertialBetaOffset -= offsetY / _this.angularSensibilityY;
		if (!noPreventDefault) {
			evt.preventDefault();
		}
	};
	this._onGestureStart = function (e) {
		if (window.MSGesture === undefined) {
			return;
		}
		if (!_this._MSGestureHandler) {
			_this._MSGestureHandler = new MSGesture();
			_this._MSGestureHandler.target = element;
		}
		_this._MSGestureHandler.addPointer(e.pointerId);
	};
	this._onGesture = function (e) {
		_this.camera.radius *= e.scale;
		if (e.preventDefault) {
			if (!noPreventDefault) {
				e.stopPropagation();
				e.preventDefault();
			}
		}
	};
	element.addEventListener("mousemove", this._onMouseMove, false);
	element.addEventListener("MSPointerDown", this._onGestureStart, false);
	element.addEventListener("MSGestureChange", this._onGesture, false);
	element.addEventListener("keydown", this._onKeyDown, false);
	element.addEventListener("keyup", this._onKeyUp, false);
	BABYLON.Tools.RegisterTopRootEvents([
		{ name: "blur", handler: this._onLostFocus }
	]);
};
MyArcRotateCameraPointersInput.prototype.detachControl = function (element) {
	if (element && this._observer) {
		this.camera.getScene().onPointerObservable.remove(this._observer);
		this._observer = null;
		element.removeEventListener("contextmenu", this._onContextMenu);
		element.removeEventListener("mousemove", this._onMouseMove);
		element.removeEventListener("MSPointerDown", this._onGestureStart);
		element.removeEventListener("MSGestureChange", this._onGesture);
		element.removeEventListener("keydown", this._onKeyDown);
		element.removeEventListener("keyup", this._onKeyUp);
		this._isPanClick = false;
		this.pinchInwards = true;
		this._onKeyDown = null;
		this._onKeyUp = null;
		this._onMouseMove = null;
		this._onGestureStart = null;
		this._onGesture = null;
		this._MSGestureHandler = null;
		this._onLostFocus = null;
		this._onContextMenu = null;
	}
	BABYLON.Tools.UnregisterTopRootEvents([
		{ name: "blur", handler: this._onLostFocus }
	]);
};
MyArcRotateCameraPointersInput.prototype.getTypeName = function () {
	return "MyArcRotateCameraPointersInput";
};
MyArcRotateCameraPointersInput.prototype.getSimpleName = function () {
	return "pointers";
};
__decorate([
	BABYLON.serialize()
], MyArcRotateCameraPointersInput.prototype, "angularSensibilityX", void 0);
__decorate([
	BABYLON.serialize()
], MyArcRotateCameraPointersInput.prototype, "angularSensibilityY", void 0);
__decorate([
	BABYLON.serialize()
], MyArcRotateCameraPointersInput.prototype, "pinchPrecision", void 0);
__decorate([
	BABYLON.serialize()
], MyArcRotateCameraPointersInput.prototype, "panningSensibility", void 0);
return MyArcRotateCameraPointersInput;
})();