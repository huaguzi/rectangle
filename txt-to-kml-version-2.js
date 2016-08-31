const sprintf = require('util').format;
var fs = require('fs');

var kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
<Document>
	<name>[*filename*]</name> 
	<StyleMap id="msn_ylw-pushpin">
		<Pair>
			<key>normal</key>
			<styleUrl>#sn_ylw-pushpin</styleUrl>
		</Pair>
		<Pair>
			<key>highlight</key>
			<styleUrl>#sh_ylw-pushpin</styleUrl>
		</Pair>
	</StyleMap>
	<Style id="sn_ylw-pushpin">
		<IconStyle>
			<color>ff56ff3f</color>
			<scale>1.1</scale>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
			</Icon>
			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
		</IconStyle>
	</Style>
	<Style id="sh_ylw-pushpin">
		<IconStyle>
			<color>ff56ff3f</color>
			<scale>1.3</scale>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
			</Icon>
			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
		</IconStyle>
	</Style>
    <Folder><name>[*filename*]</name><open>1</open>`;

var kmlTail = `
    </Folder>
</Document>
</kml>`;

/**
 * 
<Placemark>
    <name>!狗!_131,47,142_类型(27)加油站_角度66_限速0_by:junan_2013-09-18</name>
    <LookAt>
       <longitude>131.945000</longitude>
       <latitude>47.407960</latitude>
       <altitude>0</altitude>
       <heading>66.0</heading>
       <tilt>0</tilt>
       <range>503.63751684255</range>
       <gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>
    </LookAt>
    <styleUrl>#msn_ylw-pushpin</styleUrl>
    <Point>
        <coordinates>131.945000,47.407960,0</coordinates>
    </Point>
</Placemark>
*/

var template = `
<Placemark>
    <name>!高德!_%s,%s,XH_类型(%s)%s_角度%s_限速%s_by:xuehua_%s</name>
    <LookAt>
       <longitude>%s</longitude>
       <latitude>%s</latitude>
       <altitude>%s</altitude>
       <heading>%s</heading>
       <tilt>0</tilt>
       <range>503.63751684255</range>
       <gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>
    </LookAt>
    <styleUrl>#msn_ylw-pushpin</styleUrl>
    <Point>
        <coordinates>%s,%s,%s</coordinates>
    </Point>
</Placemark>`;

var sourceFileName = '';
var str = '';
if(process.argv[2] == '-f'){
    sourceFileName = process.argv[3];
} else {
    console.log('Usage: node example.js -f file');
    process.exit();
}

var data = fs.readFileSync(sourceFileName, 'utf8').toString().split("\n");
console.log(data.length);
if (data.length == 0){
   process.exit(); 
}
var line = '';
var _tmpStr = '';

var _datetime, _other, _mon, _day, _year, _time, _lat_lon_bearing, _type_name_type_num_speed;
var _lon, _lat, _bearing, _type_name_type_num, _speed;
var _type_name, _type_num;

var _datetime_otherArr;
var _datetimeArr;
var _otherArr;
var _lat_lon_bearingArr;
var _type_name_type_num_speedArr;
var _type_name_type_numArr;

for(i in data) {
    line = data[i];
    if(data[i] == '' || data[i] == "\n" || data[i] == "\r" || data[i] == "\r\n"){
        continue;
    }
    console.log(line);
    line = line.replace(/\r|\n/, '');
    _datetime_otherArr = line.split('-');
    _datetime = _datetime_otherArr[0];
    _other = _datetime_otherArr[1];
    _datetimeArr = _datetime.split(" ");
    _mon = _datetimeArr[1];
    _day = _datetimeArr[2];
    _year = _datetimeArr[3];
    _time = _datetimeArr[4];
    // _, _mon , _day, _year, _time = _datetime.split(" ")
    // _other.gsub!(/ /, '')
    _other = _other.replace(/ /g, '');
    // _lat_lon_bearing, _type_name_type_num_speed = _other.split(';')
    _otherArr = _other.split(';');
    _lat_lon_bearing = _otherArr[0];
    _type_name_type_num_speed = _otherArr[1];

    // if !_type_name_type_num_speed
    //    next
    // end
    if(!_type_name_type_num_speed) {
        continue;
    }
    // _lat, _lon, _bearing = _lat_lon_bearing.split(',')
    _lat_lon_bearingArr = _lat_lon_bearing.split(',');
    _lat = _lat_lon_bearingArr[0];
    _lon = _lat_lon_bearingArr[1];
    _bearing = _lat_lon_bearingArr[2];
    // _type_name_type_num, _speed = _type_name_type_num_speed.split(',')
    _type_name_type_num_speedArr = _type_name_type_num_speed.split(',')
    _type_name_type_num = _type_name_type_num_speedArr[0];
    _speed = _type_name_type_num_speedArr[1];

    // if(!_speed)
    //   _speed = '0'
    // end
    if(!_speed) {
        _speed = '0';        
    }

    // _type_name, _type_num = _type_name_type_num.split('=')
    _type_name_type_numArr = _type_name_type_num.split('=')
    _type_name = _type_name_type_numArr[0];
    _type_num = _type_name_type_numArr[1];

    // _tmpStr = template % [
    //   _lon.to_i.to_s,
    //   _lat.to_i.to_s,
    //   _type_num,
    //   _type_name,
	// 		_bearing,
    //   _speed,
    //   _year +'/' + _mon + '/' + _day,
    //   _lon,
    //   _lat,
    //   '0',
    //   _bearing,
    //   _lon,
    //   _lat,
    //   '0',
    // ]

    str += sprintf(template,
        parseInt(_lon, 10),
        parseInt(_lat, 10),
        _type_num,
        _type_name,
        _bearing,
        _speed,
        _year + '/' + _mon + '/' + _day,
        _lon,
        _lat,
        '0',
        _bearing,
        _lon,
        _lat,
        '0')

    str += _tmpStr
}
if(str == ''){
    console.log('str is empty!');
    process.exit();
}

var d = new Date();
var month = (d.getMonth() + 1) < 10 ? '0' + d.getMonth() : d.getmonth();
var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
var strftime = d.getFullYear()
    + '-' + month
    + '-' + day
    + '-' + hour
    + minute
    + second;
fs.writeFile('XUEHUACJ-' + sourceFileName.split('.')[0] + '.kml',
    kmlHeader.replace(/\[\*filename\*\]/g, 'XUEHUACJ_' + strftime) + str + kmlTail,
    function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        console.log('exit');
}); 
