<?php
    if (isset($_POST['data'])) {
        $data = $_POST['data'];
        file_put_contents('db.json', $data);
        echo 'Data saved successfully.';
    } else {
        echo 'Data not received.';
}
?>