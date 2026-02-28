@echo off
:: This makes the window title easy to find
title Render App - Keep Alive Loop
color 0B

:loop
cls
echo ============================================
echo   CHECKING: https://pump-1ati.onrender.com/test
echo   TIME    : %time%
echo ============================================
echo.

:: -s (silent) hides progress bars
:: -o nul ignores the page content (we don't need to see the HTML)
:: -w "%%{http_code}" prints just the result (200, 404, etc.)
echo Response Code from Server:
curl -s -o nul -w "%%{http_code}" https://pump-1ati.onrender.com/test

echo.
echo.
echo --------------------------------------------
echo   NEXT WAKE-UP IN 10 MINUTES...
echo --------------------------------------------
timeout /t 600 /nobreak
goto loop