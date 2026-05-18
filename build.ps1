# 龙虾启动器 - 一键构建脚本 (PowerShell版)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  龙虾启动器 - 一键构建脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 关闭正在运行的进程
Write-Host "[1/5] 检查并关闭正在运行的LobsterLauncher进程..." -ForegroundColor Yellow
$processes = Get-Process | Where-Object { $_.ProcessName -like "*Lobster*" }
if ($processes) {
    $processes | Stop-Process -Force
    Write-Host "  ✓ 已关闭 $($processes.Count) 个进程" -ForegroundColor Green
} else {
    Write-Host "  ✓ 没有正在运行的进程" -ForegroundColor Green
}
Start-Sleep -Seconds 1
Write-Host ""

# 2. 清理旧的构建产物
Write-Host "[2/5] 清理旧的构建产物..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
    Write-Host "  ✓ 已清理 dist 目录" -ForegroundColor Green
}
if (Test-Path "out") {
    Remove-Item -Recurse -Force out
    Write-Host "  ✓ 已清理 out 目录" -ForegroundColor Green
}
Write-Host ""

# 3. 编译代码
Write-Host "[3/5] 编译代码..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ 编译失败,请检查错误信息" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "  ✓ 编译完成" -ForegroundColor Green
Write-Host ""

# 4. 打包成便携版exe
Write-Host "[4/5] 打包成便携版exe..." -ForegroundColor Yellow
npx electron-builder --dir --win
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ 打包失败,请检查错误信息" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "  ✓ 打包完成" -ForegroundColor Green
Write-Host ""

# 5. 显示结果
$exePath = "dist\win-unpacked\LobsterLauncher.exe"
if (Test-Path $exePath) {
    $file = Get-Item $exePath
    Write-Host "[5/5] 构建完成!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  新exe位置:" -ForegroundColor White
    Write-Host "  $($file.FullName)" -ForegroundColor Yellow
    Write-Host "  大小: $([math]::Round($file.Length/1MB, 2)) MB" -ForegroundColor Gray
    Write-Host "  修改时间: $($file.LastWriteTime)" -ForegroundColor Gray
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # 询问是否打开目录
    $answer = Read-Host "是否打开exe所在目录? (Y/N)"
    if ($answer -eq "Y" -or $answer -eq "y") {
        Start-Process explorer.exe -ArgumentList "dist\win-unpacked"
    }
    
    # 询问是否运行exe
    $answer2 = Read-Host "是否立即运行exe测试? (Y/N)"
    if ($answer2 -eq "Y" -or $answer2 -eq "y") {
        Write-Host ""
        Write-Host "正在启动 LobsterLauncher.exe ..." -ForegroundColor Green
        Start-Process $exePath
    }
} else {
    Write-Host "  ✗ 构建失败: 未找到生成的exe文件" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
