# 📊 Tarım Asistanı - UML ve Tasarım Dokümantasyonu

Bu doküman, **BLG330 - Web Programlama Dönem Projesi** gereksinimleri doğrultusunda hazırlanan UML diyagramlarını ve veritabanı şema tasarımlarını içermektedir. Diyagramlar modern **Mermaid.js** formatında hazırlanmış olup, uyumlu herhangi bir Markdown okuyucuda (GitHub vb.) veya Mermaid editörlerinde canlı olarak görüntülenebilir.

---

## 1. Use-Case (Kullanım Senaryosu) Diyagramı

Use-Case diyagramı, sistemin ana aktörü olan **Çiftçi (Kullanıcı)** ile sistemin sunduğu fonksiyonel özellikler arasındaki ilişkileri gösterir.

```mermaid
usecaseDiagram
    actor Ciftci as "🌾 Çiftçi (Kullanıcı)"

    rect "Tarım Asistanı Sistemi"
        usecase UC_Reg as "Kayıt Ol (Register)"
        usecase UC_Log as "Giriş Yap (Login)"
        usecase UC_Me as "Profil Bilgilerini Görüntüle"
        
        usecase UC_F_Add as "Yeni Tarla Ekle"
        usecase UC_F_List as "Tarlaları Listele"
        usecase UC_F_Update as "Tarla Bilgilerini Güncelle"
        usecase UC_F_Del as "Tarla Sil"
        
        usecase UC_A_Add as "Aktivite Kaydı Ekle (Ekim, Sulama vb.)"
        usecase UC_A_List as "Aktiviteleri Listele ve Filtrele"
        usecase UC_A_Update as "Aktivite Güncelle"
        usecase UC_A_Del as "Aktivite Sil"
        
        usecase UC_Rep as "Maliyet ve Gelir Raporlarını İncele"
    end

    %% Aktörün Yetkisiz Yapabildiği İşlemler
    Ciftci --> UC_Reg
    Ciftci --> UC_Log

    %% Aktörün Yetkili (Giriş Yaptıktan Sonra) Yapabildiği İşlemler
    Ciftci --> UC_Me
    Ciftci --> UC_F_Add
    Ciftci --> UC_F_List
    Ciftci --> UC_F_Update
    Ciftci --> UC_F_Del
    Ciftci --> UC_A_Add
    Ciftci --> UC_A_List
    Ciftci --> UC_A_Update
    Ciftci --> UC_A_Del
    Ciftci --> UC_Rep

    %% İlişkiler ve Korumalı Rota Gereksinimi
    note right of UC_Me : "Korumalı Rota (JWT Authorization)"
    note right of UC_F_Add : "Korumalı Rota (JWT Authorization)"
    note right of UC_A_Add : "Korumalı Rota (JWT Authorization)"
```

---

## 2. Activity (Aktivite / İş Akış) Diyagramı

Aşağıdaki diyagram, bir çiftçinin **"Yeni Aktivite Kaydı Oluşturma (Maliyet/Gelir Kaydı)"** sürecinin iş akışını ve sistemin yanıt verme adımlarını gösterir.

```mermaid
stateDiagram-v2
    [*] --> Dashboard : Giriş Yapılmış
    Dashboard --> AktivitelerSekmesi : "Aktivite Ekle" Butonuna Basılır
    
    state AktivitelerSekmesi {
        [*] --> TarlaKontrolu
        TarlaKontrolu --> TarlaEklemeUyarisi : "Kullanıcının Tarlası Yoksa"
        TarlaEklemeUyarisi --> [*] : Tarla Ekleme Sayfasına Yönlendir
        
        TarlaKontrolu --> FormGosterimi : "En Az 1 Tarla Varsa"
        FormGosterimi --> BilgileriDoldur : "Türü, Miktar, Maliyet, Gelir vb. girilir"
    }

    BilgileriDoldur --> FormGonder : "Kaydet" Butonuna Basılır
    
    state Backend_Dogrulama {
        [*] --> GirdiValidasyonu
        GirdiValidasyonu --> HataResponse : "Zorunlu alan eksik veya hatalıysa"
        GirdiValidasyonu --> DbKayit : "Veri Geçerliyse"
        
        HataResponse --> FormGosterimi : Frontend'de Hata Mesajı Gösterilir
        DbKayit --> RaporlariGuncelle : MongoDB'ye Yazma Başarılı
    }
    
    RaporlariGuncelle --> BasariliToast : "success: true" Döner
    BasariliToast --> Dashboard : Dashboard Güncel Verilerle Yenilenir
    Dashboard --> [*]
```

