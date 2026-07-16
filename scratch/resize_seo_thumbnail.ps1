Add-Type -AssemblyName System.Drawing

$cwd = (Get-Location).Path
$srcPng = Join-Path $cwd "public\images\seo\bareumgonggan-search-thumbnail-v1.png"
$destJpg = Join-Path $cwd "public\images\seo\bareumgonggan-search-thumbnail-v1.jpg"

if (-not (Test-Path $srcPng)) {
    Write-Error "Source PNG not found"
    exit 1
}

$img = [System.Drawing.Image]::FromFile($srcPng)

# Set up JPG codec and quality parameter
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90)

$img.Save($destJpg, $codec, $encoderParams)
$img.Dispose()

Write-Host "JPG conversion complete! Size of JPG: $((Get-Item $destJpg).Length) bytes"
