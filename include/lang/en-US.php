<?php
$this
# System
->SetMenu('system_')
->Set('title_welcome', 'Welcome to Magic Tune')

# Global
->SetMenu('global_')
->Set('button_save', 'Save')
->Set('button_close', 'Close')
->Set('select', ' -- Select --')
->Set('point', 'Point')
->Set('points', 'Points')
->Set('save', 'Save')
->Set('play', 'Play')
->Set('play_again', 'Play again')
->Set('pause', 'Pause')
->Set('delete', 'Delete')
->Set('new', 'New')
->Set('last', 'Last')
->Set('octave', 'Octave')
->Set('closed_preview', 'Closed Preview')
->Set('refresh', 'Refresh')

# Validation Errors
->SetMenu('validation_')
->Set('username', 'Your password has to be between 2 and 16 chracters. It may only contain a-w, A-W, 0,9, -_')
->Set('password', 'At least 6 characters of which at least one should be numeric')
->Set('email', 'Please write a correct e-mail address')

# Time
->SetMenu('time_')
->Set('day', 'day')
->Set('days', 'days')
->Set('hour', 'hour')
->Set('hours', 'hours')
->Set('minute', 'minute')
->Set('minutes', 'minutes')
->Set('second', 'second')
->Set('seconds', 'seconds')
->Set('less_than_minute', 'Less than a minute ago')
->Set('few_minutes', 'A few minutes ago')
->Set('about_an_hour', 'Abour an hour ago')
->Set('yesterday', 'Yesterday')
->Set('more_than_a_year', 'More than a year ago')
->Set('ago', 'ago')
->Set('date', 'Date')
->Set('monday', 'monday')
->Set('tuesday', 'tuesday')
->Set('wednesday', 'wednesday')
->Set('thursday', 'thursday')
->Set('friday', 'friday')
->Set('saturday', 'saturday')
->Set('sunday', 'sunday')
->Set('january', 'january')
->Set('febuary', 'febuary')
->Set('march', 'march')
->Set('april', 'april')
->Set('may', 'may')
->Set('june', 'june')
->Set('july', 'july')
->Set('august', 'august')
->Set('september', 'september')
->Set('october', 'october')
->Set('november', 'november')
->Set('december', 'december')

# Login
->SetMenu('login_')
->Set('username', 'Username')
->Set('password', 'Password')
->Set('validation_attempts_exceeded', 'you typed your credentials incorrect #login_attempts# times. Your account are blocked for #block_time#')
->Set('validation_incorrect_login', 'Username and password didn\'t match anything, try again')

# Frontpage
->SetMenu('frontpage_')
->Set('choose_song', 'Choose song')
->Set('choose_scale', 'Choose scale')
->Set('login', 'Login')
->Set('edit', 'Edit user')
->Set('create_user', 'Create user')
->Set('locked_song_login', 'Create a free and gain access to alot of free songs')
->Set('locked_song_purchase', 'Click on this song to purchase it')
->Set('add_to_playlist', 'Add to playlist')
->Set('view_all', 'View all')
->Set('view_all_songs_title', 'Open entire songlist')
->Set('view_all_scales_title', 'Open entire scalelist')
->Set('user_logout', 'Logout')
->Set('user_statistics', 'Statistics')
->Set('user_settings', 'Settings')
->Set('user_subscription', 'Subscription')

# Browse
->SetMenu('browse_')
->Set('headline_songs', 'Browse songs')
->Set('headline_scales', 'Browse scales')
->Set('search_title', 'Title')
->Set('playlist_save', 'Save playlist')
->Set('playlist_play', 'Play playlist')
->Set('playlist_add', 'New playlist')
->Set('start_position', 'Start Position')
->Set('loops', 'Loops')
->Set('my_playlist', 'My playlist')

