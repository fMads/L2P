define(['jquery', 'svg', 'game/options', 'fM', 'api', 'l2p', 'game/tick'], function ($, SVGElement, options, fM, api, L2P, Tick) {
	function getImagePath(note, connect, coloredNotes, colorName) {
		var	path		= options.gameImagePath;

		colorName		= colorName	|| '';
		coloredNotes	= coloredNotes || [];

		if(note.isRest) {
			path	+= note.type.name.substr(4, 1).toLowerCase() + note.type.name.substr(5) + 'rest';
		} else if(note.isPeriod) {
			path	+= note.type.name.substr(0, note.type.name.length - 6) + 'note-period';
		} else {
			if(connect) {
				path	+= 'quarternote';
			} else {
				path	+= note.type.name + 'note';
			}
		}

		if(!note.isRest && colorName === '') {
			for(var colorNo = 0; colorNo < coloredNotes.length; colorNo += 1) {
				if(coloredNotes[colorNo].pos <= note.tone.pos) {
					colorName	= coloredNotes[colorNo].color;
					break;
				}
			}
		}

		return path + colorName + options.gameImageType;
	}
	function flipNote(note) {
		note.svgElement.setPos(note.svgElement.getX(), -175 - note.svgElement.getY() + 2 * 4);
		note.svgElement.node.style.webkitTransform	= 'scaleY(-1)';
		note.svgElement.options.flip				= true;
	}
	function unFlipNote(note) {
		note.svgElement.setPos(note.svgElement.getX(), note.svgElement.options.defY);
		note.svgElement.node.style.webkitTransform	= 'scaleY(1)';
		note.svgElement.options.flip				= false;
	}

	var	GameController	= function (svg) {
		var	that	= this;
		this.$this			= $(this);
		this.svg			= svg;
		this.svgBackground	= svg.querySelector('#background');
		this.SVGBackground	= new SVGElement(this.svgBackground);
		this.svgNotes		= svg.querySelector('#notes');
		this.svgNotes		= document.getElementById('svg_container_notes');
		this.gameContainerDiv	= document.getElementById('game_container_div');
		this.pointContainerDiv	= document.createElement('div');
		this.pointContainerDiv.style.width				= '130px';
		this.pointContainerDiv.style.height				= '40px';
		this.pointContainerDiv.style.borderRadius		= '5px';
		this.pointContainerDiv.style.position			= 'absolute';
		this.pointContainerDiv.style.top				= '0';
		this.pointContainerDiv.style.textAlign			= 'center';
		this.pointContainerDiv.style.padding			= '15px 0';
		this.pointContainerDiv.style.webkitTransform	= 'translate3d(145px, 150px, 0)';
		this.SVGNotes		= new SVGElement(this.svgNotes);
		this.svgStart		= svg.querySelector('#start');
		this.SVGStart		= new SVGElement(this.svgStart);
		this.permlink		= '';
		this.sound;
		this.game;
		this.lastPos		= 0;
		this.playSound		= false;
		this.useCountdown	= true;
		this.currentNote;
		this.currentTact;
		this.paused			= false;
		this.lastLeft		= -1;

		$(fM.visibility).on('change', function (e, visibility) {
			if(visibility.hidden) {
				that.stopGame();
			}
		});

		for(var i = 50 + options.lineHeight; i <= 50 + options.lineHeight * 5; i += options.lineHeight) {
			var	g	= new SVGElement('g')
				.appendTo(this.svgBackground);

			g.node.setAttribute('transform', 'translate(0, '+(i + options.topPos)+')');
			new SVGElement('line')
				.setLine(0, 0, '100%', 0)
				.setStroke('#000')
				.appendTo(g);
		}
		new SVGElement('image')
			.setLink('/img/game/g-key.svg')
			.setPos(5, options.topPos + options.lineHeight)
			.setDimensions(63, 190)
			.appendTo(this.svgStart);
		this.svgStartContainer =
			new SVGElement('g')
				.appendTo(this.svgStart);
		var	g	=
			new SVGElement('g')
				.appendTo(this.svgStart);
		g.node.setAttribute('transform', 'translate('+(options.leftMargin + options.markerPos)+', '+(options.topPos + 25 + options.lineHeight)+')');
		this.svgLine =
			new SVGElement('line')
				.setLine(0, 0, 0, options.topPos + 50 + options.lineHeight * 6 - (options.topPos + 25 + options.lineHeight))
				.setStroke('#090', 3)
				.appendTo(g);
		this.svgPointer	=
			new SVGElement('use')
				.setLink('#pointer')
				.setPos(options.leftMargin + options.markerPos, options.topPos + 50 + options.lineHeight * (4 / 2 - 0.5) - 0.85 * options.lineHeight * 0.5 + 1.5)
				.setFill('#090')
				.appendTo(this.svgStart);

		this.setPointerPos(1);

		this.factor;
		this.defWidth;
		this.startPos;
		this.setFactor(1);
	};
	GameController.prototype.showPointBox	= function (points, stepFactor) {
		var	div						= this.pointContainerDiv.cloneNode();
		stepFactor					= stepFactor || L2P.steps[L2P.steps.length - 1];
		div.innerHTML				= stepFactor.text+'<br>'+points+' Points';
		div.style.backgroundColor	= stepFactor.color;
		div.style.webkitTransition	= '1s';
		setTimeout(function () {
			div.style.webkitTransform	= 'translate3d(145px, 100px, 0)';
			div.style.opacity			= '0';
			setTimeout(function () {
				div.remove();
			}, 1000);
		}, 0);

		this.gameContainerDiv.appendChild(div);
	};
	GameController.prototype.setFactor	= function (factor) {
		this.factor		= factor;
		this.defWidth	= 750 * this.factor;
		this.startPos	= options.leftMargin + this.defWidth;
	};
	GameController.prototype.setGame	= function (game) {
		game.controller	= this;
		this.game		= game;
		this.point		= 0;
		this.pointCon	= $('#pointContainer');
		this.currentNote	= undefined;

		// console.log(this.game);
		this.game.reset();

		this.SVGNotes.animateAbs(0, -501, 0);

		// console.log('reset-pos', this.SVGNotes.node.style.webkitTransition, this.SVGNotes.node.style.webkitTransform);
		this.initView();

		this.$this.trigger('gameLoadSpeedChange', this.game.speed);
	};
	GameController.prototype.startGame	= function (nextSong) {
		var	that		= this,
			firstNote;

		if(this.game) {
			this.game.tacts.forEach(function (tact) {
				if(firstNote) {
					return;
				}
				tact.nodes.forEach(function (note) {
					if(firstNote) {
						return;
					}
					if(!note.isRest) {
						firstNote	= note;
					}
				});
			});

			if(this.useCountdown) {
				api.get.lang(function (data) {
					api.get.illustrations(function (illustration) {
						L2P.countdown(L2P_global.countdown_time || 3, data.game_start, that.game.title, illustration.illustration, function () {
							that.game.start();
							that.$this.trigger('gameStart');

							that.runGame();
						});
					}, firstNote.tone.octav, firstNote.tone.name);
				}, ['game_start']);
			} else {
				that.game.start();
				that.$this.trigger('gameStart');

				that.SVGNotes.node.style.webkitTransition	= '';
				that.SVGNotes.node.style.webkitTransform	= '';

				that.runGame();
			}
		}
	};
	GameController.prototype.runGame	= function () {
		var	gameController		= this,
			totalWidth			= this.game.getWidth() - gameController.defWidth / 4,
			totalDuration		= this.game.getDuration(),
			currentLeft			= -this.svgNotes.getClientRects()[0].left,
			relativeDuration	= totalDuration * (totalWidth - currentLeft) / totalWidth,
			pulse				= 60 / gameController.game.speed * 1000;

		gameController.paused	= false;

		gameController.SVGNotes.node.style.width	= (totalWidth + gameController.defWidth / 4)+'px';

		gameController.SVGNotes.animateAbs(-totalWidth, -501, relativeDuration, this.gameDone.bind(this));

		$(gameController.svgLine.node).on('webkitAnimationEnd', function () {
			gameController.svgLine.node.classList.remove('pulse');
		});

		if(L2P_global.metronome && !L2P_global.kiddie_mode) {
			var lastPulse	= Date.now(),
				pulseFunc	= function () {
					if(gameController.game && gameController.game.running) {
						gameController.svgLine.node.classList.add('pulse');

						setTimeout(pulseFunc, pulse - ((Date.now() - lastPulse) % pulse));
					}
				};

			if(currentLeft === 0) {
				setTimeout(function () {
					gameController.svgLine.node.classList.add('pulse');
					lastPulse	= Date.now();
					setTimeout(pulseFunc, pulse);
				}, pulse / 2 + pulse / 10);
			} else {
				gameController.svgLine.node.classList.add('pulse');
				lastPulse	= Date.now();
				setTimeout(pulseFunc, pulse);
			}
		}
	};
	GameController.prototype.pauseGame	= function () {
		if(L2P_global.kiddie_mode) {
			this.SVGNotes.animateAbs(-this.currentLeft() + 30, -501, 0);
		} else {
			this.SVGNotes.animateAbs((-Math.floor(this.currentLeft() / (this.defWidth / 4)) + 0.5) * (this.defWidth / 4) - 20, -501, 0);
		}
		this.paused	= true;
	};
	GameController.prototype.stopGame	= function () {
		if(this.game && this.game.running) {
			this.game.stop();

			this.pauseGame();

			this.$this.trigger('gameStop');
			this.sound.clearSound();
		}
	};
	GameController.prototype.drawSlur	= function (from, to) {
		var	fromPos	= from.svgElement.getAbsolutePos(),
			toPos	= to.svgElement.getAbsolutePos();

		if(from.svgElement.options.flip && !to.svgElement.options.flip) {
			fromPos.yc	= -fromPos.yc - 45;
		}

		var	slur	=
			new SVGElement('path')
				.setPath('M '+(fromPos.xc + options.noteSlurPos.x)+' '+(fromPos.yb + options.noteSlurPos.y)+' q '+((toPos.xc - fromPos.xc) / 2)+' '+options.noteSlurPos.z+' '+(toPos.xc - fromPos.xc)+' '+(toPos.yc - fromPos.yc))
				.setStroke('#000', 2)
				.setFill('none')
				.appendTo(from.tact.svgElement.node);

		if(from.svgElement.options.flip) {
			slur.node.style.webkitTransform			= 'scaleY(-1)';
		}
	};
	GameController.prototype.initView	= function (dontResetPos) {
		var	that		= this,
			game		= this.game,
			tactLeftPos	= 0,
			firstSlur,
			lastSlur,
			svgStartContainerPos	= 0;

		this.svgStartContainer.removeChildNodes();
		options.svgStartContainerPosSharp.forEach(function (toneName) {
			if(game.sharps[toneName]) {
				new SVGElement('text')
					.setInnerText('\u266F', 36, 'bold')
					.setPos(80 + svgStartContainerPos * 15, options.topPos + (options.lineHeight * (5.5 + options.tones.names[5][toneName].pos / 2)) - 2)
					.appendTo(that.svgStartContainer);

				svgStartContainerPos	+= 1;
			}
		});
		options.svgStartContainerPosFlat.forEach(function (toneName, i) {
			if(game.flats[toneName]) {
				new SVGElement('text')
					.setInnerText('\u266D', 36, 'bold')
					.setPos(80 + svgStartContainerPos * 15, options.topPos + (options.lineHeight * (5.5 + options.tones.names[i === 0 || i === 2 ? 4 : 5][toneName].pos / 2)) - 5)
					.appendTo(that.svgStartContainer);

				svgStartContainerPos	+= 1;
			}
		});

		if(dontResetPos !== true) {
			this.SVGNotes.animateAbs(0, -501, 0);
		}
		this.SVGNotes.removeChildNodes();

		var	coloredNotes	= [];
		if(L2P_global.colored_notes) {
			coloredNotes.push({
				pos:	options.tones.names[4]['C#'].pos,
				color:	'-yellow'
			});
			coloredNotes.push({
				pos:	options.tones.names[4]['G#'].pos,
				color:	'-green'
			});
			coloredNotes.push({
				pos:	options.tones.names[5]['D#'].pos,
				color:	'-red'
			});
			coloredNotes.push({
				pos:	-10000,
				color:	'-blue'
			});
		}

		if(this.game) {
			var	lastNote;
			this.game.tacts.forEach(function (tact) {
				var tactWidth	= tact.type.length * that.defWidth,
					tactPos		= that.startPos + tactLeftPos,
					noteLeftPos	= 0,
					lastNote	= null,
					noteTime	= 0,
					connections	= [];

				tactLeftPos	+= tactWidth;

				tact.svgElement	= new SVGElement('g').appendTo(that.svgNotes);
				new SVGElement('line')
					.setLine(tactPos, 75 + options.topPos, tactPos, options.lineHeight * 6 + 25 + options.topPos)
					.setStroke('#000', 2)
					.appendTo(tact.svgElement.node);

				tact.nodes.forEach(function (note) {
					var noteWidth	= note.type.length * that.defWidth,
						notePos		= tactPos + that.defWidth / 16 + noteLeftPos - 20,
						tonePos 	= (note.tone.pos + 11) * options.lineHeight / 2 + 4,
						connect		= false;

					noteTime	+= note.type.length;

					noteLeftPos	+= noteWidth;
					svgElement	= null;

					if(note.type.img) {
						if(note.length <= 1/8 && !note.isRest) {
							connections.push(note);
						}

						note.svgElement	= new SVGElement(options.gameImageNodeType)
											.setRef(note)
											.setLink('/'+getImagePath(note, connect, coloredNotes, note.isFocus ? '-green' : ''))
											.setPos(notePos, tonePos)
											.setDimensions(50, 100)
											.appendTo(tact.svgElement.node);

						note.svgElement.options.defY	= tonePos;

						if(note.isSharp || note.isFlat || note.isRemoveKey) {
							var	text	= '',
								y		= 95;
							if(note.isSharp) {
								text	= '\u266F';
							} else if(note.isFlat) {
								text	= '\u266D';
								y		= 90;
							} else if(note.isRemoveKey) {
								text	= '\u266E';
							}
							new SVGElement('text')
								.setInnerText(text, 36, 'bold')
								.setPos(notePos - 25, tonePos + y)
								.appendTo(tact.svgElement.node);
						}
						if(note.isPeriod) {
							new	SVGElement('circle')
								.setCircle(notePos + 25 + 10, tonePos + 90 - 8, 3)
								.appendTo(tact.svgElement.node);
								/*
							new SVGElement('text')
								.setInnerText('◘', 36, 'bold')
								.setPos(notePos + 25, tonePos + 90)
								.appendTo(tact.svgElement.node);*/
						}

						if(note.tone.pos <= 0) {
							flipNote(note);
						}

						var	extraLine;
						for(extraLine = -6; extraLine >= note.tone.pos; extraLine -= 2) {
							var	y	= options.topPos + (extraLine / 2 + 5) * options.lineHeight;
							new SVGElement('line')
								.setLine(notePos - 5, y, notePos + 32, y)
								.setStroke('#000')
								.appendTo(tact.svgElement.node)
						}
						for(extraLine = 6; extraLine <= note.tone.pos; extraLine += 2) {
							var	y	= options.topPos + (extraLine / 2 + 5) * options.lineHeight;
							new SVGElement('line')
								.setLine(notePos - 5, y, notePos + 32, y)
								.setStroke('#000')
								.appendTo(tact.svgElement.node)
						}
					}
					if(note.isSlur) {
						lastSlur	= note;
					} else {
						if(lastSlur) {
							that.drawSlur(firstSlur, lastSlur);
							lastSlur	= null;
						}
						firstSlur	= note;
					}

					while(noteTime >= 1/4) {
						if(connections.length > 1) {
							(function (connections) {
								var	first	= connections[0],
									last	= connections[connections.length - 1],
									flip	= first.svgElement.options.flip;

								connections.forEach(function (note) {
									note.svgElement.setLink('/'+getImagePath(note, true, coloredNotes, note.isFocus ? '-green' : ''));
									if(note !== first) {
										if(flip && !note.svgElement.options.flip) {
											flipNote(note);
										} else if(!flip && note.svgElement.options.flip) {
											unFlipNote(note);
										}
									}
								});

								var	y1		= first.svgElement.options.defY + 11 + (flip ? 147 : 0),
									y2		= last.svgElement.options.defY + 11 + (flip ? 147 : 0),
									x		= last.length - first.length,
									a		= (y2 - y1) / x,
									moveY	= 0;

								if(connections.length > 2) {
									var	notePos		= 0 - first.length;
									connections.forEach(function (note) {
										var	realY	= note.svgElement.options.defY + 11 + (flip ? 147 : 0),
											diffY	= y1 - realY;

										if(flip && diffY < 0 && diffY < -moveY) {
											moveY	= -diffY;
										} else if(!flip && diffY > 0 && diffY > -moveY) {
											moveY	= -diffY;
										}

										notePos	+= note.length;
									});

									connections.forEach(function (note) {
										if(note.svgElement.getY() !== y1 + moveY) {
											new SVGElement('line')
												.setLine(note.svgElement.getX() + 25, note.svgElement.options.defY + 11 + (flip ? 147 : 0), note.svgElement.getX() + 25, y1 + moveY)
												.setStroke('#000', 2)
												.appendTo(tact.svgElement.node);
										}
									});

									y2	= y1;
								}

								var	lastNote	= null;
								connections.forEach(function (note) {
									if(lastNote) {
										if(lastNote.length === 1/16 && note.length === 1/16) {
											new	SVGElement('line')
												.setRef(connections)
												.setLine(lastNote.svgElement.getX() + 24, y1 + moveY + (flip ? -10 : +10), note.svgElement.getX() + 26, y2 + moveY + (flip ? -10 : +10))
												.setStroke('#000', 5)
												.appendTo(tact.svgElement.node);
										}
										new	SVGElement('line')
											.setRef(connections)
											.setLine(lastNote.svgElement.getX() + 24, y1 + moveY, note.svgElement.getX() + 26, y2 + moveY)
											.setStroke('#000', 5)
											.appendTo(tact.svgElement.node);
									}
									lastNote	= note;
								});
							}(connections));
						}
						connections	= [];
						noteTime	-= 1/4;
					}
				});
			});
		}

		var	gameController		= this,
			totalWidth			= gameController.game.getWidth() - gameController.defWidth / 4;

		gameController.SVGNotes.node.style.width	= (totalWidth + gameController.defWidth / 4)+'px';
	};
	GameController.prototype.playNote	= function (note) {
		note.hasPlayed	= true;
		if(note.type.isRest) {
			this.sound.playRest();
		} else if(this.sound) {
			this.sound.play(note.tone.hz, note.isSlur);
		}
	};
	GameController.prototype.setGameSpeed	= function (speed) {
		if(this.game) {
			this.game.setSpeed(speed);
		}
	};
	GameController.prototype.importGame	= function (gameInfo, title, defaultOctave) {
		var	that	= this;

		require(['game/game', 'game/tact', 'game/note', 'game/options'], function (Game, Tact, Node, options) {
			var game        = new Game(gameInfo[0]),
				octave		= defaultOctave || gameInfo[1][0];

			game.title			= title;
			game.startOctave	= octave;

			if(gameInfo[3]) {
				gameInfo[3].forEach(function (toneName) {
					game.setSharp(toneName);
				});
			}
			if(gameInfo[4]) {
				gameInfo[4].forEach(function (toneName) {
					game.setFlat(toneName);
				});
			}

			function findInObject(obj, id) {
				var valud;
				for(name in obj) {
					value = obj[name];
					if(value.id === id) {
						return value;
					}
				}
			}

			function createNote(id, octave, nodeName, isRemoveKey, isSlur) {
				return new Node(findInObject(options.nodes.types, id), options.tones.names[octave][nodeName], isRemoveKey === 1 ? true : false, isSlur === 1 ? true : false);
			}
			function createRest(id) {
				return new Node(findInObject(options.nodes.types.rest, id), options.tones.rest);
			}
			function applyTact(id, notes) {
				var tact    = new Tact(findInObject(options.tacts.types, id));

				notes.forEach(function (noteInfo) {
					if(!noteInfo[1]) {
						tact.addNode(createRest(noteInfo[0]));
					} else {
						tact.addNode(createNote(noteInfo[0], noteInfo[2] + octave, noteInfo[1], noteInfo[3], noteInfo[4]));
					}
				});

				game.addTact(tact);

				return;
			}

			gameInfo[2].forEach(function (tact) {
				applyTact(tact[0], tact[1]);
			});

			that.setGame(game);
		});
	};
	GameController.prototype.exportGame	= function () {
		var ex = [
			this.game.speed,
			[],
			[],
			[]
		];

		for(var toneName in this.game.sharps) {
			ex[2].push(toneName);
		}
		for(var toneName in this.game.flats) {
			ex[3].push(toneName);
		}

		this.game.tacts.forEach(function (tact) {
			var exTact = [
				tact.type.id,
				[]
			];
			tact.nodes.forEach(function (node) {
				var exNode  = [
					node.type.id,
					node.tone.name,
					node.tone.octav,
					node.isRemoveKey ? 1 : 0,
					node.isSlur ? 1: 0
				];
				exTact[1].push(exNode);
			});
			ex[1].push(exTact);
		});

		return ex;
	};
	GameController.prototype.getTactX	= function (tact, callback) {
		var	gameController	= this,
			tacts			= gameController.game.tacts;

		require(['game/tact', 'game/options'], function (Tact, options) {
			var	i	= tact instanceof Tact ? tacts.indexOf(tact) : tact,
				x	= gameController.defWidth;

			x	-= options.markerPos;

			for(var j = 0; j < i; j += 1) {
				x	+= gameController.defWidth * tacts[j].length;
			}

			callback(x);
		});
	};
	GameController.prototype.getNoteX	= function (note, callback) {
		var	gameController	= this,
			tact			= note.tact;

		require(['game/note', 'game/options'], function (Note, options) {
			var	i	= tact.nodes.indexOf(note),
				x	= 0;

			for(var j = 0; j < i; j += 1) {
				x	+= gameController.defWidth * tact.nodes[j].length;
			}

			callback(x);
		});
	};
	GameController.prototype.moveToTact	= function (tact) {
		var	gameController	= this;

		if(tact === -1) {
			gameController.SVGNotes.animateAbs(0, -501, 0);
		} else {
			gameController.getTactX(tact, function (x) {
				gameController.SVGNotes.animateAbs(-x, -501, 0);
			});
		}
	};
	GameController.prototype.moveToNote	= function (note) {
		var	gameController	= this;

		gameController.getNoteX(note, function (noteX) {
			gameController.getTactX(note.tact, function (tactX) {
				gameController.SVGNotes.animateAbs(-(noteX + tactX), -501, 0);
			});
		});
	};
	GameController.prototype.isRunning	= function () {
		return this.game && this.game.running;
	};
	GameController.prototype.setPointerPos = function (pos) {
		this.svgPointer
			.setPos(options.leftMargin + options.markerPos, options.topPos + 50 + options.lineHeight * (pos / 2 + 3) - 0.85 * options.lineHeight * 0.5 + 1.5);
	};
	GameController.prototype.generatePercentColor	= function (colorPercent) {
		var	colorGreen	= 0,
			colorRed	= 0,
			colorBlue	= 0;

		if(colorPercent <= 0.15) {
			colorGreen	= Math.round(200 - 60 * colorPercent/0.15);
		} else if(colorPercent <= 0.95) {
			colorGreen	= Math.round(240 - 70 * (colorPercent - 0.15)/(0.95-0.15));
			colorRed	= Math.round(240 - 70 * (colorPercent - 0.15)/(0.95-0.15));
		} else {
			colorRed	= 170;
		}
		return 'rgb('+colorRed+', '+colorGreen+', '+colorBlue+')';
	};
	GameController.prototype.tactDone	= function () {
		if(this.currentTact) {
			this.currentTact.calculatePoints(this, L2P.funcs.tones.getStepFactor);

			this.point	+= this.currentTact.points;
			this.pointCon.text(this.point);
			this.showPointBox(this.currentTact.points, this.currentTact.stepFactor);
		}
	};
	GameController.prototype.currentLeft	= function () {
		var	gameController	= this,
			left			= -gameController.svgNotes.getBoundingClientRect().left + 45,
			useLeft			= left,
			timeRunning,
			factor;

		if(left === gameController.lastLeft && !gameController.paused) {
			timeRunning	= Date.now() - gameController.game.startTime;
			factor		= timeRunning / (gameController.game.getDuration() * 1000);
			//useLeft		= gameController.game.getWidth() * factor + 2;
		}
		gameController.lastLeft	= left;

		return useLeft;
	};
	GameController.prototype.soundInput = function (e, freq, tone, diff) {
		var	that			= this,
			gameController	= this,
			ratio;

		if(this.game && this.game.running) {
			var	newPos	= gameController.currentLeft();

			this.game.tacts.forEach(function (tact) {
				if(tact.hasPlayed) {
					return;
				}
				tact.nodes.forEach(function (note) {
					var	relWidth		= (750 / 4) * (gameController.game.speed / 60) * 0.1,

						noteLeftPos		= note.svgElement.getX() - newPos + 20,
						noteLeftPosRel	= noteLeftPos + relWidth,

						noteRightPos	= noteLeftPos + note.type.length * that.defWidth,
						noteRightPosRel	= noteLeftPosRel + note.type.length * that.defWidth,

						currentPos		= options.markerPos + options.leftMargin + 10,
						relNotePosLeft	= currentPos - noteLeftPosRel,
						relNotePosRight	= noteRightPosRel - currentPos,

						otherNote;

					// Play the current note
					if(noteLeftPos <= currentPos && noteRightPos > currentPos) {
						if(!note.hasPlayed && gameController.playSound) {
							that.playNote(note);
						}
					}

					// Check the current note + the relative width
					if(noteLeftPosRel <= currentPos && noteRightPosRel > currentPos) {
						// We check weither we can use the note before or after
						var	noteIndex	= note.tact.nodes.indexOf(note),
							tactIndex,
							otherTact;

						if(relNotePosLeft < relWidth * 2) {
							if(noteIndex === 0) {
								tactIndex	= gameController.game.tacts.indexOf(note.tact);
								if(tactIndex > 0) {
									otherTact	= gameController.game.tacts[tactIndex - 1];
									otherNote	= otherTact.nodes[otherTact.nodes.length - 1];
								}
							} else {
								otherNote	= note.tact.nodes[noteIndex - 1];
							}
						} else if(relNotePosRight < relWidth * 2) {
							if(noteIndex === note.tact.nodes.length - 1) {
								tactIndex	= gameController.game.tacts.indexOf(note.tact);
								if(tactIndex < gameController.game.tacts.length - 1) {
									otherTact	= gameController.game.tacts[tactIndex + 1];
									otherNote	= otherTact.nodes[0];
								}
							} else {
								otherNote	= note.tact.nodes[noteIndex + 1];
							}
						}
						if(otherNote) {
							if(otherNote.isRest) {
								otherNote	= undefined;
							} else {
								if(otherNote.tone === tone) {
									note	= otherNote;
								}
							}
						}

						// If we got to a new note
						if(that.currentNote !== note) {
							if(!L2P_global.kiddie_mode && that.currentTact !== note.tact) {
								gameController.tactDone();
							}
							that.currentNote	= note;
							that.currentTact	= tact;
						}

						// Find the closest tone
						var	closeTone	= L2P.funcs.tones.getCloseTone(freq, tone, note.tone);
						freq		= closeTone.freq;
						tone		= closeTone.tone;
						toneDiff	= L2P.funcs.tones.freqDiffToTone(note.tone, freq, 0);

						// Update the compass
						if(that.compass) {
							that.compass.setTone(note.tone);
							that.compass.setFreq(freq);
						}

						// If we have kiddiemode enabled, we check for the correct tone
						if(L2P_global.kiddie_mode) {
							if(!note.isRest && (toneDiff.ratioRel > 0.15 || freq === -1) && !note.kiddieModeAccepted) {
								if(!gameController.paused) {
									gameController.pauseGame();
								}
								return;
							} else if(gameController.paused) {
								gameController.runGame();
							}
							note.kiddieModeAccepted	= true;
						}

						// Add the tick
						if(!note.isRest) {
							note.ticks.push(new Tick(freq, toneDiff));
						}

						var	colorPercent	= note.isRest ? 0 : Math.min(toneDiff.ratioRel, 1),
							color			= that.generatePercentColor(colorPercent);

						that.svgPointer.setFill(color);
						that.svgLine.setStroke(color, 3);
					}
				});
			});
		} else {
			this.compass.setTone(tone);
			this.compass.setFreq(freq);
		}

		if(tone) {
			var	pos	= options.tones.all.indexOf(tone);
			if(pos === -1) {
				return;
			}
			if(diff > 0) {
				var	toneAbove	= options.tones.all[pos + 1],
					toneDiffs	= Math.abs(toneAbove.hz - tone.hz);
				if(toneDiffs === 0) {
					toneAbove	= options.tones.all[pos + 2];
					toneDiffs	= Math.abs(toneAbove.hz - tone.hz);
				}
				var	ratio		= diff / toneDiffs;
			} else {
				var	toneAbove	= options.tones.all[pos - 1],
					toneDiffs	= Math.abs(toneAbove.hz - tone.hz);
				if(toneDiffs === 0) {
					toneAbove	= options.tones.all[pos - 2];
					toneDiffs	= Math.abs(toneAbove.hz - tone.hz);
				}
				var	ratio		= diff / toneDiffs;
			}

			that.setPointerPos(tone.pos - ratio);
		}
	};
	GameController.prototype.expectedTone	= function () {
		return this.currentNote && this.currentNote.tone;
	};
	GameController.prototype.generateGameData	= function () {
		var	data	= [
			1.1,					// 0	_v
			this.game.speed,		// 1	speed
			[],						// 2	tacts
			this.point,				// 3	points
			[						// 4	time
				this.game.startTime,						// 0	start
				this.game.stopTime -this.game.startTime,	// 1	stop
				this.game.getDuration()						// 2	game duration
			],
			this.permlink,			// 5	permlink
			this.game.startOctave	// 6	startOctave
		];

		this.game.tacts.forEach(function (tact) {
			var	tactData	= [
				[]		// notes
			];
			tact.nodes.forEach(function (note) {
				var	noteData	= [
					[],					// 0	ticks
					note.stepFactor,	// 1	stepFactor
					note.points,		// 2	points
					note.tone.name,		// 3	toneName
					note.tone.octav		// 4	toneOctav
				];
				note.ticks.forEach(function (tick) {
					var	tickData	= [
						tick.percent,			// 0	percent
						+tick.freq.toFixed(2),	// 1	freq
						tick.time - data[4][0]	// 2	time
					];
					noteData[0].push(tickData);
				});
				tactData[0].push(noteData);
			});

			data[2].push(JSON.stringify(tactData));
		});

		// console.log(data);

		return JSON.stringify(data);
	};
	GameController.prototype.gameDone	= function () {
		if(!L2P_global.kiddie_mode && this.currentTact) {
			this.tactDone();
		}

		this.stopGame();

		if(L2P_global.kiddie_mode) {
			return;
		}
		var	data	= this.generateGameData(),
			that	= this;
		$.post('/api/save.game.php', {
			data:	data
		}, function (gameInfo) {
			that.$this.trigger('gameEnd', {
				game_history_id:	gameInfo.game_history_id
			});
		});
	};

	return GameController;
});