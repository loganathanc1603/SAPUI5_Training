sap.ui.define([
	"sap/m/Button"
], function (Button, InfoLabel) {
	"use strict";
	return Button.extend("com.ui5.SAPUI5_Session.customControl.ButtonExt", {
		metadata: {
			events: {
				"hover": {}, // this Button has also a "hover" event, in addition to "press" of the normal Button
				"ondblclick": {},
				"onmousedown": {}
			}
		},

		onmouseover: function (evt) { // is called when the Button is hovered - no event registration required
			this.fireHover();
		},

		ondblclick: function (evt) {
			this.fireOndblclick();
		},

		onmousedown: function (evt) {
			this.fireOnmousedown();
		},

		renderer: sap.m.Button.prototype.getRenderer()
	});
});