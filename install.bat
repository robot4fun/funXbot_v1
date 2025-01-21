@echo off

set SOURCE=%~dp0

if exist "%ProgramFiles(x86)%" (
    set DESTINATION="%ProgramFiles(x86)%\Kittenblock"
    set DIR_TO_DELETE="%ProgramFiles(x86)%\Kittenblock\extensions"
) else (
    set DESTINATION="%ProgramFiles%\Kittenblock"
    set DIR_TO_DELETE="%ProgramFiles%\Kittenblock\extensions"
)

if exist %DIR_TO_DELETE% (
    rmdir /s /q %DIR_TO_DELETE%
)

if not exist %DESTINATION% mkdir %DESTINATION%

xcopy "%SOURCE%*" %DESTINATION% /E /I /Y

echo done!
pause