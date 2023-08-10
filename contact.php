<?php
if (empty($_POST) || $_SERVER['REQUEST_METHOD'] != 'POST') {
    return;
}

require_once __DIR__ . "/vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$dbHost = $_ENV['DB_HOST'];
$dbName = $_ENV['DB_DATABASE'];
$dbPort = $_ENV['DB_PORT'];
$dbUsername = $_ENV['DB_USERNAME'];
$dbPassword = $_ENV['DB_PASSWORD'];

function sendResponse($data, $code = 200)
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Request-Method: *');
    header('Access-Control-Allow-Headers: *');
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($code);
    echo json_encode($data);
}

try {
    $connection = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName}", $dbUsername, $dbPassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $name = trim(htmlspecialchars($_POST['name'] ?? ''));
    $email = trim(htmlspecialchars($_POST['email'] ?? ''));
    $project = trim(htmlspecialchars($_POST['project'] ?? ''));
    $message = trim(htmlspecialchars($_POST['message'] ?? ''));

    $sql = "INSERT INTO contacts (name, email, project, message) VALUES (:name, :email, :project, :message)";
    $statement = $connection->prepare($sql);
    $result = $statement->execute([
        'name' => $name,
        'email' => $email,
        'project' => $project,
        'message' => $message,
    ]);

    $connection = null;

    if ($result) {
        sendResponse([
            'status' => 'OK',
            'code' => 201,
            'message' => 'Message successfully sent',
            'data' => $_POST,
        ], 201);
    } else {
        sendResponse([
            'status' => 'Bad Request',
            'code' => 400,
            'message' => 'Cannot store message'
        ], 400);
    }
} catch (PDOException $e) {
    sendResponse([
        'status' => 'Server Error',
        'code' => 500,
        'message' => 'Something went wrong'
    ], 500);
}