---

## 3. Veritabanı ER (Entity-Relationship) Diyagramı

Mongoose şemaları kullanılarak oluşturulan veritabanı modellerinin (User, Field, Activity) alanlarını ve aralarındaki bire-çok (1:N) ilişkilerini gösteren ER diyagramı.

```mermaid
erDiagram
    USER ||--o{ FIELD : "sahiptir (1:N)"
    USER ||--o{ ACTIVITY : "yapar (1:N)"
    FIELD ||--o{ ACTIVITY : "ilişkilidir (1:N)"

    USER {
        ObjectId _id PK
        String name "Zorunlu, Maks 50 karakter"
        String email "Zorunlu, Benzersiz (Unique)"
        String password "Zorunlu, Hashlenmiş (bcrypt)"
        String phone "İsteğe Bağlı"
        String location "İsteğe Bağlı"
        Date createdAt "Default: Date.now"
    }

    FIELD {
        ObjectId _id PK
        ObjectId userId FK "User modeline referans"
        String cropName "Enum: Buğday, Arpa, Mısır, Pamuk, Domates, Biber, Patlıcan, Soğan, Patates, Diğer"
        Number area "Zorunlu, Minimum 0.1"
        String areaUnit "Default: dönüm, Enum: dönüm, hektar, m²"
        Date plantingDate "Zorunlu"
        Date expectedHarvestDate "Zorunlu"
        String soilType "Default: Tınlı, Enum: Killi, Kumlu, Tınlı, Organik"
        String waterRequirement "Default: Normal"
        String status "Default: Ekim, Enum: Hazırlık, Ekim, Büyüme, Olgunlaşma, Hasat, Tamamlandı"
        String description "Maks 500 karakter"
        Array notes "İçerik ve Tarih tutan dizi"
        Date createdAt
    }

    ACTIVITY {
        ObjectId _id PK
        ObjectId fieldId FK "Field modeline referans"
        ObjectId userId FK "User modeline referans"
        String activityType "Enum: Ekim, Sulama, Gübreleme, İlaçlama, Çapalama, Hasat, Depolama, Diğer"
        Date date "Default: Date.now"
        Number duration "Saat Cinsinden"
        Number quantity "Miktar (litre, kg vs.)"
        String unit "Default: kg"
        String weatherCondition "Enum: Güneşli, Bulutlu, Yağmurlu, Kar, Dolu, Rüzgarlı"
        Number temperature "Sıcaklık (°C)"
        Number humidity "Nem Oranı (%, 0-100)"
        String notes "Maks 1000 karakter"
        Array images "Görsel URL dizisi"
        Number cost "Default: 0 ₺"
        Number income "Default: 0 ₺"
        String result "Maks 500 karakter"
        Date createdAt
    }
```

---

## 4. Component Relationship (React Bileşen Hiyerarşisi) Diyagramı

React uygulamasının (Frontend) bileşen ağacını, global Context sarmalayıcısını ve korumalı rotaların sayfa bileşenleriyle ilişkisini gösteren yapı şeması.

