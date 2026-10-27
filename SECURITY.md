# Güvenlik

KPSS Rehber tamamen statik bir sitedir: sunucu, hesap sistemi, çerez ve analitik yoktur. Öğrencinin ilerlemesi yalnızca kendi tarayıcısında (localStorage) tutulur ve hiçbir yere gönderilmez.

## Açık bildirme

Bir güvenlik açığı bulduysan lütfen **herkese açık issue açma**. Bunun yerine repodaki **Security → Report a vulnerability** bağlantısıyla özel olarak bildir. Bildirimde şunlar olsun:

- Açığın kısa tanımı ve etkisi
- Yeniden üretme adımları (sayfa adresi, tarayıcı)
- Varsa önerdiğin çözüm

Bildirimler en geç 7 gün içinde yanıtlanır. Düzeltme yayınlanana kadar ayrıntıları paylaşmaman rica edilir.

## Kapsam

- Sitenin kendisi (`https://unseensenpai.github.io/kpss-rehber/`) ve bu repodaki kod
- Özellikle: CSP'yi aşan script çalıştırma, prompt kartları veya yedek dosyası üzerinden XSS, kullanıcı verisinin dışarı sızması

ChatGPT, Claude ve ÖSYM gibi bağlantı verilen dış siteler kapsam dışındadır.
