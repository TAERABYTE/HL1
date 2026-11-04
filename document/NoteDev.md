## การ build 

ให้เริ่มที่ build:hl1 > build:css > build:js ตามลำดับได้เลย


---



## ถ้า CDN มันมีแคชเก่า (หลัง push ขึ้น main) ให้กดลิงก์ purge ด้านล่าง

กดเปิดทีละลิงก์ → jsDelivr จะล้างแคชให้ (ขึ้น `"status": "finished"` = สำเร็จ)

- [Purge HL1.min.js](https://purge.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.js)
- [Purge HL1.min.css](https://purge.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.css)
- [Purge HL1.scoped.min.css](https://purge.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.scoped.min.css)

ถ้ายังเห็นของเก่าอยู่ = แคชของ browser → กด `Ctrl + F5` (hard reload)



## 1dev.html มีใว้เพื่อเทสส่วนใหม่ๆ แล้วก็รวม code UI ที่พัฒนามาใช้งาน




## escape แปลง code ปกติ ใส่ใน <code>
[escape](https://codebeautify.org/html-escape-unescape)