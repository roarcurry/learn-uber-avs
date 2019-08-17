---
title: '[AVS] XVIZ - Tool'
subtitle: ''
catalog: true
toc_nav_num: false
header-img: /img/header_img/avs/avs.jpg
tags:
  - AVS
categories:
  - AVS
date: 2019-07-08 14:50:58
---



> 推荐阅读：
> [XVIZ - Tool | AVS](https://avs.auto/#/xviz/xviz-tool/overview)
> [XVIZ - Github | Uber ](https://github.com/uber/xviz)


# 1. Overview
`xviz` tool 是 XVIZ 客户端或服务器开发人员工具包中的主程序。此工具的目标是将 `curl`、`wget`、简单的 HTTP Server 和规范验证器组合在一起。

下面是一个通过 websocket 从本地服务器转储数据到日志 `9f54b978-1186-4082-a2e6-e8f1e70abdd7` 中的示例：
```
$ xviz dump --condensed ws://localhost:8088 9f54b978-1186-4082-a2e6-e8f1e70abdd7
[CONNECTED]
[< START]
[> METADATA] version: 2.0.0
[< TRANSFORM_LOG] LOG-START - LOG-END (tid: f8b38a41-59fa-44b9-9311-cd612886bb37)
[> STATE_UPDATE] time: 1317042272.349
...
[> STATE_UPDATE] time: 1317042288.15
[> TRANSFORM_LOG_DONE] tid: f8b38a41-59fa-44b9-9311-cd612886bb37
[CONNECTION CLOSED]
```

## 1.1 XVIZ Data Location
所有命令都以 xviz data location 开头，该位置指定要处理的 XVIZ 数据的来源以及绑定它的选项。
```
<host|path> [<log>] [-s <time>] [-e <time>]

host   URL to connect, supports only websocket
path   file system path
log    id or name of log, if not passed “live” mode is assumed

-s, --start     Get data after this starting point, inclusive.
-e, --end       Get data up to this point, inclusive.
```

## 1.2 Subcommands
目前可用的 Subcommands：
+ [dump](#2-dump) - 输出 XVIZ 内容到 stdout。
+ [validate](#3-validate) - 确保data 和 server 符合规范。

## 1.3 Future subcommands
xviz tool 将来计划支持的命令：
+ `log` - 保存 XVIZ 到硬盘。
+ `analyze` - 分析统计数据。
+ `serve` - 服务器通过 websocket 提供日志。
+ `render` - 从 XVIZ 数据创建图像或视频。
+ `bench` - 测量 XVIZ 服务器的性能。


---
# 2. Dump
## 2.1 Overview
通过这个，可以看到 XVIZ Server 提供的数据和调试连接问题。
```
xviz dump DATAARGS [-m] [-c]

Display the content to disk.

-m, --metadata    Request just metadata
-c, --condensed   Display short summary information.
```

## 2.2 Dump to stdout
在完整日志上连接并执行 `transform_log`，以打印的形式将内容流式传输到 stdout：
```
$ xviz dump ws://localhost:8081 630e522f-d2b1-403c-a9a3-468b398cbf60
{
  “type”: “xviz/metadata,
  “data”: {
    “version”: “2.0.0”
   }
}
{
  “type: “xviz/state_update
  “data”: {
  ...
```

## 2.3 Get metadata
只获取和显示 metadata：
```
$ xviz dump --metadata ws://localhost:8081 630e522f-d2b1-403c-a9a3-468b398cbf60
{
  “version”: “2.0.0”,
  ...
```

## 2.4 Condensed view
显示有关工作服务器的最小摘要信息：
```
$ xviz dump --condensed ws://localhost:8081 630e522f-d2b1-403c-a9a3-468b398cbf60
[METADATA] version 2.0.0 time: 123456 - 123660 streams: 320
[STATE_UPDATE] time: 123456.0 - 123456.1 updates: 2 streams: 4 items: 84
...
```


---
# 3. Validate
## 3.1 Overview
此工具将检查数据是否与架构匹配，并遵循会话协议。
```
xviz validate DATAARGS

Validate the resulting XVIZ data, making sure:
 - All data conforms to the XVIZ schema
 - The message flow matches protocol specification
 - Additional non-schema specification invariants are met

-c, --condensed   Show a short summary errors
```

## 3.2 Condensed
此视图显示您获得的每种类型的消息数以及您获得的错误数。可以随时使用 `Ctrl-C` 退出并获取到此时处理的消息结果。
```
$ xviz validate --condensed ws://localhost:8081 630e522f-d2b1-403c-a9a3-468b398cbf60
┌────────────────────┬───────┬─────────┬───────┬───────────────┐
│ Type               │ Count │ Invalid │ Inv % │ Unique Errors │
├────────────────────┼───────┼─────────┼───────┼───────────────┤
│ START              │ 1     │ 0       │ 0.0   │ 0             │
├────────────────────┼───────┼─────────┼───────┼───────────────┤
│ METADATA           │ 1     │ 1       │ 100.0 │ 1             │
├────────────────────┼───────┼─────────┼───────┼───────────────┤
│ TRANSFORM_LOG      │ 1     │ 0       │ 0.0   │ 0             │
├────────────────────┼───────┼─────────┼───────┼───────────────┤
│ STATE_UPDATE       │ 154   │ 13      │ 8.4   │ 2             │
├────────────────────┼───────┼─────────┼───────┼───────────────┤
│ TRANSFORM_LOG_DONE │ 1     │ 0       │ 0.0   │ 0             │
└────────────────────┴───────┴─────────┴───────┴───────────────┘
```

## 3.3 Detailed
详细视图会显示每个错误，因为它会导致错误消息，这可以让您缩小问题范围。在此示例中，`stream_style` 对象具有必须删除的非标准线框样式。
```
$ xviz validate ws://localhost:8081 630e522f-d2b1-403c-a9a3-468b398cbf60
VALIDATION ERROR:
  TYPE: METADATA
  DETAILS:
    Error: Validation errors: [
      {
        "keyword": "additionalProperties",
        "dataPath": ".streams['/tracklets/objects'].stream_style",
        "schemaPath": "#/additionalProperties",
        "params": {
          "additionalProperty": "wireframe"
        },
        "message": "should NOT have additional properties"
      }
    ]
  MSG:
    {
        "version": "2.0.0",
        "streams": {
            "/tracklets/objects": {
                "category": "primitive",
                "coordinate": "VEHICLE_RELATIVE",
                "stream_style": {
                    "extruded": true,
                    "wireframe": true,
                    "fill_color": "#00000080"
                },
   ...
```



---
返回 [AVS 专题](/2019/07/05/avs)










