1. 在Google earth画出某一条轨迹，假设为example.kml

  不间断的一条轨迹

2. 在这条轨迹上实际采集数据，通常为多个点

  假设采集后的数据为**07月-19日-17时-2016-(S30惠深沿海高速)深圳市罗湖区莲塘街道--惠州市惠东县稔山镇.txt**
  
  转换为google earth kml

  javascript 版本
  ```javascript 
  node txt-to-kml-version-2.js -f 07月-19日-17时-2016-(S30惠深沿海高速)深圳市罗湖区莲塘街道--惠州市惠东县稔山镇.txt
  ```
  ruby 版本
  ```ruby
  ruby txt-to-kml-version-2.rb -f 07月-19日-17时-2016-(S30惠深沿海高速)深圳市罗湖区莲塘街道--惠州市惠东县稔山镇.txt
  ```
3. 根据Google earth画出的轨迹，根据某种算法计算出矩形，生成google earth kml

  ```javascript
  node kml-to-rectangle-v2.js -f example.kml
  ```
