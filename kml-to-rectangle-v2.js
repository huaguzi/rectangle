var fs = require('fs');
var tj = require('togeojson');
var geolib = require('geolib');
var DOMParser = require('xmldom').DOMParser;

const sprintf = require('util').format;


var kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
<Document>
	<name>KmlFile</name>
	<StyleMap id="msn_ylw-pushpin">
		<Pair>
			<key>normal</key>
			<styleUrl>#sn_ylw-pushpin0</styleUrl>
		</Pair>
		<Pair>
			<key>highlight</key>
			<styleUrl>#sh_ylw-pushpin0</styleUrl>
		</Pair>
	</StyleMap>
	<Style id="sn_ylw-pushpin">
		<IconStyle>
			<scale>1.1</scale>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
			</Icon>
			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
		</IconStyle>
		<LineStyle>
			<color>ff56ff3f</color>
            <width>2</width>
		</LineStyle>
	</Style>
	<Style id="sh_ylw-pushpin">
		<IconStyle>
			<scale>1.3</scale>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
			</Icon>
			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
		</IconStyle>
		<LineStyle>
			<color>ff56ff3f</color>
            <width>2</width>
		</LineStyle>
	</Style>
	<Style id="sn_ylw-pushpin0">
		<IconStyle>
			<scale>1.1</scale>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
			</Icon>
			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
		</IconStyle>
		<LineStyle>
			<color>ff4f35ff</color>
            <width>2</width>
		</LineStyle>
	</Style>
	<StyleMap id="msn_ylw-pushpin0">
		<Pair>
			<key>normal</key>
			<styleUrl>#sn_ylw-pushpin</styleUrl>
		</Pair>
		<Pair>
			<key>highlight</key>
			<styleUrl>#sh_ylw-pushpin</styleUrl>
		</Pair>
	</StyleMap>
	<Style id="sh_ylw-pushpin0">
		<IconStyle>
			<scale>1.3</scale>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
			</Icon>
			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
		</IconStyle>
		<LineStyle>
			<color>ff4f35ff</color>
            <width>2</width>
		</LineStyle>
	</Style>
    <Style id="yellow">
		<LineStyle>
			<color>ff1efff5</color>
            <width>2</width>
		</LineStyle>
    </Style>
    <Style id='purple'>
		<LineStyle>
			<color>ffe426ff</color>
            <width>2</width>
		</LineStyle>
    </Style>
    <Style id='blue'>
		<LineStyle>
			<color>ffff4c1a</color>
            <width>2</width>
		</LineStyle>
    </Style>
	<Folder>
		<name>rectangle</name>
		<open>1</open>`;
var kmlTail = `	</Folder>
</Document>
</kml>`;

var template = `		<Placemark>
			<name>未命名路径</name>
			<styleUrl>%s</styleUrl>
			<LineString>
				<tessellate>1</tessellate>
				<coordinates>
					%s
				</coordinates>
			</LineString>
		</Placemark>`;
var colors = ['#msn_ylw-pushpin0', '#blue','#purple','#yellow', '#msn_ylw-pushpin']

var POINT_0 = {};
var POINT_1 = {};

var NEXT_POINT = {};
var CURRENT_POINT = {};

var data = [];
var index = 0;

var sourceFileName = '';
if(process.argv[2] == '-f'){
    sourceFileName = process.argv[3];
} else {
    console.log('Usage: node example.js -f file');
    process.exit();
}

// console.log(sourceFileName);
// process.exit();

var txt = fs.readFileSync(sourceFileName, 'utf8');

var dom = (new DOMParser()).parseFromString(txt, 'text/xml');
var converted = tj.kml(dom, {styles: true});
// var converted = tj.kml(dom, {styles: true});
data = converted.features[0].geometry.coordinates;

var speedMs = 35;
var COURSE = 0;


var exit = false;
var logName = formatDate(new Date());
var colorFlag = 0; // 0 or 1
var colorStr = '';
var placemarkStr = '';

var distance = 0;

function generatePoint(p0, p1) {
    // var p1InCircle = geolib.isPointInCircle(p1, CURRENT_POINT, 400);
    // if(!p1InCircle) {
    //     POINT_0 = NEXT_POINT;
    //     POINT_1 = p1;
    //     CURRENT_POINT = NEXT_POINT;
    //     if(colorFlag == 1) {
    //         colorFlag = 0;
    //         placemarkStr += sprintf(template, colors[0], generate(p0, p1));
    //     } else {
    //         colorFlag = 1;
    //         placemarkStr += sprintf(template, colors[1], generate(p0, p1));
    //     }
    //     return;
    // }
    // 画一个圆 && 半径 && 圆心
    var radius = geolib.getDistance(
        {latitude: POINT_0.latitude, longitude: POINT_0.longitude},
        {latitude: POINT_1.latitude, longitude: POINT_1.longitude}
    );
    var center = POINT_0;
    // 计算角度
    var bearing = geolib.getCompassDirection(POINT_0, POINT_1).bearing;
    // 产生一个新点 && 判断新点是否有效。
    var point = geolib.computeDestinationPoint(POINT_0, speedMs, bearing);

    distance += speedMs;
    if(distance >= 350) {
        distance = 0;
        switch(colorFlag){
            case 0:
                colorFlag = 1;
                colorStr = colors[0];
                break;
            case 1:
                colorFlag = 2;
                colorStr = colors[1];
                break;
            case 2:
                colorFlag = 3;
                colorStr = colors[2];
                break;
            case 3:
                colorFlag = 4;
                colorStr = colors[3];
                break;
            case 4:
                colorFlag = 0;
                colorStr = colors[4];
                break;
        }
        placemarkStr += sprintf(template, colorStr, generate(p0, p1));       
    }
    // console.log('理论距离: ', speedMs);
    // console.log('实际距离: ', geolib.getDistance(
    //     {latitude: POINT_0.latitude, longitude: POINT_0.longitude},
    //     {latitude: point.latitude, longitude: point.longitude}
    // ));

    var isInCircle = geolib.isPointInCircle( point, center, radius);
    if (isInCircle) {
        POINT_0 = point;
        COURSE = bearing;
        return point;
    } else {
        // 旧基准点无效，选举出一个新的基准点，并且修正角度；计算出一个新的 POINT_1
        POINT_0 = point;
        index += 2;
        if(index >= data.length ) {
            exit = true;
            return p1;
        } else {
            while (index <= data.length) {
                var tmpLat = parseFloat(data[index][1]);
                var tmpLon = parseFloat(data[index][0]);
                // 画一个圆 && 半径 && 圆心
                var tmpRadius = geolib.getDistance(
                    {latitude: p1.latitude, longitude: p1.longitude},
                    {latitude: tmpLat, longitude: tmpLon}
                );
                var tmpCenter = p1;
                if (geolib.isPointInCircle( point, tmpCenter, tmpRadius)) {
                    POINT_1 = {latitude: tmpLat, longitude: tmpLon};
                    COURSE = geolib.getCompassDirection(POINT_0, POINT_1).bearing;
                    break;
                } else {
                    index += 1;
                }
            }
        }
        return point;
    }
}

function formatBearing(bearing) {
    if(bearing < 0) {
        return 360 - bearing * -1;
    } else if(bearing >= 360) {
        return bearing - 360;
    }
    return bearing;
}

function getBearing(p0, p1) {
    return geolib.getCompassDirection(p0, p1).bearing;
}

// var points = [];

function generate(p0, p1) {

    // var p0 = CURRENT_POINT;
    var bearing = getBearing(CURRENT_POINT, POINT_0);

    // console.log(bearing);

    var p0LeftBearing = formatBearing(bearing - 90);
    var p0RightBearing = formatBearing(bearing + 90);
    var p0Left = geolib.computeDestinationPoint(CURRENT_POINT, 100, p0LeftBearing);
    var p0Right = geolib.computeDestinationPoint(CURRENT_POINT, 100, p0RightBearing);

    // console.log(p0LeftBearing, p0Left);

    var nextBearing = getBearing(p0, p1);

    // var nextP0 = geolib.computeDestinationPoint(p0, 400, bearing);

    // NEXT_POINT = nextP0;
    CURRENT_POINT = p0;

    var nextP0LeftBearing = formatBearing(bearing - 90);
    var nextP0RightBearing = formatBearing(bearing + 90);
    var nextP0Left = geolib.computeDestinationPoint(p0, 100, nextP0LeftBearing);
    var nextP0Right = geolib.computeDestinationPoint(p0, 100, nextP0RightBearing); 

    // points.push([p0Left, p0Right, nextP0Left, nextP0Right]);
    // console.log(toString(p0Left, p0Right, nextP0Right, nextP0Left)); 
    var str = toString(p0Left, p0Right, nextP0Right, nextP0Left);
    log(str);
    return str;
}

function toString(p0, p1, p2, p3) {
    return p0.longitude + ',' + p0.latitude + ' ' + p1.longitude + ',' + p1.latitude + ' ' + p2.longitude + ',' + p2.latitude + ' ' + p3.longitude + ',' + p3.latitude + ' ' + p0.longitude + ',' + p0.latitude;
}

function log(str){
    fs.appendFile('矩形txt-' + logName + '-' +sourceFileName.split('.')[0] + '.txt', str + "\r\n", (err) => {
        if (err) {
            throw err;
        };
        // console.log('The ' + str + ' was appended to file!');
    });
}
function formatDate(today) {
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
            dd='0'+dd
    }
    if(mm<10) {
            mm='0'+mm
    }
    return mm+'月-'+dd+'日-'+yyyy;
}
// var _p0 = {latitude: 24.49188282455623, longitude: 110.3961814256156}
// var _p1 = {latitude: 24.48635775456967, longitude: 110.3956693872647}
// generate(_p0, _p1);
POINT_0 = {latitude: parseFloat(data[0][1]), longitude: parseFloat(data[0][0])};
POINT_1 = {latitude: parseFloat(data[1][1]), longitude: parseFloat(data[1][0])};

// init start point
CURRENT_POINT = POINT_0;
// init next point
// placemarkStr = sprintf(template, colors[0], generate(POINT_0, POINT_1));

// data.length = 30;

while(!exit) {
    generatePoint(POINT_0, POINT_1);
}

fs.writeFile('矩形kml-' + logName + '-' +sourceFileName.split('.')[0] + '.kml', kmlHeader + placemarkStr + kmlTail, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
    console.log('exit');
}); 
