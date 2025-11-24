@echo off
chcp 65001 >nul
title Inicializador - Hub de Projetos (Produção)

echo ================================
echo Iniciando Projeto em Modo de Produção...
echo ================================

:: Step 1 — Ensure PNPM
echo Verificando PNPM...
where pnpm >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo PNPM não foi encontrado. Instalando...
    npm install -g pnpm
)

:: Step 2 — Update PNPM safely
echo Atualizando PNPM...
call update-pnpm.bat

:: Step 3 — Pull latest version from GitHub
echo Obtendo atualizações do repositório...
git reset --hard
git pull

:: Step 4 — Install dependencies
call install-dependencies.bat

:: Step 5 — Build production version
call build-project.bat

:: Step 6 — Start production server
echo Iniciando servidor de produção...
echo (Deixe esta janela aberta para manter o aplicativo rodando)
pnpm preview --host

pause