# Create user
->SetMenu('create_user_')
->Set('headline', 'Create user')
->Set('submit', 'Create')
->Set('username', 'Username')
->Set('email', 'E-mail')
->Set('language', 'Choose language')
->Set('repeat_email', 'Repeat e-mail')
->Set('password', 'Password')
->Set('repeat_password', 'Repeat password')
->Set('validation_username_unavailable', 'The chosen username is not available')
->Set('validation_emails_mismatch', 'The e-mail addresses does not match')
->Set('validation_email_unavailable', 'The chosen e-mail address is not')
->Set('validation_passwords_mismatch', 'The passwords does not match')
->Set('confirmation_mail_headline', 'Welcome to')
->Set('confirmation_mail', '
    Hello #username#, <br /><br />
    Welcome to #system# :) <br /><br />
    In order to login, you will have to confirm this e-mail address. <br /><br />
    First time you login to #system# you will be asked for a activation-key.<br />
    You can confirm your mail directly via this link:<br />
    #confirmation_anchortag#<br /><br />
    Activationkey: #activationkey#<br />
    Username: #username# <br />
    Password: #password# <br /><br />
    Hav fun being awesome on #system# ;)<br /><br />
    #system# Team
')

# Handle user
->SetMenu('handle_user_')
->Set('headline', 'Edit user')
->Set('first_name', 'Fornavn')
->Set('last_name', 'Efternavn')
->Set('validation_first_name', 'Your first name may not contain more than 20 characters and it may only contain letters')
->Set('validation_last_name', 'Your last may not contain more than 30 characters and it may only contain letters')

# User settings
->SetMenu('user_settings_')
->Set('concert_pitch', 'Concert pitch')
->Set('color_notes', 'Colored notes')
->Set('kiddie_mode', 'Kiddie mode')
->Set('validation_concert_pitch', 'Concert pitch must be numeric')
->Set('countdown_time', 'Gamestart countdown')
->Set('metronome', 'Metronome')

# Activate user
->SetMenu('activate_')
->Set('headline', 'Confirm e-mail #email#')
->Set('submit', 'Activate')
->Set('activationkey', 'Activationkey')
->Set('validation_activationkey', 'Please type the activation key you\'ve recieved via e-mail')
->Set('validation_activationerror', 'An error has occured, please close this window and try to login again')
->Set('validation_newkeysent', 'You\'ve typed in an incorrect activationkey too many times, therefor we\'ve sent a new activationkey to your account')
->Set('reconfirmation_mail_headline', 'Your new activation key')
->Set('reconfirmation_mail', '
    Hello #username#, <br /><br />
	You\'ve typed in an incorrect activation key too many times.<br /><br />
	We\'ve sent you this e-mail, containing a new activation key, in order to protect your account.<br /><br />
	When you login to #system# you will be asked for a activation-key.<br />
    You can confirm your mail directly via this link:<br />
    #confirmation_anchortag#<br /><br />
    Activationkey: #activationkey#<br />
    Username: #username# <br /><br />
    Hav fun being awesome on #system# ;)<br /><br />
    #system# Team
')

# User already logged in
->SetMenu('userarea_')
->Set('headline', 'Welcome, #username#')

# User already logged in
->SetMenu('game_')
->Set('start', 'GO!')
->Set('permission_ask', 'Please click allow, above')
->Set('permission_ask_initial', 'We need your microphone')
->Set('permission_ask_helpful', 'You haven\'t clicked allow yet')
->Set('permission_ask_helpful_2', 'Did something go wrong?')
->Set('permission_ask_helpful_3', '... then please refresh the page')
->Set('permission_ask_impatient', 'Hallo, are you out there?')
->Set('permission_ask_impatient_sigh', 'We\'re waiting!')
->Set('permission_denied', 'You denied access, and therefor you cannot play.')
->Set('measuring', 'Measuring noise')
->Set('measuring_quiet', 'Please be quiet in')
->Set('measuring_shh', 'Shh...')
->Set('measuring_done', 'Done, enjoy :)')
->Set('grade_perfect', 'Perfect')
->Set('grade_good', 'Good')
->Set('grade_fair', 'Fair')
->Set('grade_average', 'Average')
->Set('grade_poor', 'Poor')
->Set('grade_rubbish', 'Rubbish')
->Set('grade_miserable', 'Miserable')

# User statistics
->SetMenu('statistics_')
->Set('headline_own', 'Your statistics')
->Set('headline_other', 'Statistics for #username#')
->Set('favorite_songs', 'Favorite songs')
->Set('graph_precision', 'Precision')
->Set('graph_pointsprminute', 'Points per minute')
->Set('graph_pointsprtact', 'Points per tact')
->Set('graph_precisionprtact', 'Precision per tact')
->Set('favourites', 'Favourites')
->Set('view_all', 'View all')
->Set('title', 'Title')
->Set('played', 'Played')
->Set('avg_pts', 'Avg. points')
->Set('times', 'Times')
->Set('time', 'Time')
->Set('play_time', 'Duration')
->Set('plays', 'Plays')
->Set('summery', 'Summery')
->Set('this_game', 'This game')
->Set('average_games', 'Average')

# Genres
->SetMenu('genre_')
->Set('game', 'Game music')
->Set('jazz', 'Jazz')
->Set('classic', 'Classic')
->Set('pop', 'Pop')
->Set('birthday', 'Birthday')
->Set('christmas', 'Christmas')
->Set('movie', 'Movie')
->Set('danish', 'Danish')
->Set('children', 'Children')
->Set('rock', 'Rock')
->Set('wedding', 'Wedding')

->SetMenu('tour_')
->Set('0_0_title', 'Guided tour')
->Set('0_0', 'Welcome to the Magic Tune guided tour, where we will show you some of the games functionallity and how to play. <br /><br /> <strong>Before you start playing, please make sure your microphone works properly.</strong>')
->Set('1_0_title', 'Settings')
->Set('1_0', 'Please click on "Settings"')
->Set('1_1_title', 'Concert pitch')
->Set('1_1', 'Here, you can set your concert pitch, 440 or 442 is the most commonly used pitches. <br /><br /> Click "Got it" to proceed.')
->Set('1_2_title', 'Colored notes')
->Set('1_2', 'By checking this box, we will make the notes different colors when you play. Notes which belong to the G string will be yellow, notes on the A string will be red and so forth. <br /><br /> Click "Got it" to proceed.')
->Set('1_3_title', 'Language')
->Set('1_3', 'Here you can change the language in which Magic Tune is shown. <br /><br />  Click "Got it" to proceed.')
->Set('1_4_title', 'Kiddie mode')
->Set('1_4', 'By checking this box, we will make sure that the songs will be easier to play. We will stop at each note until you have played the matching tune. This will train your ability to read notes, and make it easier to learn new songs. <br /><br /> Click "Got it" to proceed.')
->Set('1_5_title', 'Countdown time')
->Set('1_5', 'When you press "Play", we will wait a short while before actually starting the game, this is to make sure you have got the time to pick up your violin and get ready. By adjusting this box, we can tell us how long time you need to pick up your violin at get ready. <br /><br /> Click "Got it" to proceed.')
->Set('1_6_title', 'Metronome')
->Set('1_6', 'It can be a challange, to get the sensation of when to play a new note. If you check this box, we will make a graphical pulsation inside the game to the rythm of the song, this will make it easier to know when a new note is due.')
->Set('1_7_title', 'Moving on')
->Set('1_7', 'Click on the "Save" button to continue to the next part.')
->Set('2_0_title', 'Preparing to play')
->Set('2_0', 'Click "View all" on the scales.')
->Set('2_1_title', 'A-Major')
->Set('2_1', 'Add this A-Major scale to your playlist by clicking the plus sign.')
->Set('2_2_title', 'First note position')
->Set('2_2', 'Here you can see which fingerposition will be the first one used in this scale. <br /><br /> Click "Got it" to proceed.')
->Set('2_3_title', 'B-Major')
->Set('2_3', 'Add this B-Major scale to your playlist by clicking the plus sign.')
->Set('2_4_title', 'Play')
->Set('2_4', 'You have now succesfully created a playlist. Click the play icon to continue to the game.')
->Set('3_0_title', 'Microphone')
->Set('3_0', 'We need to use your microphone in order to hear the music you are playing, please click allow in order to let Magic Tune use your microphone.')
->Set('4_0_title', 'Make noise')
->Set('4_0', 'Please make some noise, so we can test our access to your microphone.<span><br><br><strong>We have not heard your noise yet, please check that your mircophone works</strong></span>')
->Set('4_1_title', 'Make noise')
->Set('4_1', 'It works just fine :) click proceed to continue the guide - We are almost there')
->Set('5_0_title', 'Tuning')
->Set('5_0', 'Please make sure all of your four strings is in tune, by playing them one by one, the pointer should be in the middle of the tuner-bar and showing the right tune, it is not, please adjust your instrument. <br /><br />  When you are done, you are ready to play the game - thank you for taking our guided tour, and enjoy.')
->Set('button_got_it', 'Got it')
->Set('button_end_tour', 'End tour')
;
?>