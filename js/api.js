define(['jquery'], function ($) {
	var systemFolder    = '';

	function _apiGetter( url, data ) {
		function then( func ) {
			$.get(systemFolder + '/api/get.' + url, data, func);
		}
		return {
			then:    then
		};
	}
	function _apiSetter( url, data, cache ) {
		function then( func ) {
			$.ajax({
				url:    systemFolder + '/api/save.' + url,
				type:   'post',
				cache:  cache || false,
				data:   data,
				success:func
			});
		}
		return {
			then:    then
		};
	}
	var get = {
		games:  function ( callback ) {
			new _apiGetter( 'games.php', {

			})
			.then( function ( data ) {
				if( callback ) {
					callback( data );
				}
			});
		},
		game_info:	function ( callback, permlink, octave ) {
			new	_apiGetter( 'game.info.php', {
				permlink:	permlink,
				octave:		octave
			})
			.then( function ( data ) {
				if( callback ) {
					callback( data );
				}
			});
		},
		lang:	function ( callback, keys ) {
			new	_apiGetter( 'lang.php', {
				keys:	keys
			})
			.then( function ( data ) {
				if( callback ) {
					callback( data );
				}
			});
		},
		statistic_uuid:	function ( callback, search ) {
			new _apiGetter( 'statistic.search.uuid.php', {
				search:	search
			})
			.then( function ( data ) {
				if( callback ) {
					callback( data );
				}
			});
		},
		illustrations:	function ( callback, octave, tone_name ) {
			new	_apiGetter( 'illustrations.php', {
				octave:		octave,
				note_name:	tone_name
			})
			.then( function ( data ) {
				if( callback ) {
					callback( data );
				}
			});
		},
		game_generation_duration:	function ( callback, data ) {
			new	_apiGetter( 'game.generation.duration.php', data )
			.then( function ( data ) {
				if( callback ) {
					callback( data );
				}
			});
		}
	};

	var save = {
		playlist:	function ( playlist_id, playlist_name, games, callback ) {
			new	_apiSetter( 'playlist.php', {
				playlist_id:	playlist_id,
				playlist_name:	playlist_name,
				games:			games
			})
			.then( function ( data ) {
				if( callback ) {
					callback( data );
				}
			});
		}
	};

	return  {
		get:    get,
		save:   save
	};
});