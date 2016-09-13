---
title: 工作内容
tags: 首次编辑 2016/09/09,xuehua
grammar_abbr: true
grammar_table: true
grammar_defList: true
grammar_emoji: true
grammar_footnote: true
grammar_ins: true
grammar_mark: true
grammar_sub: true
grammar_sup: true
grammar_checkbox: true
grammar_mathjax: true
grammar_flow: true
grammar_sequence: true
grammar_plot: true
grammar_code: true
grammar_highlight: true
grammar_html: true
grammar_linkify: true
grammar_typographer: true
grammar_video: true
grammar_audio: true
grammar_attachment: true
grammar_mermaid: true
grammar_classy: true
grammar_cjkEmphasis: true
grammar_cjkRuby: true
grammar_center: true
grammar_align: true
grammar_tableExtra: true
---
[TOC]
## 0. 说明

 1. 机器名和ip对应地址请参见[附录](#fulu)
 2. 图片放在[yun-new-web-huazi](#fulu-jifang-web)。最好确保电脑处于在线状态。
 
## 1. 服务器
### 1. 轨迹服务器

[架构图](#fulu-jifang)[^footnote-img]
![轨迹服务器架构图](http://www.e-dog.cn/downloads/go/yungo/img/guiji_server_jiagou.jpg)


#### 1. 机房部分
##### **1. Nginx负载均衡**

 1. 部署在[yun-new-nav-3-root](#fulu-jifang)
 2. 安装目录

    ```linux
    [root@localhost nginx_tcp]# pwd
    /usr/local/nginx_tcp
    ```

 3. 安装配置

    ```bash
    [root@localhost nginx_tcp]# ./nginx_tcp -V
    nginx version: nginx/1.9.7
    built by gcc 4.4.7 20120313 (Red Hat 4.4.7-11) (GCC) 
    built with OpenSSL 1.0.2d 9 Jul 2015
    TLS SNI support enabled
    configure arguments: --prefix=/usr/local/nginx_tcp --sbin-path=/usr/local/nginx_tcp/nginx_tcp --conf-path=/usr/local/nginx_tcp/nginx.conf --pid-path=/usr/local/nginx_tcp/nginx.pid --with-http_ssl_module --with-stream --with-pcre=/usr/local/src/pcre-8.37 --with-zlib=/usr/local/src/zlib-1.2.8 --with-openssl=/usr/local/src/openssl-1.0.2d
    ```

 4. 相关的配置
  
    ```bash
    [root@localhost nginx_tcp]# vim nginx.conf
    ```
    
    ```nginx?linenums
    stream {
        upstream backend {
            least_conn;
            # development
            # server 127.0.0.1:14444;
            # server 127.0.0.1:24444;
            # server 127.0.0.1:34444;
            # server 127.0.0.1:44444;
    
            # production
            server 127.0.0.1:15555;
            server 127.0.0.1:25555;
            server 127.0.0.1:35555;
            server 127.0.0.1:45555;
        }
    
        server {
            listen 10.10.0.106:12396;
            proxy_connect_timeout 3s;
            proxy_timeout 3s;
            proxy_pass backend;
        }
    }
    ```

##### **2. 业务服务**

 1. 部署在[yun-new-nav-3-huazi](#fulu-jifang)
 2. 工作目录
    
    ```linux
    [huazi@localhost track_bat_server_yun_new_nav3_12888]$ pwd
    /home/huazi/track_bat_server_yun_new_nav3_12888
    ```

 3. 主程序[^footnote-screen]
 4. 
    > Ruby版本
    
    ```linux
    [huazi@localhost track_bat_server_yun_new_nav3_12888]$ rvm list
    
    rvm rubies
    
       ruby-2.0.0-p643 [ x86_64 ]
       ruby-2.1.3 [ x86_64 ]
    =* ruby-2.2.1 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default    
    ```

    > 4个应用服务器

    ```bash
    [huazi@localhost track_bat_server_yun_new_nav3_12888]$ screen -r server_15555
    [huazi@localhost track_bat_server_yun_new_nav3_12888]$ ruby server_5555_1.rb 1>/dev/null 2>/dev/null
    ```
    
    ```bash
    [huazi@localhost track_bat_server_yun_new_nav3_12888]$ screen -r server_25555
    
    [huazi@localhost track_bat_server_yun_new_nav3_12888]$ ruby server_5555_2.rb 1>/dev/null 2>/dev/null
    ```
    
    ```bash
    [huazi@localhost track_bat_server_yun_new_nav3_12888]$ screen -r server_35555
    
    [huazi@localhost track_bat_server_yun_new_nav3_12888]$ ruby server_5555_3.rb 1>/dev/null 2>/dev/null
    ```
    
    ```bash
    [huazi@localhost track_bat_server_yun_new_nav3_12888]$ screen -r server_45555
    
    [huazi@localhost track_bat_server_yun_new_nav3_12888]$ ruby server_5555_4.rb 1>/dev/null 2>/dev/null
    ```
    

 4. 队列
    ```ruby
    # 此队列发送JSON格式文本给RabbitMQ，由消费者存到Apache Cassandra。
    amqp_queue = amqp_channel.queue("track.json.data.queue", :durable => true)
    # 此队列发送二进制文件给RabbitMQ，由消费者存到本地，并且发送一份到阿里云。
    amqp_queue_for_bindata = amqp_channel.queue("track.bin.data.queue", :durable => true)
    ```

 5. 队列消费者
 

1. track.json.data.queue

    ```bash
    [huazi@localhost amqp_client]$ pwd
    /home/huazi/rabbit-customer/amqp_client
    ```
    
    > Ruby版本

    ```bash
    [huazi@localhost amqp_client]$ rvm list
    
    rvm rubies
    
       ruby-2.0.0-p643 [ x86_64 ]
    => ruby-2.1.3 [ x86_64 ]
     * ruby-2.2.1 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```
    
    > 3个消费者
    
    ```bash
    [huazi@localhost amqp_client]$ screen -r 5757.workerV2
    
    [huazi@localhost amqp_client]$ ruby workerV2.rb 1>/dev/null 2>/dev/null
    ```

    ```bash
    [huazi@localhost amqp_client]$ screen -r 5947.workerV2_2
    
    [huazi@localhost amqp_client]$ ruby workerV2.rb 1>/dev/null 2>/dev/null
    ```
    
    ```bash
    [huazi@localhost amqp_client]$ screen -r 937.workerV2_3
    
    [huazi@localhost amqp_client]$ ruby workerV2.rb 1>/dev/null 2>/dev/null
    ```
    
2. track.bin.data.queue

    ```bash
    [huazi@localhost track_bindata]$ pwd
    /home/huazi/rabbit-customer/track_bindata
    ```
    
    > Ruby版本
    
    ```bash
    [huazi@localhost track_bindata]$ rvm list
    
    rvm rubies
    
       ruby-2.0.0-p643 [ x86_64 ]
       ruby-2.1.3 [ x86_64 ]
    =* ruby-2.2.1 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```
    
    > 2个消费者
    
    ```bash
    [huazi@localhost track_bindata]$ screen -r 6634.worker_for_track_bindata
    
    [huazi@localhost track_bindata]$ ruby worker_for_bindataV5.rb 1>/dev/null 2>/dev/null
    ```
    
    ```bash
    [huazi@localhost track_bindata]$ screen -r 6979.worker_for_track_bindata_2
    
    [huazi@localhost track_bindata]$ ruby worker_for_bindataV5.rb 1>/dev/null 2>/dev/null
    ```
 
##### <span id='queue-problem'>**3.可能出现的问题**</span>

队列服务器监控可以通过远程查看。http://116.204.10.97:15672

1. 如果出现数据堆积的情况，请重点查看队列消费者，可能的话，尽量重启。
2. 如果出现数据量减少的情况，请重点查看主程序，可能的话，尽量重启。
    
> 一般来说，不需要重启Nginx，不过出现问题后，最好重启。`kill -HUP [nginx master pid]`

查看　master process pid(39584)。

```linux
[huazi@localhost track_bat_server_yun_new_nav3_12888]$ ps -ef | grep nginx | grep -v grep
nobody    1225 39584  0 Sep06 ?        00:15:27 nginx: worker process
nobody    1226 39584  0 Sep06 ?        00:14:34 nginx: worker process
nobody    1227 39584  0 Sep06 ?        00:14:25 nginx: worker process
nobody    1228 39584  0 Sep06 ?        00:14:56 nginx: worker process
root     39584     1  0 Mar23 ?        00:00:00 nginx: master process ./nginx_tcp
```

#### 2. 阿里云部分
##### **1. Nginx负载均衡**

 1. 部署在[aliyun-a-root](#fulu-ali)
 2. 安装目录
    
    ```linux
    [root@iZ94elblhbzZ nginx_tcp]# pwd
    /usr/local/nginx_tcp
    ```
    
 3. 安装配置
 
    ```linux
    [root@iZ94elblhbzZ nginx_tcp]# ./nginxtcp -V
    nginx version: nginx/1.9.7
    built by gcc 4.4.7 20120313 (Red Hat 4.4.7-4) (GCC) 
    built with OpenSSL 1.0.2d 9 Jul 2015
    TLS SNI support enabled
    configure arguments: --prefix=/usr/local/nginx_tcp --sbin-path=/usr/local/nginx_tcp/nginx --conf-path=/usr/local/nginx_tcp/nginx.conf --pid-path=/usr/local/nginx_tcp/nginx.pid --with-http_ssl_module --with-stream --with-pcre=/usr/local/src/pcre-8.37 --with-zlib=/usr/local/src/zlib-1.2.8 --with-openssl=/usr/local/src/openssl-1.0.2d
    ```
 
 4. 相关的配置
 
    ```nginx?linenums
    stream {
        upstream backend {
            least_conn;
            # server 127.0.0.1:18888;
            # server 127.0.0.1:28888;
            # server 127.0.0.1:38888;
            # server 127.0.0.1:48888;
    
            server 10.169.97.139:18888;
            server 10.169.97.139:28888;
            server 10.169.97.139:38888;
        }
    
        server {
            listen 2396;
            proxy_connect_timeout 2s;
            proxy_timeout 3s;
            proxy_pass backend;
        }
    }    
    ```

##### **2. 业务服务**

 1. 部署在[aliyun-b-huazi](#fulu-ali)
 2. 工作目录
    
    ```
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ pwd
    /home/huazi/track_bat_server_2396_nav_b
    ```
    
 3. 主程序[^footnote-screen]
 
    > Ruby版本
    
    ```linux
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ rvm list
    Warning! PATH is not properly set up, '/usr/local/rvm/gems/ruby-2.1.3/bin' is not at first place,
             usually this is caused by shell initialization files - check them for 'PATH=...' entries,
             it might also help to re-add RVM to your dotfiles: 'rvm get stable --auto-dotfiles',
             to fix temporarily in this shell session run: 'rvm use ruby-2.1.3'.
    
    rvm rubies
    
       ruby-1.8.7-head [ x86_64 ]
       ruby-1.8.7-p374 [ x86_64 ]
       ruby-1.9.3-p547 [ x86_64 ]
    =* ruby-2.1.3 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default    
    ```
    
    > 3个应用服务器
    
    ```bash
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ screen -r 8479.server_18888
    
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ ruby serverV3_port_18888.rb
    ```
    
    ```bash
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ screen -r 18150.server_28888
    
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ ruby serverV3_port_28888.rb
    ```
    
    ```bash
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ screen -r 29680.server_38888
    
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ ruby serverV3_port_38888.rb
    ```
 
 4. 队列
 
    ```ruby?linenums
    # 此队列由消费者向第三方发送数据
    amqp_queue = amqp_channel.queue("track.json.data.queue", :durable => true)
    # 专门给爱培科的。请忽略队列名的含义
    amqp_queue_gd = amqp_channel.queue("gd.track.data.queue", :durable => true)
    ```
 
 5. 队列消费者
 
    
1. track.json.data.queue(第三方)

    ```linux
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ pwd
    /home/huazi/track_bat_server_2396_nav_b
    ```
    
    > Ruby版本
    
    ```linux
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ rvm list
    Warning! PATH is not properly set up, '/usr/local/rvm/gems/ruby-2.1.3/bin' is not at first place,
             usually this is caused by shell initialization files - check them for 'PATH=...' entries,
             it might also help to re-add RVM to your dotfiles: 'rvm get stable --auto-dotfiles',
             to fix temporarily in this shell session run: 'rvm use ruby-2.1.3'.
    
    rvm rubies
    
       ruby-1.8.7-head [ x86_64 ]
       ruby-1.8.7-p374 [ x86_64 ]
       ruby-1.9.3-p547 [ x86_64 ]
    =* ruby-2.1.3 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```
    
    **请注意消费者的不同功能，因为比较简单，具体查看源码。**~~目前是用没有发送给凯立德的脚本~~。
    
    > 通用的第三方
    
    ```linux
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ screen -r 31758.worker_for_gd_1
    
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ ruby worker_for_third_v10_no_careland.rb
    ```
    
    ```linux
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ screen -r 1473.worker_for_gd_2
    
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ ruby worker_for_third_v10_no_careland.rb
    ```
    
    ```linux
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ screen -r 3042.worker_for_gd_3
    
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ ruby worker_for_third_v10_no_careland.rb
    ```
    
    > 通用第三方＋石贝
    
    ```linux
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ screen -r 24470.worker_for_gd_shibei_1
    
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ ruby worker_for_third_v11_no_careland.rb
    ```
    
    > 不给第三方发送，用户消耗队列，或者说控制数据量。如果队列服务器因为出现问题，堆积很多，可以运行此脚本。
    
    ```linux
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ screen -r 22971.worker_for_gd_xiaohao
    
    [huazi@iZ9436l4kc8Z track_bat_server_2396_nav_b]$ ruby worker_for_only_zh.rb
    ```
    
2. gd.track.data.queue(爱培科)

    > 部署在[aliyun-a-huazi](#fulu-ali)
    
    请注意，爱培科有cron任务
    
    ```bash?linenums
    #sm start rvm
    PATH="/usr/local/rvm/gems/ruby-2.1.3/bin:/usr/local/rvm/gems/ruby-2.1.3@global/bin:/usr/local/rvm/rubies/ruby-2.1.3/bin:/usr/local/rvm/gems/ruby-2.1.3/bin:/usr/local/rvm/gems/ruby-2.1.3@global/bin:/usr/local/rvm/rubies/ruby-2.1.3/bin:/usr/java/jdk1.7.0_67/bin:/usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin:/usr/local/rvm/bin:/home/huazi/bin"
    GEM_HOME='/usr/local/rvm/gems/ruby-2.1.3'
    GEM_PATH='/usr/local/rvm/gems/ruby-2.1.3:/usr/local/rvm/gems/ruby-2.1.3@global'
    MY_RUBY_HOME='/usr/local/rvm/rubies/ruby-2.1.3'
    IRBRC='/usr/local/rvm/rubies/ruby-2.1.3/.irbrc'
    RUBY_VERSION='ruby-2.1.3'
    #sm end rvm
    
    # 爱培科相关
    05 04 * * * /usr/local/rvm/rubies/ruby-2.1.3/bin/ruby /home/huazi/aipeike/getdatascript.rb 1>/dev/null 2>/dev/null
    # 数据统计相关
    */5 * * * * /usr/local/rvm/rubies/ruby-2.1.3/bin/ruby /home/huazi/data_display_for_position/distribution-display.rb 1>/dev/null 2>/dev/null
    */30 * * * * /usr/local/rvm/rubies/ruby-2.1.3/bin/ruby /home/huazi/data_display_for_position/count-devices.rb 1>/dev/null 2>/dev/null
    ```

    ```linux
    [huazi@iZ94elblhbzZ aipeike]$ pwd
    /home/huazi/aipeike
    ```
    
    > Ruby版本
    
    ```linux
    [huazi@iZ94elblhbzZ aipeike]$vm list
    Warning! PATH is not properly set up, '/usr/local/rvm/gems/ruby-2.1.3/bin' is not at first place,
             usually this is caused by shell initialization files - check them for 'PATH=...' entries,
             it might also help to re-add RVM to your dotfiles: 'rvm get stable --auto-dotfiles',
             to fix temporarily in this shell session run: 'rvm use ruby-2.1.3'.
    
    rvm rubies
    
       ruby-1.8.7-head [ x86_64 ]
       ruby-1.8.7-p374 [ x86_64 ]
       ruby-1.9.2-p330 [ x86_64 ]
    =* ruby-2.1.3 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```
    
    > 3个消费者
    
    ```linux
    [huazi@iZ94elblhbzZ aipeike]$ screen -r 30260.worker_for_aipeike_1
    
    [huazi@iZ94elblhbzZ aipeike]$ ruby worker_for_aipeike_v2.rb 1>worker_for_aipeike.g 2>worker_for_aipeike.err.log
    ```
    
    ```linux
    [huazi@iZ94elblhbzZ aipeike]$ screen -r 30376.worker_for_aipeike_2
    
    [huazi@iZ94elblhbzZ aipeike]$ ruby worker_for_aipeike_v2.rb 1>worker_for_aipeike.g 2>worker_for_aipeike.err.log
    ```
    
    ```linux
    [huazi@iZ94elblhbzZ aipeike]$ screen -r 30554.worker_for_aipeike_3
    
    [huazi@iZ94elblhbzZ aipeike]$ ruby worker_for_aipeike_v2.rb 1>worker_for_aipeike.g 2>worker_for_aipeike.err.log
    ```

##### **3. 可能出现的问题**
[可以参考机房部分](#queue-problem)

### 2. 查询服务器
#### 1. http协议

 1. [Nginx配置](#yun-new-nav-2-nginx)
 2. 相关的配置信息
    
    ```nginx?linenums
     49     upstream apibackend {
     50         server  unix:/tmp/apithin.0.sock;
     51         server  unix:/tmp/apithin.1.sock;
     52         server  unix:/tmp/apithin.2.sock;
     53     }
     
    122         location / {
    123             # access_log    off;
    124             access_log  /dev/null;
    125 
    126             proxy_redirect  off;
    127             proxy_set_header    Host    $host;
    128             proxy_set_header    X-Real-IP   $remote_addr;
    129             proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
    130 
    131             if ( $args ~* "func=(change_pwd|restore_pwd)" ) {
    132                 access_log  logs/access.pwd.log real_ip_main;
    133             }
    134 
    135             proxy_pass  http://backend;
    136         }
    ```
    
 3. 主程序部署在[yun-new-nav-2-huazi](#fulu-jifang)
 4. 工作目录
 
    ```linux
    [huazi@A072302 httpd_sinatra_yun_new_nav2]$ pwd
    /home/huazi/httpd_sinatra_yun_new_nav2
    ```
    
 5. 主程序[^footnote-thin]
 
    > Ruby版本[^footnote-screen]
    
    ```linux
    [huazi@A072302 httpd_sinatra_yun_new_nav2]$ rvm list
    Warning! PATH is not properly set up, '/usr/local/rvm/gems/ruby-2.0.0-p598/bin' is not at first place,
             usually this is caused by shell initialization files - check them for 'PATH=...' entries,
             it might also help to re-add RVM to your dotfiles: 'rvm get stable --auto-dotfiles',
             to fix temporarily in this shell session run: 'rvm use ruby-2.0.0-p598'.
    
    rvm rubies
    
       ruby-1.9.3-p551 [ x86_64 ]
    =* ruby-2.0.0-p598 [ x86_64 ]
       ruby-2.1.3 [ x86_64 ]
       ruby-2.2.0 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```

#### 2. tcp协议
### 3. API服务器

#### **1. 统计分析和其它第三方API**

 1. 部署在[yun-new-nav-2-huazi](#fulu-jifang)
 2. 工作目录
    
    ```linux
    [huazi@A072302 httpd_api_sinatra_yun_new_nav2]$ pwd
    /home/huazi/httpd_api_sinatra_yun_new_nav2
    ```

 3. 服务器程序 [^footnote-thin]

    ```linux
    [huazi@A072302 httpd_api_sinatra_yun_new_nav2]$ screen -r 4284.httpd_api_sinatra_yun_new_nav2
    ```
 
    > Ruby版本
    
    ```linux
    [huazi@A072302 httpd_api_sinatra_yun_new_nav2]$ rvm list
    Warning! PATH is not properly set up, '/usr/local/rvm/gems/ruby-2.0.0-p598/bin' is not at first place,
             usually this is caused by shell initialization files - check them for 'PATH=...' entries,
             it might also help to re-add RVM to your dotfiles: 'rvm get stable --auto-dotfiles',
             to fix temporarily in this shell session run: 'rvm use ruby-2.0.0-p598'.
    
    rvm rubies
    
       ruby-1.9.3-p551 [ x86_64 ]
    =* ruby-2.0.0-p598 [ x86_64 ]
       ruby-2.1.3 [ x86_64 ]
       ruby-2.2.0 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```
 
    > 启动、停止、重启[^footnote-thin]
    
    ```linux
    [huazi@A072302 httpd_api_sinatra_yun_new_nav2]$ thin -C config/production.conf -R config.ru start
    
    [huazi@A072302 httpd_api_sinatra_yun_new_nav2]$ thin -C config/production.conf -R config.ru stop
    
    [huazi@A072302 httpd_api_sinatra_yun_new_nav2]$ thin -C config/production.conf -R config.ru restart
    ```

#### **2. 高德交通信息**

 1. 部署在[yun-new-nav-2-huazi](#fulu-jifang)，[yun-new-nav-3-huazi](#fulu-jifang)
 2. <span id='yun-new-nav-2-nginx'>***Nginx配置***</span>
    
    1. 在[yun-new-nav-2-root](#fulu-jifang)
    2. 安装目录
    
        ```linux
        [root@A072302 nginx]# pwd
        /usr/local/nginx
        ```
    
    3. 配置情况 
    
        ```linux
        [root@A072302 nginx]# ./nginx -V
        nginx version: nginx/1.8.0
        built by gcc 4.4.7 20120313 (Red Hat 4.4.7-11) (GCC) 
        built with OpenSSL 1.0.2a 19 Mar 2015
        TLS SNI support enabled
        configure arguments: --sbin-path=/usr/local/nginx/nginx --conf-path=/usr/local/nginx/nginx.conf --pid-path=/usr/local/nginx/nginx.pid --with-http_ssl_module --with-pcre=/usr/local/src/pcre-8.37 --with-zlib=/usr/local/src/zlib-1.2.8 --with-openssl=/usr/local/src/openssl-1.0.2a
        ```
    
    4. 运行情况
    
        ```linux
        [root@A072302 ~]# ps -ef | grep nginx | grep -v grep
        root      3819     1  0 Apr08 ?        00:00:00 nginx: master process ./nginx
        nobody   41598  3819  0 Jul26 ?        01:13:03 nginx: worker process
        nobody   41599  3819  0 Jul26 ?        01:11:49 nginx: worker process
        nobody   41600  3819  0 Jul26 ?        01:11:52 nginx: worker process
        nobody   41601  3819  0 Jul26 ?        01:12:01 nginx: worker process
        ```

 3. 相关的配置信息
 
    ```linux
    [root@A072302 nginx]# pwd
    /usr/local/nginx
    [root@A072302 nginx]# vim nginx.conf    
    ```

    ```nginx?linenums
     55     upstream apitrafficbackend {
     56         server  10.10.0.106:18880;
     57         server  10.10.0.106:18881;
     58         server  10.10.0.106:18882;
     59 
     60         server  10.10.0.105:18880;
     61         server  10.10.0.105:18881;
     62         server  10.10.0.105:18882;
     63         # server    unix:/tmp/apitrafficthin.0.sock;
     64         # server    unix:/tmp/apitrafficthin.1.sock;
     65         # server    unix:/tmp/apitrafficthin.2.sock;
     66         # server    unix:/tmp/apitrafficthin.3.sock;
     67 
     68         server  10.10.0.105:18883 backup;
     69         server  10.10.0.106:18883 backup;
     70     }
    ```

    ```
     85         location ~ traffic$ {
     86             # access_log    off;
     87             access_log  /dev/null;
     88             # access_log logs/trafic.log real_ip_main;
     89 
     90             proxy_redirect  off;
     91             proxy_set_header    Host    $host;
     92             proxy_set_header    X-Real-IP   $remote_addr;
     93             proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
     94 
     95             proxy_pass  http://apitrafficbackend;
     96         }
    ```

 4. 工作目录

    > [yun-new-nav-2-huazi](#fulu-jifang)
    
    ```linux
    [huazi@A072302 httpd_api_traffic_sinatra_yun_new_nav2]$ pwd
    /home/huazi/httpd_api_traffic_sinatra_yun_new_nav2
    ```

    > [yun-new-nav-3-huazi](#fulu-jifang)
    
    ```linux
    [huazi@localhost httpd_api_traffic_sinatra_yun_new_nav2]$ pwd
    /home/huazi/httpd_api_traffic_sinatra_yun_new_nav2
    ```
    
 5. 启动、停止、重启

    > [yun-new-nav-2-huazi](#fulu-jifang)
    
    ```linux
    [huazi@A072302 httpd_api_traffic_sinatra_yun_new_nav2]$ pwd
    /home/huazi/httpd_api_traffic_sinatra_yun_new_nav2
    
    [huazi@A072302 httpd_api_traffic_sinatra_yun_new_nav2]$ thin -C config/production.socket.conf -R config.ru start
    
    [huazi@A072302 httpd_api_traffic_sinatra_yun_new_nav2]$ thin -C config/production.socket.conf -R config.ru stop
    
    [huazi@A072302 httpd_api_traffic_sinatra_yun_new_nav2]$ thin -C config/production.socket.conf -R config.ru restart
    ```

    > [yun-new-nav-3-huazi](#fulu-jifang)
    
    ```linux
    [huazi@localhost httpd_api_traffic_sinatra_yun_new_nav2]$ pwd
    /home/huazi/httpd_api_traffic_sinatra_yun_new_nav2
    
    [huazi@localhost httpd_api_traffic_sinatra_yun_new_nav2]$ thin -C config/production.socket.conf -R config.ru start
    
    [huazi@localhost httpd_api_traffic_sinatra_yun_new_nav2]$ thin -C config/production.socket.conf -R config.ru stop
    
    [huazi@localhost httpd_api_traffic_sinatra_yun_new_nav2]$ thin -C config/production.socket.conf -R config.ru restart
    ``` 
 

### 4. 第三方服务器

#### **1. 贝尔**

 1. 部署在[yun-new-nav-1-huazi](#fulu-jifang)
 2. 工作目录
    ```linux
    [huazi@A072301 beier]$ pwd
    /home/huazi/beier
    ```
    
 3. 服务器程序[^footnote-screen]
    
    ```linux
    [huazi@A072301 ~]$ screen -r 3901.beier
    ```
  
    > Ruby版本
    
    ```linux
    [huazi@A072301 beier]$ rvm list

    rvm rubies

        ruby-1.9.3-p551 [ x86_64 ]
        ruby-2.0.0-p598 [ x86_64 ]
    =* ruby-2.2.0 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```
    
    ```
    [huazi@A072301 beier]$ ruby server_productionV5.rb 1>/dev/null 2>/dev/null
    ```

 4. 队列消费者

    ```linux
    [huazi@A072301 beier]$ screen -r 3372.worker_for_flow
    ```
    
    > Ruby版本
    
    ```linux
    [huazi@A072301 liuliang_server_release]$ rvm list

    rvm rubies
    
       ruby-1.9.3-p551 [ x86_64 ]
       ruby-2.0.0-p598 [ x86_64 ]
    =* ruby-2.2.0 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```
 
    ```linux
    [huazi@A072301 liuliang_server_release]$ ruby worker_for_flow.rb 1>/dev/null 2>/dev/null
    ```
    
### 5. 其它服务器

#### **1. 流量**

 1. 部署在[yun-new-nav-1-huazi](#fulu-jifang)
 2. 工作目录
    
    ```linux
    [huazi@A072301 liuliang_server_release]$ pwd
    /home/huazi/liuliang_server_release
    ```
    
 3. 服务器程序 [^footnote-screen]
 
    ```linux
    [huazi@A072301 liuliang_server_release]$ screen -r 3465.flowserver
    ```
    
    > Ruby版本
    
    ```linux
    [huazi@A072301 liuliang_server_release]$ rvm list
    
    rvm rubies
    
       ruby-1.9.3-p551 [ x86_64 ]
       ruby-2.0.0-p598 [ x86_64 ]
    =* ruby-2.2.0 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```
    
    ```linux
    [huazi@A072301 liuliang_server_release]$ ruby flowserver.rb 1>/dev/null 2>/dev/null
    ```

 4. 队列消费者

    ```linux
    [huazi@A072301 liuliang_server_release]$ screen -r 3614.worker_for_beier
    ```
    
    > Ruby版本
    
    ```linux
    [huazi@A072301 liuliang_server_release]$ rvm list
    
    rvm rubies
    
       ruby-1.9.3-p551 [ x86_64 ]
       ruby-2.0.0-p598 [ x86_64 ]
    =* ruby-2.2.0 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```    
    ```linux
    [huazi@A072301 beier]$ ruby worker_for_beierV1.rb 1>/dev/null 2>/dev/null
    ```
 
#### **2. 在路上**
1. 部署在[yun-new-nav-3-huazi](#fulu-jifang)
2. 工作目录

    ```linux
    [huazi@localhost geocoder_server]$ pwd
    /home/huazi/geocoder_server
    ```
    
3. 服务器程序 [^footnote-screen]

    ```linux
    [huazi@localhost geocoder_server]$ screen -r 4045.poi_and_onroad_server
    ```
    
    > Ruby版本
    
    ```linux
    [huazi@localhost geocoder_server]$ rvm list
    rvm rubies
    
       ruby-2.0.0-p643 [ x86_64 ]
       ruby-2.1.3 [ x86_64 ]
    =* ruby-2.2.1 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```
    
    ```linux
    [huazi@localhost geocoder_server]$ ruby serverV2.rb 1>/dev/null 2>/dev/null
    ```
    
4. 队列消费者
    ```linux
    [huazi@localhost geocoder_server]$ screen -r 3960.worker_for_onroad
    ```
    
    > Ruby版本
    
    ```linux
    [huazi@localhost geocoder_server]$ rvm list

    rvm rubies
    
       ruby-2.0.0-p643 [ x86_64 ]
       ruby-2.1.3 [ x86_64 ]
    =* ruby-2.2.1 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```
    
    ```linux
    [huazi@localhost geocoder_server]$ ruby worker_for_onroadV2.rb 1>/dev/null 2>/dev/null
    ```

#### **2. csr** [^footnote-csr]

 1. 部署在[yun-new-nav-3-huazi](#fulu-jifang)
 2. 工作目录
 
    ```linux
    [huazi@localhost csr]$ pwd
    /home/huazi/csr
    ```

 3. 服务器程序 [^footnote-screen]
 
    ```linux
    [huazi@localhost csr]$ screen -r 9560.csr
    ```
    
    > Ruby版本
    
    ```
    [huazi@localhost csr]$ rvm list

    rvm rubies
    
       ruby-2.0.0-p643 [ x86_64 ]
       ruby-2.1.3 [ x86_64 ]
    =* ruby-2.2.1 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default
    ```
    
    ```
    [huazi@localhost csr]$ ruby server.rb 1>/dev/null 2>/dev/null
    ```

## 2. 数据库
### 1. Apache Cassandra
### 2. Redis
### 3. Mongodb
## 3. 微信公众平台
### 1. 我会把应用转出来。
## 4. 杂项
### 1. 数据分析
(1) 部署在[yun-new-nav-2-huazi](#fulu-jifang)
(2) cron任务

```bash?linenums
#sm start rvm
PATH="/usr/local/rvm/gems/ruby-2.0.0-p598/bin:/usr/local/rvm/gems/ruby-2.0.0-p598@global/bin:/usr/local/rvm/rubies/ruby-2.0.0-p598/bin:/home/huazi/git/nvm/versions/node/v0.12.4/bin:/usr/local/rvm/gems/ruby-2.0.0-p598/bin:/usr/local/rvm/gems/ruby-2.0.0-p598@global/bin:/usr/local/rvm/rubies/ruby-2.0.0-p598/bin:/usr/lib64/qt-3.3/bin:/usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin:/usr/java/latest/bin:/usr/local/rvm/bin:/home/huazi/bin"
GEM_HOME='/usr/local/rvm/gems/ruby-2.0.0-p598'
GEM_PATH='/usr/local/rvm/gems/ruby-2.0.0-p598:/usr/local/rvm/gems/ruby-2.0.0-p598@global'
MY_RUBY_HOME='/usr/local/rvm/rubies/ruby-2.0.0-p598'
IRBRC='/usr/local/rvm/rubies/ruby-2.0.0-p598/.irbrc'
RUBY_VERSION='ruby-2.0.0-p598'
#sm end rvm 
10 2 * * * /usr/local/rvm/rubies/ruby-2.0.0-p598/bin/ruby /home/huazi/data_display/getimsi.rb >/dev/null 2>/dev/null
25 2 * * * /usr/local/rvm/rubies/ruby-2.0.0-p598/bin/ruby /home/huazi/data_display/run.rb &>/tmp/crontab.output
```

### 2. 采集数据
### 3. IOS版本轨迹查询
### 4. 卡导入
详细请看"**充值卡导入说明.doc**"

(1) 拿到的文本类似这样
```linux
$ head \[37\]_2016-09-06_\[40000\].pin
0765676342762836        1609000001
9777540357751078        1609000002
3922838376723160        1609000003
5979776355764951        1609000004
7932370375738269        1609000005
2705521336789547        1609000006
7072747383710363        1609000007
4532237379772800        1609000008
1537850305774026        1609000009
6426771329770308        1609000010
```
分别对应**card_number**和**sn**
！！！也有可能只有**card_number**，请务必注意。

(2) 根据数据表字段生成格式

```linux
$ awk '{print $1"\t""""\t""""\t""1""\t""1473408546""\t"$2}' \[37\]_2016-09-06_\[40000\].pin > 2016-09-06-40000.txt
```

```linux
$ head 2016-09-06-40000.txt
0765676342762836                        1       1473408546      1609000001
9777540357751078                        1       1473408546      1609000002
3922838376723160                        1       1473408546      1609000003
5979776355764951                        1       1473408546      1609000004
7932370375738269                        1       1473408546      1609000005
2705521336789547                        1       1473408546      1609000006
7072747383710363                        1       1473408546      1609000007
4532237379772800                        1       1473408546      1609000008
1537850305774026                        1       1473408546      1609000009
6426771329770308                        1       1473408546      1609000010
```
(3) 用excel打开，生成类似xls
(4) 用navcat for mysql导入

### 5. 电子狗数据更新上传
#### **1. 配置**   
1. 应用名称 meihua
2. 部署在 [yun-new-web-huazi](#fulu-jifang-web)
3. 域名 [http://www.e-dog.cn/downloads/go/yungo/home](http://www.e-dog.cn/downloads/go/yungo/home)
4. nginx配置

    ```linux
    [root@master ~]# vim /etc/nginx/conf.d/yungoservice.conf
    ```
    ```nginx
        location ^~ /downloads/go/yungo/ {
            root /home/huazi/goes/meihua;
            rewrite ^(/downloads/go/yungo/update)$ / break;
            rewrite ^(/downloads/go/yungo/)(.*)$ /$2 break;
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_set_header Host        $http_host;
            proxy_pass http://127.0.0.1:8080;
        }   
    ```
5. supervisor应用配置

    ```linux
    [root@master ~]# vim /etc/supervisord.d/go_meihua.conf
    ```
    ```yaml?linenums
    [program:meihua]
    directory = /home/huazi/goes/src/meihua
    command = /home/huazi/goes/src/meihua/meihua
    autostart = true
    startsecs = 5 
    user = huazi
    redirect_stderr = true
    stdout_logfile = /var/log/supervisord/go_meihua.log
    ```

#### **2. 启动和关闭**

```linux
[root@master ~]# supervisorctl stop meihua
meihua: stopped
[root@master ~]# supervisorctl start meihua
meihua: started
```

#### **3. 文件覆盖**
假设有两个数据更新文件
> data-tuotu-yungou.zip      dataV2-tuotu-yungou.zip 

覆盖服务器上的相同文件名即可。

```linux
[huazi@master ~]$ ls goes/src/meihua/download_resources/
data-tuotu-yungou.zip      dataV2-tuotu-yungou.zip      dvr_update201.exe  version
data-tuotu-yungou.zip.old  dataV2-tuotu-yungou.zip.old  update_201.exe
```

### 6. 批量删除设备轨迹

 1. 服务器在[yun-new-nav-2-huazi](#fulu-jifang)
 2. 工作目录
 
 ```bash
[huazi@A072302 ~]$ cd delete_track_bat
 ```
 
 3. 设备文件
 文件命名： device-年月日时分秒.txt，例如

 ```linux
 [huazi@A072302 delete_track_bat]$ vim device-201609091652.txt
 ```
 
 打开后，把设备号复制到这个文件。例如
 
 ```bash?linenums
28606855
23109569
27416737
29043406
22544717
20608332
27785326
26531030
23302167
27924066
29185161
29103463
23925341
20845136
22556939
26216413
28970236
25940287
23136806
 ```

 4. 修改bat.rb
 
 ```linux
 [huazi@A072302 delete_track_bat]$ vim bat.rb
 ```

 修改文件名。例如
 
 ```ruby
 require 'dbi'
 require 'cql'
 require 'time'

 begin
        # 请修改要打开文件的文件名。务必不要出错！！！！否则。。。
        fd = File.open("device-201609091652.txt", 'r')
        time_format_arr = Time.now.to_s.split(/ /)
        time_format = time_format_arr[0] + '-' +  time_format_arr[1].gsub(/:/,'')
        # fd_w = File.open("trackbackup-#{Time.now.to_s.split(/ /)[0]}", 'w')
        fd_w = File.open("trackbackup-#{time_format}", 'w')
        # ...other code
 ```

 5. 运行
 
 ```linux
 [huazi@A072302 delete_track_bat]$ ruby bat.rb
 ```
 
## 5. <span id="fulu">附录</span>
### **1. 服务器或应用名称说明**
涉及到的服务器，对应的真实ip地址和对应的用户。
#### <span id="fulu-jifang">机房服务器</span>
| 机器名称 | Public IP | Private IP | 备注 |
| --------- | :------------- | :-------------|:-----------------|
| yun-new-nav-1-root | 116.204.10.143 |10.10.0.104| 超级用户root|
| yun-new-nav-1-huazi | 116.204.10.143 | 10.10.0.104|普通用户huazi|
| yun-new-nav-2-root | 116.204.10.144 |10.10.0.105|超级用户root|
| yun-new-nav-2-huazi | 116.204.10.144 |10.10.0.105|普通用户huazi|
| yun-new-nav-3-root | 116.204.10.97 |10.10.0.106|超级用户root|
| yun-new-nav-3-huazi | 116.204.10.97 |10.10.0.106|普通用户huazi|

#### <span id="fulu-jifang-web">机房服务器(Web)</span>
| 机器名称 | IP地址 | 备注 |
| --------- | :------------- | :-------------|
| yun-new-web-huazi | 116.204.8.31 |普通用户huazi|
| yun-new-web-root | 116.204.8.31 |超级用户root|

#### <span id="fulu-ali">阿里云服务器</span>

| 机器名称 | IP地址 | 备注 |
| --------- | :------------- | :-------------|
| aliyun-a-root  | 120.24.61.27 | 超级用户root|
| aliyun-a-huazi |120.24.61.27 | 普通用户huazi|
| aliyun-b-root  |120.24.61.201 | 超级用户root|
| aliyun-b-huazi | 120.24.61.201 | 普通用户huazi|

#### <span id="fulu-sae">新浪云服务器</span>
| 应用名称 | 备注 |
| --------- |:--------|
| sae-tuotu |http://tuotu2013tp.sinaapp.com|

### **2. <span id="fulu-lang">编程语言说明</span>**
以ruby-2.1.3为例。
|名称| 语言 | 版本| 备注|
|------------|:----------|:---------|:---------|
|ruby-2.1.3|ruby|2.1.3|

### **3. 机房断电重启服务流程参考**

[^footnote-screen]: 服务器程序管理，建议用 **supervisord** 代替。请务必注意，进入screen终端后，如果不是用默认的Ruby版本，需要执行命令rvm use ruby-[version]，选定你需要的Ruby版本。

[^footnote-csr]: 服务器好像已经失效。

[^footnote-thin]: 因为基于thin，其实完全不需要screen，可以配置成daemon程序。

[^footnote-img]: 如果图片不能显示或者模糊，请在当前文件夹找到响应图片，直接查看。


