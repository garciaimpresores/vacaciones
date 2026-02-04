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
    pause
    exit /b 1
)

echo ========================================
echo Actualizando repositorio GitHub...
echo ========================================
echo.

REM Agregar archivos modificados
echo [1/3] Agregando cambios...
%GIT_PATH% add .
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron agregar los archivos
    pause
    exit /b 1
)

REM Crear commit
echo [2/3] Creando commit...
%GIT_PATH% commit -m "Security: Moved Firebase credentials to environment variables and added comprehensive documentation"
if %errorlevel% neq 0 (
    echo NOTA: No hay cambios para commitear o error al crear commit
)

REM Subir a GitHub
echo [3/3] Subiendo a GitHub...
%GIT_PATH% push
if %errorlevel% neq 0 (
    echo ERROR: No se pudo subir a GitHub
    pause
    exit /b 1
)

echo.
echo ========================================
echo EXITO! Cambios subidos a GitHub
echo ========================================
pause
