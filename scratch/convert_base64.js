import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const psCode = `
Add-Type -AssemblyName System.Drawing
$desktopDir = "C:\\Users\\wogus\\OneDrive\\Desktop\\★홈페이지 이미지\\탄성코트,줄눈\\바름공간\\탄성코트_수정용 썸네일"
$targetDir = "$((Get-Location).Path)\\public\\images\\seo"

if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
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
        Write-Host "SUCCESS: $($targets[$i]) ($w x $h px, $len bytes)"
    } else {
        Write-Host "FAIL: Missing $srcPath"
    }
}
`;

// Encode to UTF-16LE for PowerShell EncodedCommand
const buf = Buffer.from(psCode, 'utf16le');
const base64 = buf.toString('base64');

try {
  const out = execSync(`powershell -EncodedCommand ${base64}`, { encoding: 'utf8' });
  console.log(out);
} catch (err) {
  console.error('Error executing encoded command:', err);
}

// Inspect created files
const targetDir = path.join(process.cwd(), 'public/images/seo');
console.log('=== CONVERTED FIELD IMAGES VERIFICATION ===');
for (let i = 1; i <= 6; i++) {
  const name = `bareumgonggan-field-0${i}.jpg`;
  const fp = path.join(targetDir, name);
  if (fs.existsSync(fp)) {
    const size = fs.statSync(fp).size;
    const hash = crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
    console.log(`${name}: ${size} bytes, SHA256: ${hash}`);
  } else {
    console.log(`${name}: MISSING`);
  }
}
