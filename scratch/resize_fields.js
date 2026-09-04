import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const psCode = `
Add-Type -AssemblyName System.Drawing
$targetDir = "$((Get-Location).Path)\\public\\images\\seo"

$filesToResize = @("bareumgonggan-field-02.jpg", "bareumgonggan-field-04.jpg")

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 65)

foreach ($file in $filesToResize) {
    $fp = Join-Path $targetDir $file
    if (Test-Path $fp) {
        $orig = [System.Drawing.Image]::FromFile($fp)
        $newW = 1024
        $newH = 1024
        $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($orig, 0, 0, $newW, $newH)
        $orig.Dispose()
        $g.Dispose()
        
        $bmp.Save($fp + ".tmp", $codec, $encoderParams)
        $bmp.Dispose()
        
        Remove-Item $fp -Force
        Rename-Item ($fp + ".tmp") -NewName $file -Force
        Write-Host "Resized $file to 1024x1024. New size: $((Get-Item $fp).Length) bytes"
    }
}
`;

const buf = Buffer.from(psCode, 'utf16le');
const base64 = buf.toString('base64');

try {
  execSync(`powershell -EncodedCommand ${base64}`, { encoding: 'utf8' });
} catch (err) {
  console.error(err);
}

const targetDir = path.join(process.cwd(), 'public/images/seo');
console.log('=== ALL 6 FIELD IMAGES FINAL VERIFICATION ===');
for (let i = 1; i <= 6; i++) {
  const name = `bareumgonggan-field-0${i}.jpg`;
  const fp = path.join(targetDir, name);
  if (fs.existsSync(fp)) {
    const size = fs.statSync(fp).size;
    const hash = crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
    console.log(`${name}: ${size} bytes, SHA256: ${hash}`);
  }
}
