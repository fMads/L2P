<?php
// Always have access to config file
require_once($_SERVER['DOCUMENT_ROOT'].'/include/config.php');
function SaveTitle($strLang, $iGameID, $strTitle)
{
    global $oSql;

    $oSql->Insert('games_titles', array('lang' => $strLang, 'game_id' => $iGameID, 'title' => $strTitle));   
}

if(!empty($_POST))
{
    SaveTitle('da-DK', $_POST['GameID'], $_POST['da-DK']);
    SaveTitle('en-US', $_POST['GameID'], $_POST['en-US']);

    header('location: /manipulate-games.php');
    exit;
}

// Fetch games which hasn't received a multilanguage title yet
$rUntitledSongs = $oSql->Select('
    SELECT
        *
    FROM
        games
    WHERE
        games.deleted = 0
     && games.id NOT IN(
        SELECT
            games_titles.game_id
        FROM
            games_titles
     )
');

$oUntitledSong = mysqli_fetch_object($rUntitledSongs);
echo '
'.$oUntitledSong->title.':
<form action="" method="post">
<input type="hidden" name="GameID" value="'.$oUntitledSong->id.'" />
<table border="0" cellspacing="0" cellpadding="8">
<tr>
    <td>dk-DK</td>
    <td><input type="text" name="da-DK" value="" autofocus /></td>
</tr>
<tr>
    <td>en-US</td>
    <td><input type="text" name="en-US" value="'.$oUntitledSong->title.'" /></td>
</tr>
<tr>
    <td>&nbsp;</td>
    <td><input type="submit" value="LEEEEEEROOOOOOOY (jenkins)" /></td>
</tr>
</table>
';
exit;
// Fetch all scales
$rScales = $oSql->Select('
    SELECT
        *
    FROM
        games
    WHERE
        deleted = 0
     && type = "scale"
');

while($oScales = mysqli_fetch_object($rScales))
{
    $arrGame = json_decode($oScales->game);
    $arrNewGame = array(80, $arrGame[1]);

    $bGive = true;
    $arrContainer = array();
    $arrTactsCont = array();
    $iLoopNo = 0;
    foreach($arrGame[2] as $arrTacts)
    {
        foreach($arrTacts[1] as $arrNote)
        {
            $arrNote[0] = 2;
            if(count($arrContainer) == 0)
            {
                $arrContainer[] = $arrNote;
            }
            else
            {
                $arrContainer[] = $arrNote;
                $arrTactsCont[] = array(
                    1,
                    $arrContainer
                );
                $arrContainer = array();
            }
        }
    }
    if(count($arrContainer) > 0)
    {
        $arrContainer[] = array(4, null, null,0,0);
        $arrContainer[] = array(4, null, null,0,0);
        $arrTactsCont[] = array(
            1,
            $arrContainer
        );
    }
    $arrNewGame[] = $arrTactsCont;
    $arrNewGame[] = $arrGame[3];
    $arrNewGame[] = $arrGame[4];

    $strGame = json_encode($arrNewGame);

    $oSql->Update('games', array('game' => $strGame), $oScales->id);
}

exit;
$rNumbers = $oSql->Select('
	SELECT
		id,
		game,
		type,
		octave
	FROM
		games
	WHERE
		deleted = 0
');

while($oNumbers = mysqli_fetch_object($rNumbers))
{
	$iID = $oNumbers->id;
	$strGame = $oNumbers->game;

	// Manipulate game
	$arrGame = json_decode($strGame);

	// Now find the first octave we meet and make this our main octave
	$iOctave = 0;
	foreach($arrGame[1] as $iEntry => $arrTact)
	{
		foreach($arrTact as $iTactEntry => $arrNotes)
		{
			(array)$arrNotes;
			foreach($arrNotes as $iNoteEntry => $arrNoteSettings)
			{
				if($arrNoteSettings[2] > 0)
				{
					$iOctave = $arrNoteSettings[2];
					break;
				}
			}
			if($iOctave > 0)
			{
				break;
			}
		}
		if($iOctave > 0)
		{
			break;
		}
	} // And that's how we find an apropriate octave bitches!

	// Now run through all of the tacts and substract the octave we found from the actual octave of the particular note
	if($iOctave > 0)
	{
		foreach($arrGame[1] as $iEntry => $arrTact)
		{
			foreach($arrTact as $iTactEntry => $arrNotes)
			{
				if(count($arrNotes) > 0)
				{
					foreach($arrNotes as $iNoteEntry => $arrNoteSettings)
					{
						if($arrNoteSettings[2] != 0 && $arrNoteSettings[2] != 0)
						{
							$arrGame[1][$iEntry][$iTactEntry][$iNoteEntry][2] = ($arrGame[1][$iEntry][$iTactEntry][$iNoteEntry][2] - $iOctave);
						}
					}
				}
			}
		}
	}

	// Splice the octave into the game :)
	array_splice($arrGame, 1, 0, $iOctave);

 	$arrGame[1] = array(0 => $arrGame[1]);
	$strJsonGameString = $oSql->RealEscape(json_encode($arrGame));

	$oSql->Update('games', array('game' => $strJsonGameString), $iID);
}
?>
