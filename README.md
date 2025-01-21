# funXblock 1.84z for funXbot and funXdrone
目前僅有 Windows 版

# 安裝方法
1. 下載 Kittenblock 1.8.4 ( -> https://reurl.cc/O5zqKy )後安裝
2. 於此處( https://github.com/robot4fun/xblock1.84z )下載 xblock1.84z 後解壓縮
![github.jpg](./github.jpg)
3. 以 "管理員權限" 執行 install.bat


# funXbot v1 使用注意事項
1. 接口1A不能和主機內建 光強度感應器 同時使用
2. 接口1B不能和主機內建 滑動式可變電阻(紅嘴) 同時使用
3. 接口2B不能和主機內建 聲強度感應器 同時使用
4. 程式積木所指x軸為朝接口5-8方向; y軸朝向USB及電源接口方向
![xyz.jpg](./xyz.jpg)
5. 安插 funXtcp WiFi 模組時, 白色標記需和主控器無線通訊接口白色標記對齊
![wifi.jpg](./wifi.jpg)
6. 無線通訊接口無法和有線通訊接口(USB) 同時使用. 使用USB前, 請先拔除funXtcp WiFi 模組
7. 使用無線通訊前, 需先在Windows 連無線網路(預設密碼12345678), 再在funXblock中連 funXbot