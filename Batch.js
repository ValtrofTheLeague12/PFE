const shelljs = require('shelljs')
function EXECUTE_PG_DUMP(){
 shelljs.exec('cd bash && pg_dump.bat')
}
EXECUTE_PG_DUMP()