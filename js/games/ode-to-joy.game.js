require(['fragments/game', 'game/game', 'game/tact', 'game/note', 'game/options'], function (gameController, Game, Tact, Node, options) {
	var game = new Game(80);

	function createNote(type, octave, nodeName) {
		return new Node(options.nodes.types[type], options.tones.names[octave][nodeName]);
	}
	function createRest(type) {
		return new Node(options.nodes.types.rest[type], options.tones.rest);
	}
	function applyTact(game, nodes) {
		var tact	= new Tact(options.tacts.types.quarter);

		nodes.forEach(function(node) {
			tact.addNode(node);
		})

		game.addTact(tact);

		return;
	}

	applyTact(game, [
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "G"),
		createNote("quarter", 4, "A")
	]);

	applyTact(game, [
		createNote("quarter", 4, "A"),
		createNote("quarter", 4, "G"),
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "E")
	]);

	applyTact(game, [
		createNote("quarter", 4, "D"),
		createNote("quarter", 4, "D"),
		createNote("quarter", 4, "E"),
		createNote("quarter", 4, "F")
	]);

	applyTact(game, [
		createNote("quarter", 4, "F"),
		createNote("eighth", 4, "E"),
		createNote("half", 4, "E"),
		createRest("eighth")
	]);

	applyTact(game, [
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "G"),
		createNote("quarter", 4, "A")
	]);

	applyTact(game, [
		createNote("quarter", 4, "A"),
		createNote("quarter", 4, "G"),
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "E")
	]);

	applyTact(game, [
		createNote("quarter", 4, "D"),
		createNote("quarter", 4, "D"),
		createNote("quarter", 4, "E"),
		createNote("quarter", 4, "F")
	]);

	applyTact(game, [
		createNote("quarter", 4, "E"),
		createNote("eighth", 4, "D"),
		createNote("half", 4, "D"),
		createRest("eighth")
	]);

	applyTact(game, [
		createNote("quarter", 4, "E"),
		createNote("quarter", 4, "E"),
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "D")
	]);

	applyTact(game, [
		createNote("quarter", 4, "E"),
		createNote("eighth", 4, "F"),
		createNote("eighth", 4, "G"),
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "D")
	]);

	applyTact(game, [
		createNote("quarter", 4, "E"),
		createNote("eighth", 4, "F"),
		createNote("eighth", 4, "G"),
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "E")
	]);

	applyTact(game, [
		createNote("quarter", 4, "D"),
		createNote("quarter", 4, "E"),
		createNote("quarter", 3, "A"),
		createNote("quarter", 4, "F")
	]);

	applyTact(game, [
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "G"),
		createNote("quarter", 4, "A")
	]);

	applyTact(game, [
		createNote("quarter", 4, "A"),
		createNote("quarter", 4, "G"),
		createNote("quarter", 4, "F"),
		createNote("quarter", 4, "E")
	]);

	applyTact(game, [
		createNote("quarter", 4, "D"),
		createNote("quarter", 4, "D"),
		createNote("quarter", 4, "E"),
		createNote("quarter", 4, "F")
	]);

	applyTact(game, [
		createNote("quarter", 4, "E"),
		createNote("eighth", 4, "D"),
		createNote("half", 4, "D"),
		createRest("quarter")
	]);

	gameController.setGame(game);
});