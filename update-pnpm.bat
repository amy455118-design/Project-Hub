@echo off
chcp 65001 >nul

echo Verificando atualizações do PNPM...
pnpm self-update

echo PNPM update concluído.
