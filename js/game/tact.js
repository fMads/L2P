define(['jquery', 'game/options', 'game/note'], function ($, options, Node) {
	var	Tact	= function (type) {
		this.type		= type;
		this.length		= this.type.length;
		this.remaining	= this.length;
		this.nodes		= [];
	}
	Tact.prototype.addNode = function(node) {
		if(this.remaining >= node.length) {
			node.tact	= this;
			this.nodes.push(node);
			this.remaining	-= node.length;
			return true;
		} else {
			return false;
		}
	};
	Tact.prototype.fill = function () {
		while(this.remaining > 0) {
			if(this.remaining % (1/4) === 0) {
				this.addNode(new Node(options.nodes.types.rest.quarter, options.tones.rest));
			} else if(this.remaining % (1/8) === 0) {
				this.addNode(new Node(options.nodes.types.rest.eighth, options.tones.rest));
			} else if(this.remaining % (1/16) === 0) {
				this.addNode(new Node(options.nodes.types.rest.sixteenth, options.tones.rest));
			}
		}
	};
	Tact.prototype.setKeys = function (sharps, flats) {
		var sharps	= $.extend({}, sharps);
		var flats	= $.extend({}, flats);
		this.nodes.forEach(function (node) {
			if(node.type.isRest) {
				return;
			}
			if(node.isRemoveKey) {
				delete sharps[node.tone.name];
				delete flats[node.tone.name];
			} else {
				if(node.isSharp) {
					sharps[node.tone.name.substr(0,1)]	= true;
				}
				if(node.isFlat) {
					flats[node.tone.name.substr(0,1)]	= true;
				}
				if(!node.isSharp && sharps[node.tone.name]) {
					node.tone	= options.tones.names[node.tone.octav][node.tone.name+'#'];
				}
				if(!node.isFlat && flats[node.tone.name]) {
					node.tone	= options.tones.names[node.tone.octav][node.tone.name+'b'];
				}
			}
		});
	}

	return Tact;
});