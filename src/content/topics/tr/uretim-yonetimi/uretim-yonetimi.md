---
title: "Üretim Yönetimi"
subject: uretim-yonetimi
state: draft
subtopics:
  - Üretim sistemleri ve türleri
  - Kuruluş yeri seçimi ve tesis yerleşimi
  - Talep tahmini ve kapasite planlama
  - Stok yönetimi
  - Malzeme ihtiyaç planlaması ve tam zamanında üretim
  - Kalite yönetimi
  - İş etüdü ve proje planlama
keyConcepts: [sipariş tipi üretim, sürekli üretim, ürüne göre yerleşim, sürece göre yerleşim, sabit konumlu yerleşim, Delphi yöntemi, üstel düzeltme, ekonomik sipariş miktarı, ABC analizi, güvenlik stoku, MRP, tam zamanında üretim (JIT), Kanban, toplam kalite yönetimi, PUKÖ döngüsü, CPM ve PERT]
questionStyle: "Bir üretim ya da yerleşim türünü özellikleriyle tanıma; ekonomik sipariş miktarı gibi basit hesaplar yapma; JIT, MRP ve kalite yaklaşımlarının temel ilkelerini ayırt etme"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Temel fikir

Üretim yönetimi, girdileri (hammadde, emek, makine, bilgi) mal ve hizmete dönüştüren sürecin **planlanması, örgütlenmesi ve denetimidir**. Amaç doğru miktarı, doğru kalitede, doğru zamanda ve en düşük maliyetle üretmektir. Testte **10 soru** vardır; sorular üretim ve yerleşim türlerini tanımayı, stok ve tahmin hesaplarını, JIT ve kalite yaklaşımlarının ilkelerini sorar.

## Üretim sistemleri

- **Sipariş (atölye) tipi üretim:** Müşteri isteğine göre az miktarda, çeşitli ürün; genel amaçlı makine ve nitelikli işçi.
- **Parti (kesikli) üretim:** Belirli miktarlarda, aralıklı üretim; makineler partiler arasında yeniden ayarlanır.
- **Seri (kitle) ve sürekli (akış) üretim:** Standart ürün, yüksek hacim, özel amaçlı makine; rafineri ve çimento sürekli üretime örnektir.
- **Proje tipi üretim:** Köprü, gemi, baraj gibi tek seferlik büyük işler.

## Kuruluş yeri ve tesis yerleşimi

- **Kuruluş yeri** pazar, hammadde, işgücü, enerji, ulaşım ve teşvik gibi etkenlere göre seçilir; ağırlıklı puanlama ve başabaş analizi kullanılır.
- **Ürüne göre (hat) yerleşim:** Makineler ürünün işlem sırasına göre dizilir; seri üretime uygundur, **hat dengeleme** gerekir.
- **Sürece (fonksiyona) göre yerleşim:** Benzer makineler aynı bölümde toplanır; sipariş tipi üretime uygundur.
- **Sabit konumlu yerleşim:** Ürün yerinde kalır, kaynaklar ona taşınır (gemi, uçak).
- **Hücresel yerleşim (grup teknolojisi):** Benzer parçalar için makine hücreleri oluşturulur.

## Tahmin ve stok yönetimi

- **Talep tahmini:** Nitel yöntemler (uzman görüşü, **Delphi**: uzmanlardan isimsiz ve tekrarlı görüş alma) ve nicel yöntemler (**hareketli ortalama**, **üstel düzeltme**, regresyon).
- **Ekonomik sipariş miktarı (EOQ):** Sipariş ve elde tutma maliyetlerinin toplamını en aza indiren miktar: EOQ = karekök(2DS / H). D yıllık talep, S sipariş başına maliyet, H birim başına yıllık elde tutma maliyetidir.
- **Yeniden sipariş noktası:** Günlük kullanım × tedarik süresi (+ güvenlik stoku).
- **ABC analizi:** A grubu az sayıda ama değeri en yüksek kalemler olup en sıkı denetlenir; C grubu çok sayıda düşük değerli kalemdir.

## Modern üretim yaklaşımları

- **MRP (malzeme ihtiyaç planlaması):** Ana üretim çizelgesi, ürün ağacı ve stok kayıtlarından bağımlı talepli malzemelerin ne zaman ve ne kadar gerektiğini hesaplar. **ERP** bunu tüm işletme fonksiyonlarına genişletir.
- **Tam zamanında üretim (JIT):** Gerektiği kadar, gerektiği anda üretim; stoğu israf sayar. **Kanban** kartlarıyla çekme sistemi işler.
- **Yalın üretim:** Fazla üretim, bekleme, taşıma, stok, gereksiz hareket ve hata gibi israfları ortadan kaldırma.

## Kalite ve iş planlama

- **Toplam kalite yönetimi:** Müşteri odaklılık, sürekli iyileştirme (**kaizen**), tüm çalışanların katılımı.
- **PUKÖ (Deming) döngüsü:** Planla, Uygula, Kontrol et, Önlem al.
- **Altı sigma:** Süreç değişkenliğini azaltarak hata oranını çok düşük düzeye indirme. **Kontrol çizelgeleri** sürecin kontrol sınırları içinde olup olmadığını izler.
- **İş etüdü:** **Metot etüdü** işin en iyi yöntemini, **iş ölçümü** standart süreyi belirler.
- **Proje planlama:** **CPM** kesin süreli faaliyetlerle **kritik yolu** (en uzun yol; gecikmesi projeyi geciktirir) bulur; **PERT** iyimser, en olası ve kötümser süreyle beklenen süreyi (a + 4m + b) / 6 hesaplar. **Gantt şeması** işleri zamana karşı çubuklarla gösterir.

## Sık karıştırılanlar

- *Ürüne göre yerleşim* seri üretime, *sürece göre yerleşim* sipariş tipi üretime uygundur.
- *MRP* itme mantığıyla plana göre, *JIT* çekme mantığıyla talebe göre üretir.
- *CPM* kesin süreler, *PERT* olasılıklı süreler kullanır.

## Çalışma ipucu

EOQ, yeniden sipariş noktası ve PERT beklenen süre formüllerini birer küçük örnekle çöz; sayısal sorular genellikle bu üçünden gelir. Sözel sorularda ise üretim türü ile yerleşim türünü birlikte eşleştirerek düşün.
