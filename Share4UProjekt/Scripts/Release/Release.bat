@rem Builds a Release version of Slide.Show
@rem Step 1. Execute this batch file to create Silverlight.js and a consolidated version of SlideShow.js
@rem Step 2. Compress the contents of the consolidated SlideShow.js file with http://dean.edwards.name/packer/
@rem For more information, see http://www.codeplex.com/SlideShow/Thread/View.aspx?ThreadId=20491

@echo off
setlocal

rem *** Prepare temp files ***
mkdir "Temp"
copy "..\Debug" "Temp"
move "Temp\Silverlight.js" "Silverlight.js"
move "Temp\SlideShow.js" "SlideShow.js"
del "Temp\Debug.js"

rem *** Necessary order for base classes ***
ren "Temp\Button.js" "01_Button.js"
ren "Temp\Transition.js" "02_Transition.js"
ren "Temp\ProgressIndicator.js" "03_ProgressIndicator.js"
ren "Temp\SlideNavigation.js" "04_SlideNavigation.js"
ren "Temp\PageContainer.js" "05_PageContainer.js"
ren "Temp\PageNavigation.js" "06_PageNavigation.js"

rem *** Consolidate temp files ***
copy "SlideShow.js"+"Temp\*.js" "SlideShow.js" /b
rmdir "Temp" /s /q

endlocal
pause