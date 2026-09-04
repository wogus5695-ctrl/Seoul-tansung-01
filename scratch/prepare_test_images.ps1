Add-Type -AssemblyName System.Drawing
$cwd = (Get-Location).Path
$brainDir = "C:\Users\wogus\.gemini\antigravity\brain\5f11e682-0af4-4370-b938-e8f058e47ca5"
$destDir = Join-Path $cwd "public\images\seo"

# Image mappings
# media__1787622216358.jpg -> IMAGE A (test-a.jpg)
# media__1787622216382.jpg -> IMAGE B (test-b.jpg)
# media__1787622216064.jpg -> IMAGE C (test-c.jpg)

$mappings = @{
    "bareumgonggan-search-thumbnail-test-a.jpg" = "media__1787622216358.jpg"
    "bareumgonggan-search-thumbnail-test-b.jpg" = "media__1787622216382.jpg"
    "bareumgonggan-search-thumbnail-test-c.jpg" = "media__1787622216064.jpg"
}

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 60)

foreach ($destName in $mappings.Keys) {
    $srcName = $mappings[$destName]
    $srcPath = Join-Path $brainDir $srcName
    $destPath = Join-Path $destDir $destName
    
    if (Test-Path $srcPath) {
        $img = [System.Drawing.Image]::FromFile($srcPath)
        $img.Save($destPath, $codec, $encoderParams)
        $img.Dispose()
        Write-Host "Processed $destName. Original size: $((Get-Item $srcPath).Length) bytes. Compressed size: $((Get-Item $destPath).Length) bytes."
    } else {
        Write-Error "Source file $srcName not found in brain directory"
    }
}
