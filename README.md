# 说明

请先阅读 https://github.com/lqzhgood/Shmily

此工具是将 CallLog 和 SMS 数据文件(`Shmily-Msg` 格式) 合并去重的工具

支持以下库的数据文件

-   [Shmily-Get-Call_SMS-Android](https://github.com/lqzhgood/Shmily-Get-Call_SMS-Android)
-   [Shmily-Get-Call_SMS-calendar_google_com](https://github.com/lqzhgood/Shmily-Get-Call_SMS-calendar_google_com)
-   [Shmily-Get-Call_SMS-i_Mi_com](https://github.com/lqzhgood/Shmily-Get-Call_SMS-i_Mi_com)
-   [Shmily-Get-Call_SMS-ic_qq_com](https://github.com/lqzhgood/Shmily-Get-Call_SMS-ic_qq_com)
-   [Shmily-Get-Call_SMS-S60v3_MMS](https://github.com/lqzhgood/Shmily-Get-Call_SMS-S60v3_MMS)
-   [Shmily-Get-Call_SMS-S60v3_SMS](https://github.com/lqzhgood/Shmily-Get-Call_SMS-S60v3_SMS)

这里接收从 GET 中处理的数据，GET 中仅初步去重，排序~这里需要精细化处理。 <br/>

-   去重
-   过滤
-   合并
-   排序

例如 Get 中有多个渠道得到的 SMS 需要先合并处理 再合并到全部

### 使用

0. 安装 node 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/nodejs.html]
1. 按类别放到 input 里面

    ```
    - input
        - logs
        - sms
    - input_diy 本文件夹下相应类型中的文件会无条件合并进去
        - logs
        - sms
        - fix.js 中可以编写手动修正 msg 的代码
    ```

2. `npm run start`

### 合并注意事项

通过 `makeUniqString` 函数拼接大部分属性来实现`msg`的 ID。这个 ID 多用来去重合并。

```
严格意义上这个 ID 是不精确的（不可保证唯一）
```

ID 生成的算法导致在 _"重要的事情说三遍"_ 事件（相同内容短时间多次发送）中的 `msg` 极度依赖采集源 `ms(发送的时间戳)` 的唯一性。

但是某些来源只提供粗略的时间，非时间戳从而导致丢失了毫秒精度，如 `2020/11/01 12:33:38`,所以在下列例子中消息去重若采用这种 ID 算法 将被去重为一条消息。

```
[
    {body:'蓄力....',time:`2020/11/01 12:33:34`},
    {body:'我是重要的事情,我要说三遍',time:`2020/11/01 12:33:38`},
    {body:'我是重要的事情,我要说三遍',time:`2020/11/01 12:33:38`},
    {body:'我是重要的事情,我要说三遍',time:`2020/11/01 12:33:38`},
    {body:'休息...',time:`2020/11/01 12:33:48`},
]

```

根据现有人类的手速，至少是她的手速，是完全有能力在 1s 时间内发送 N 条同样内容的消息的。(Ctrl+V Ctrl+Enter)\*N。 <br/>
严谨的说得到了时间戳（ms 精度）也不能保证是唯一，例如短信，在无信号情况下（如飞行模式），编辑多条短信发送后再联通网络。多条短信将会在同一时刻（联网）发送出去，他们的时间戳极有可能是一样的。早期通过短信刷 QQ 会员/钻等服务就是用的这个原理。但是这个情况太少了，这里就忽略了。

```
因此根据是否能获取毫秒精度（来源提供时间戳）可将ID分为 `精确` 和 `非精确`,对于 `非精确` 只能手动合并。
```

#### 手动合并处理

```
1 2 3         4
  |           |
    |         |
| | |         |
  |           |
  |     -->   |
| |           |
|   |         |
| | |         |
    |         |
| |           |

```

如图有三个来源的消息(1,2,3),由于消息基本是以时间顺序连续线性排列，非杂乱的，因此手动合并的工作量并不大，使用 `Beyond _Compare` 等软件可以很方便的得到 4。

### logs

注意 name 的去重, 如果为空补 硬编码
|repo| 路径 | ID | 输入 |备注 |
|---|---|---|---|---|
|[Shmily-Get-Call_SMS-Android](https://github.com/lqzhgood/Shmily-Get-Call_SMS-Android)|/AndroidBackup/dist/logs/| 精确 | input ||
|[Shmily-Get-Call_SMS-calendar_google_com](https://github.com/lqzhgood/Shmily-Get-Call_SMS-calendar_google_com)|/calendar_google_com/callLogs/dist/| 非精确 |input | 使用 `$CallLog.duration` 可得到精确 |

### SMS

注意 name 的去重, 如果为空补 硬编码
|repo| 路径 | ID | 输入 |备注 |
|---|---|---|---|---|
|[Shmily-Get-Call_SMS-Android](https://github.com/lqzhgood/Shmily-Get-Call_SMS-Android)|/AndroidBackup/dist/sms/| 精确 | input| |
|[Shmily-Get-Call_SMS-i_Mi_com](https://github.com/lqzhgood/Shmily-Get-Call_SMS-i_Mi_com)|/i_Mi_com/SMS/dist/| 精确 |input |
|[Shmily-Get-Call_SMS-ic_qq_com](https://github.com/lqzhgood/Shmily-Get-Call_SMS-ic_qq_com)|/ic_qq.com/sms/dist/|非精确|input_diy|
