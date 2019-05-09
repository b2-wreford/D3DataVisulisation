<?php

  #database details
  $db = new mysqli('localhost', 'benwrefo_user1', '%kOetvA}Eeg%', 'benwrefo_php');

  # check our connection to the database and return error if broken
  if($db->connect_errno > 0){
    die('Unable to connect to database [' . $db->connect_error . ']');
  }

  $sql = "SELECT * FROM homedb";

  # check our query will actually run
  if(!$result = $db->query($sql)){
    die('There was an error running the query [' . $db->error . ']');
  }


  while($row = mysqli_fetch_assoc($result))
      $resultArray[] = $row;

#  print json_encode($test);

  // headers for not caching the results
  header('Cache-Control: no-cache, must-revalidate');
  header('Expires: Mon, 26 Jul 2050 05:00:00 GMT');

  // headers to tell that result is JSON
  header('Content-type: application/json');

  echo json_encode($resultArray,JSON_NUMERIC_CHECK);

  $db->close();

?>