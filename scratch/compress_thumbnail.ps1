Add-Type -AssemblyName System.Drawing
$cwd = (Get-Location).Path
$srcJpg = Join-Path $cwd "public\images\seo\bareumgonggan-search-thumbnail-v2.jpg"
$tempJpg = Join-Path $cwd "public\images\seo\bareumgonggan-search-thumbnail-v2-temp.jpg"

if (-not (Test-Path $srcJpg)) {
    Write-Error "Source JPG not found"
    exit 1
}

$img = [System.Drawing.Image]::FromFile($srcJpg)

# Set up JPG codec and quality parameter (compress to Quality = 65 for small footprint)
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 40)

$img.Save($tempJpg, $codec, $encoderParams)
$img.Dispose()

if (Test-Path $tempJpg) {
    Remove-Item $srcJpg -Force
    Rename-Item $tempJpg -NewName "bareumgonggan-search-thumbnail-v2.jpg" -Force
    Write-Host "Compressed JPG complete! New Size: $((Get-Item $srcJpg).Length) bytes"
} else {
    Write-Error "Compression failed to create temp file"
}
