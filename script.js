var db, config, haiku;
config = {
    locateFile: filename => `sql-wasm.wasm`
}
function getHaiku(){
    initSqlJs(config).then(function(SQL){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'haiku.db', true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = e => {
            var uInt8Array = new Uint8Array(xhr.response);
            db = new SQL.Database(uInt8Array);
            haiku = db.exec(`
                SELECT a.five, b.seven , c.five
                FROM (SELECT DISTINCT five  FROM haiku) a,
                     (SELECT DISTINCT seven FROM haiku) b,
                     (SELECT DISTINCT five  FROM haiku) c
                WHERE NOT a.five = c.five
                AND NOT b.seven = ''
                ORDER BY random(), random(), random()
                LIMIT 1;
            `);
            var haikuText = document.getElementById('haikuText');
                haikuText.innerHTML = haiku[0].values[0].join('<br>');
        };
        xhr.send();
    });
}
getHaiku();

document.getElementById('getHaiku').addEventListener('click', getHaiku);


var copyrightYear = new Date();
document.getElementById('copyright').innerHTML = copyrightYear.getFullYear();