```mermaid
graph TD
    %% Global Wrappers
    App[App.jsx - Root Router]
    AuthProvider[AuthContext.js - AuthProvider]
    GlobalCSS[global.css & navbar.css]
    
    %% Navigation
    Navbar[Navbar.jsx - Ortak Navigasyon]

    %% Routes
    Routes{React Router Dom - Routes}
    
    %% Public Pages
    Home[Home.jsx - Tanıtım Sayfası]
    LoginPage[LoginPage.jsx]
    RegisterPage[RegisterPage.jsx]
    LoginForm[LoginForm.jsx]
    RegisterForm[RegisterForm.jsx]
    
    %% Protected Route Middleware
    ProtectedRoute[ProtectedRoute.jsx - Auth Guard]

    %% Protected Pages
    Dashboard[Dashboard.jsx - Özet İstatistikler]
    FieldsPage[FieldsPage.jsx - Tarla Yönetimi]
    ActivitiesPage[ActivitiesPage.jsx - İşlem Takibi]
    ReportsPage[ReportsPage.jsx - Finansal Raporlar]

    %% Child Components
    FieldCard[FieldCard.jsx - Tarla Kartı]
    FieldForm[FieldForm.jsx - Ekle/Düzenle Formu]
    ActivityCard[ActivityCard.jsx - Aktivite Kartı]
    ActivityForm[ActivityForm.jsx - Ekle/Düzenle Formu]
    
    %% Common UI Helpers
    LoadingSpinner[LoadingSpinner.jsx]
    Alert[Alert.jsx - Bilgi Mesajı]

    %% Hiyerarşik Bağlantılar
    App --> AuthProvider
    AuthProvider --> GlobalCSS
    AuthProvider --> Navbar
    AuthProvider --> Routes

    %% Rotaya Göre Sayfalar
    Routes -->|/| Home
    Routes -->|/login| LoginPage
    Routes -->|/register| RegisterPage
    Routes -->|Korumalı Rotalar| ProtectedRoute

    LoginPage --> LoginForm
    RegisterPage --> RegisterForm

    %% Korumalı Sayfalar
    ProtectedRoute --> Dashboard
    ProtectedRoute --> FieldsPage
    ProtectedRoute --> ActivitiesPage
    ProtectedRoute --> ReportsPage

    %% Bileşenlerin Çocukları
    FieldsPage --> FieldCard
    FieldsPage --> FieldForm
    ActivitiesPage --> ActivityCard
    ActivitiesPage --> ActivityForm

    %% Ortak UI Kullanımları
    Dashboard -.-> LoadingSpinner
    Dashboard -.-> Alert
    FieldsPage -.-> LoadingSpinner
    FieldsPage -.-> Alert
    ActivitiesPage -.-> LoadingSpinner
    ActivitiesPage -.-> Alert
    ReportsPage -.-> LoadingSpinner
    ReportsPage -.-> Alert

    classDef wrapper fill:#e1f5fe,stroke:#039be5,stroke-width:2px;
    classDef page fill:#efebe9,stroke:#5d4037,stroke-width:2px;
    classDef component fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef helper fill:#fffde7,stroke:#fbc02d,stroke-dasharray: 5 5;

    class App,AuthProvider,Routes,ProtectedRoute wrapper;
    class Home,LoginPage,RegisterPage,Dashboard,FieldsPage,ActivitiesPage,ReportsPage page;
    class Navbar,LoginForm,RegisterForm,FieldCard,FieldForm,ActivityCard,ActivityForm component;
    class LoadingSpinner,Alert helper;
```

---

## 💡 Diyagramları Raporunuz için PDF veya Görsele Dönüştürme Yolu

Mermaid diyagramlarını Word veya PDF formatındaki proje raporunuza eklemek için şu adımları takip edebilirsiniz:

1. **[Mermaid Live Editor](https://mermaid.live/)** adresine gidin.
2. Yukarıdaki diyagram kodlarından birini kopyalayıp sol taraftaki kod alanına yapıştırın.
3. Sağ alt köşedeki **"PNG"** veya **"SVG"** indirme butonlarına basarak diyagramı yüksek kalitede bilgisayarınıza indirin.
4. İndirdiğiniz görseli projenizin rapor dosyasına doğrudan ekleyebilirsiniz.
