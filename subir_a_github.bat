@echo off
setlocal

REM Definir la ruta completa de Git
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

REM Verificar si Git existe
if not exist %GIT_PATH% (
    set GIT_PATH="C:\Program Files (x86)\Git\bin\git.exe"
)

if not exist %GIT_PATH% (
    echo ERROR: No se pudo encontrar Git instalado
    echo Por favor instala Git desde: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ========================================
echo Subiendo codigo a GitHub...
echo Usando Git en: %GIT_PATH%
echo ========================================
echo.

REM Inicializar repositorio
echo [1/6] Inicializando repositorio Git...
%GIT_PATH% init
if %errorlevel% neq 0 (
    echo ERROR: No se pudo inicializar el repositorio
    pause
    exit /b 1
)

REM Agregar todos los archivos
echo [2/6] Agregando archivos...
%GIT_PATH% add .
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron agregar los archivos
    pause
    exit /b 1
)

REM Crear commit inicial
echo [3/6] Creando commit inicial...
%GIT_PATH% commit -m "Initial commit: Portal de Vacaciones con gestion de eventos"
if %errorlevel% neq 0 (
    echo ERROR: No se pudo crear el commit
    pause
    exit /b 1
)

REM Renombrar rama a main
echo [4/6] Renombrando rama a 'main'...
%GIT_PATH% branch -M main
if %errorlevel% neq 0 (
    echo ERROR: No se pudo renombrar la rama
    pause
    exit /b 1
)

REM Agregar repositorio remoto
echo [5/6] Conectando con GitHub...
%GIT_PATH% remote add origin https://github.com/garciaimpresores/vacaciones.git 2>nul
if %errorlevel% neq 0 (
    echo NOTA: El remoto ya existe, intentando actualizar...
    %GIT_PATH% remote set-url origin https://github.com/garciaimpresores/vacaciones.git
)

REM Subir a GitHub
echo [6/6] Subiendo codigo a GitHub...
echo.
echo NOTA: Si te pide autenticacion, necesitaras un Personal Access Token.
echo Puedes crearlo en: https://github.com/settings/tokens
echo.
%GIT_PATH% push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudo subir el codigo
    echo.
    echo Posibles soluciones:
    echo 1. Configura tu usuario de Git:
    echo    git config --global user.name "Tu Nombre"
    echo    git config --global user.email "tu@email.com"
    echo.
    echo 2. Si te pide credenciales, usa GitHub Desktop o un Personal Access Token
    pause
    exit /b 1
)

echo.
echo ========================================
echo EXITO! Codigo subido a GitHub
echo URL: https://github.com/garciaimpresores/vacaciones
echo ========================================
pause
