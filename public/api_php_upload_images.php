<?php
// RESTful PHP Image API (upload, list, get, delete)
// Directory to store uploaded images
$uploadDir = __DIR__ . '/uploads/';
if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$uri = trim($_SERVER['REQUEST_URI'], '/');
$parts = explode('/', $uri);

// Assume API path like /api/images or /api/images/{id}
$resource = $parts[count($parts)-2] ?? null;
$id = $parts[count($parts)-1] ?? null;

// Handle OPTIONS (CORS preflight)
if ($method === 'OPTIONS') exit;

// ---------- ROUTES ---------- //
// POST /api/images  -> upload
// GET /api/images   -> list
// GET /api/images/{filename} -> get image
// DELETE /api/images/{filename} -> delete image

// UPLOAD IMAGE
if ($method === 'POST' && $resource === 'images') {
    if (!isset($_FILES['image'])) {
        echo json_encode(['error' => 'No image uploaded']);
        exit;
    }

    $file = $_FILES['image'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['error' => 'Upload error']);
        exit;
    }

    // Validate type
    $allowed = ['image/jpeg','image/png','image/webp','image/gif'];
    if (!in_array($file['type'], $allowed)) {
        echo json_encode(['error' => 'Invalid file type']);
        exit;
    }

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_', true) . '.' . $ext;
    $path = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $path)) {
        echo json_encode(['error' => 'Failed to save image']);
        exit;
    }

    $baseUrl = (isset($_SERVER['HTTPS']) ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];
    echo json_encode(['success'=>true, 'url'=> "$baseUrl/uploads/$filename" ]);
    exit;
}

// LIST IMAGES
if ($method === 'GET' && $resource === 'images' && $id === 'images') {
    $files = array_values(array_filter(scandir($uploadDir), fn($f)=>!in_array($f,['.','..'])));
    echo json_encode($files);
    exit;
}

// GET SINGLE IMAGE (returns direct file URL)
if ($method === 'GET' && $resource === 'images') {
    $file = $uploadDir . $id;
    if (!file_exists($file)) {
        echo json_encode(['error'=>'Image not found']);
        exit;
    }
    $baseUrl = (isset($_SERVER['HTTPS']) ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];
    echo json_encode(['url'=> "$baseUrl/uploads/$id" ]);
    exit;
}

// DELETE IMAGE
if ($method === 'DELETE' && $resource === 'images') {
    $file = $uploadDir . $id;
    if (!file_exists($file)) {
        echo json_encode(['error'=>'Image not found']);
        exit;
    }

    unlink($file);
    echo json_encode(['success'=>true, 'deleted'=>$id]);
    exit;
}

// DEFAULT RETURN
http_response_code(404);
echo json_encode(['error'=>'Route not found']);
