@echo off
cd /d "C:\Users\Admin\.understand-anything\repo\understand-anything-plugin\packages\dashboard"
set GRAPH_DIR=C:\Users\Admin\Desktop\Website 3D\studio-3d
set UNDERSTAND_ACCESS_TOKEN=28547b2155bbc8dce286c343e6d9eb65
echo Starting Understand Dashboard...
echo URL: http://127.0.0.1:5173/?token=%UNDERSTAND_ACCESS_TOKEN%
echo.
call pnpm run dev
pause
