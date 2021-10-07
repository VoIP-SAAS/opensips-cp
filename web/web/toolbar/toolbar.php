<?php

require("db_connect.php");
$message = array();

$extraReq = $_POST;
if (!empty($extraReq['active_module'])) {

    $module = $extraReq['active_module'];

    if ($module == 'domains')
        $module = 'domain';

    $names = $extraReq['name'];
    $attrs = $extraReq['attr'];
    $values = $extraReq['value'];

    foreach ($names as $key => $name) {

        if (!empty($module) && !empty($name)) {

            $sql = "ALTER TABLE `opensips`.`$module` ADD COLUMN `$name` " . $attrs[$key] . "(" . (!empty($values[$key]) ? $values[$key] : 255) . ");";
            if ($conn->query($sql) === TRUE) {
                array_push($message, ['success' => true, 'message' => "New columns added successfully"]);
            } else {
                array_push($message, ['error' => true, 'message' => $conn->error]);
            }
        }
    }

} elseif (!empty($extraReq['fStatus'])) {

    try {

        unset($extraReq['fStatus']);
        $sFData = json_decode($extraReq['sFilter'], true);
        $sCnt = count($sFData[key($sFData)]);
        $sFileName = './json/toolbar_filter_' . key($sFData) . '.json';

        unlink($sFileName); //remove old
        file_put_contents($sFileName, json_encode($sFData)); // need directory 777 permission
        array_push($message, ['success' => true, 'message' => ucfirst(key($sFData)) . " module " . $sCnt . " filter saved !"]);
    } catch (Exception $exception) {
        array_push($message, ['error' => true, 'message' => $exception]);
    }

} else
    array_push($message, ['error' => true, 'message' => "Something went wrong!"]);

echo json_encode($message);
$conn->close();