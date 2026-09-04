Add-Type -AssemblyName System.Drawing

$desktopDir = "C:\Users\wogus\OneDrive\Desktop\★홈페이지 이미지\탄성코트,줄눈\바름공간\탄성코트_수정용 썸네일"
$cwd = (Get-Location).Path
$targetDir = Join-Path $cwd "public\images\seo"

if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Force -Path $targetDir
}

$files = @("그림1.png", "그림2.jpg", "그림3.png", "그림4.jpg", "그림5.png", "그림6.png")
$targets = @("bareumgonggan-field-01.jpg", "bareumgonggan-field-02.jpg", "bareumgonggan-field-03.jpg", "bareumgonggan-field-04.jpg", "bareumgonggan-field-05.jpg", "bareumgonggan-field-06.jpg")

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 65)

for ($i = 0; $i -lt $files.Length; $i++) {
    $srcPath = Join-Path $desktopDir $files[$i]
    $destPath = Join-Path $targetDir $targets[$i]
    
    if (Test-Path $srcPath) {
        $img = [System.Drawing.Image]::FromFile($srcPath)
        $img.Save($destPath, $codec, $encoderParams)
        $w = $img.Width
        $h = $img.Height
        $img.Dispose()
        $len = (Get-Item $destPath).Length
        Write-Host "Processed $($targets[$i]): $w x $h px, $len bytes"
    } else {
        Write-Error "Source file missing: $srcPath"
    }
}
