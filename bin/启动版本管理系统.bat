node forever stop www

set y=%date:~0,4%
set m=%date:~5,2%
set d=%date:~8,2%
ren C:\Documents and Settings\Administrator\.forever\forever.log forever%y%%m%%d%%random%.log


node forever start -l forever.log -o out.log -e err.log  www