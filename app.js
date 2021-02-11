const express = require('express');
const fetch = require('node-fetch');
const limit = require('express-rate-limit');
const fs = require('fs');
const https = require('https');
const app = express();
const limiter = limit({
    max: 15,
    windowMs: 5 * 60 * 1000,
    message: 'please try again in 5 minutes'
});

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use('/search', limiter);
app.enable('trust proxy');

function getTrackers(){let tr='&tr='+encodeURIComponent('udp://tracker.coppersurfer.tk:6969/announce');tr+='&tr='+encodeURIComponent('udp://tracker.openbittorrent.com:6969/announce');tr+='&tr='+encodeURIComponent('udp://tracker.opentrackr.org:1337');tr+='&tr='+encodeURIComponent('udp://tracker.leechers-paradise.org:6969/announce');tr+='&tr='+encodeURIComponent('udp://tracker.dler.org:6969/announce');tr+='&tr='+encodeURIComponent('udp://opentracker.i2p.rocks:6969/announce');tr+='&tr='+encodeURIComponent('udp://47.ip-51-68-199.eu:6969/announce');return tr}
function getMagnet(hash, name) {
	return 'magnet:?xt=urn:btih:' + hash + '&dn=' + encodeURIComponent(name) + getTrackers();
}
function getCategory(a,e){void 0===e&&(e="category:");let i,o=a.toString();if(0==a)return"";1==o[0]&&(i="Audio"),2==o[0]&&(i="Video"),3==o[0]&&(i="Applications"),4==o[0]&&(i="Games"),5==o[0]&&(i="Porn"),6==o[0]&&(i="Other");let s='<a href="/search.php?q='+e+o[0]+'00">'+i+'</a> > <a href="/search.php?q='+e+a+'">';return 101==a?s+"Music</a>":102==a?s+"Audio Books</a>":103==a?s+"Sound clips</a>":104==a?s+"FLAC</a>":199==a?s+"Other</a>":201==a?s+"Movies</a>":202==a?s+"Movies DVDR</a>":203==a?s+"Music videos</a>":204==a?s+"Movie Clips</a>":205==a?s+"TV-Shows</a>":206==a?s+"Handheld</a>":207==a?s+"HD Movies</a>":208==a?s+"HD TV-Shows</a>":209==a?s+"3D</a>":299==a?s+"Other</a>":301==a?s+"Windows</a>":302==a?s+"Mac/Apple</a>":303==a?s+"UNIX</a>":304==a?s+"Handheld</a>":305==a?s+"IOS(iPad/iPhone)</a>":306==a?s+"Android</a>":399==a?s+"Other OS</a>":401==a?s+"PC</a>":402==a?s+"Mac/Apple</a>":403==a?s+"PSx</a>":404==a?s+"XBOX360</a>":405==a?s+"Wii</a>":406==a?s+"Handheld</a>":407==a?s+"IOS(iPad/iPhone)</a>":408==a?s+"Android</a>":499==a?s+"Other OS</a>":501==a?s+"Movies</a>":502==a?s+"Movies DVDR</a>":503==a?s+"Pictures</a>":504==a?s+"Games</a>":505==a?s+"HD-Movies</a>":506==a?s+"Movie Clips</a>":599==a?s+"Other</a>":601==a?s+"E-books</a>":602==a?s+"Comics</a>":603==a?s+"Pictures</a>":604==a?s+"Covers</a>":605==a?s+"Physibles</a>":699==a?s+"Other</a>":i}

app.use(function(req, res, next) {
    if (req.secure) {
        next();
    } else {
        res.redirect('https://' + req.headers.host + req.url);
    }
});

app.get('/search', async function(req, resp) {
    if (req.query.s) {
        let category = req.query.c ? req.query.c : '0';
        let url = 'http://apibay.org/q.php?q=' + encodeURIComponent(req.query.s) + '&cat=' + encodeURIComponent(category);
        var html = '';
        await getJson(url).then(function(json) {
            resp.render('search', {
                title: 'search results',
                moment: require('moment'),
                results: json,
                getTrackers: getTrackers,
                getMagnet: getMagnet,
                getCategory: getCategory,
                search: req.query.s,
                category: category
            });
        });
    }
});

app.get('/', function(req, resp) {
    resp.render('index', {
        title: 'Search ThePirateBay'
    });
});

async function getJson(url) {
    var data;
    try {
        let options = {
            method: 'Get'
        };
        const resp = await fetch(url, options);
        const json = await resp.json().then(function(val) {
            data = val;
        });
        return data;
    } catch (e) {
        return false;
        console.error(e);
    }
}

https.createServer({
    key: fs.readFileSync('keys/privkey.pem'),
    cert: fs.readFileSync('keys/fullchain.pem')
}, app).listen(6969, function() {
    console.log('leter rip buds');
});

app.get('*', function(req, res) {
    res.redirect('https://' + req.headers.host + req.url);
})
app.listen(6996);