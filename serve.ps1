<# 
.Vivaha PWA - Static File Server
Usage: powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
#>

$root = "D:\Developement\Matrimony Website"
$port = 8080

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Vivaha PWA Server Started" -ForegroundColor Green
Write-Host "Serving: $root" -ForegroundColor Cyan
Write-Host "URL: http://localhost:$port" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Red
Write-Host ""

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.webmanifest' = 'application/manifest+json; charset=utf-8'
  '.png'  = 'image/png'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.woff2' = 'font/woff2'
  '.woff' = 'font/woff'
  '.ttf'  = 'font/ttf'
  '.eot'  = 'application/vnd.ms-fontobject'
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.AbsolutePath.TrimStart('/')
    if ($path -eq '' -or $path.EndsWith('/')) { $path = 'index.html' }

    $filePath = Join-Path $root $path

    if (Test-Path $filePath -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $contentType = $mimeTypes[$ext]
      if (-not $contentType) { $contentType = 'application/octet-stream' }

      $response.ContentType = $contentType
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.StatusCode = 200
    } else {
      # SPA fallback - serve index.html for client-side routing
      $indexPath = Join-Path $root 'index.html'
      if (Test-Path $indexPath) {
        $bytes = [System.IO.File]::ReadAllBytes($indexPath)
        $response.ContentType = 'text/html; charset=utf-8'
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.StatusCode = 200
      } else {
        $response.StatusCode = 404
      }
    }
    $response.Close()
  }
} catch {
  Write-Host "Server error: $_" -ForegroundColor Red
} finally {
  $listener.Stop()
  Write-Host "Server stopped" -ForegroundColor Red
}