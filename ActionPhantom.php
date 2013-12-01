<?php
//exec("/usr/local/bin/phantomjs /Applications/XAMPP/xamppfiles/htdocs/hacku/tweet.js");
$command = '/usr/bin/osascript /Users/otyo/hacku/do.applescript 2>&1';
exec($command, $output, $return_var);

var_dump($output);
var_dump($return_var);
?>