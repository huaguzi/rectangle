# !/usr/bin/ruby
# encoding: UTF-8

kmlHeader = <<KMLHEADER
<?xml version="1.0" encoding="UTF-8"?>
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
			<color>ff272bff</color>
			<scale>1.1</scale>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
			</Icon>
			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
		</IconStyle>
	</Style>
	<Style id="sh_ylw-pushpin">
		<IconStyle>
			<color>ff272bff</color>
			<scale>1.3</scale>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
			</Icon>
			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
		</IconStyle>
	</Style>
    <Folder><name>[*filename*]</name><open>1</open>
KMLHEADER

kmlTail = <<KMLTAIL
    </Folder>
</Document>
</kml>
KMLTAIL

'''
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
'''

template = <<TEMPLATE
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
</Placemark>
TEMPLATE

# require 'georuby'
# require 'geo_ruby/kml'
require 'optparse'

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: ruby txt-to-kml-v2.rb [options]"

  opts.on("-f", "--file FILE", "txt data") do |v|
    options[:file] = v
  end
end.parse!

if !options[:file]
    puts "Usage: ruby txt-to-kml-v2.rb [options]"
    exit
end

str = '';

File.open(options[:file], 'r:UTF-8') { |f|
  f.each_line do |line|
	line.chomp!
    _datetime, _other = line.split(/-/)
    _, _mon , _day, _year, _time = _datetime.split(/ /)
    _other.gsub!(/ /, '')
    _lat_lon_bearing, _type_name_type_num_speed = _other.split(';')
		if !_type_name_type_num_speed
			next
		end
    _lat, _lon, _bearing = _lat_lon_bearing.split(',')
    _type_name_type_num, _speed = _type_name_type_num_speed.split(',')

    if(!_speed)
      _speed = '0'
    end
    _type_name, _type_num = _type_name_type_num.split('=')
    # ["113", "47", "27", "jiayouzhan", "66", "0", "20160707", "131.945000", "47.407960", "0", "66.0", "131.945000", "47.407960", "0"]
    _tmpStr = template % [
      _lon.to_i.to_s,
      _lat.to_i.to_s,
      _type_num,
      _type_name,
			_bearing,
      _speed,
      _year +'/' + _mon + '/' + _day,
      _lon,
      _lat,
      '0',
      _bearing,
      _lon,
      _lat,
      '0',
    ]

    str += _tmpStr

  end

	File.open('XUEHUACJ-' + options[:file].split('.')[0] + '.kml', 'w:UTF-8') {|fw| 
		fw.write(kmlHeader.gsub!(/\[\*filename\*\]/, 'XUEHUACJ_' + Time.now.strftime('%Y-%m-%d-%H%M%S')) + str + kmlTail.chomp);
	}
}