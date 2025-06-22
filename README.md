# Dokumentacja projektu
## Wymagania
1. Node.js
2. MongoDB
3. (Opcjonalne) MongoDB Compass
## 🟥 Ważne informacje!
1. Aplikacja posiada wbudowane konto admin z hasłem admin.
## ⚙️ Instrukcja uruchomienia
1. Uruchomić server.js znajdujący się w katalogu www za pomocą polecenia node
## ⚙️ Instrukcja importu (MongoDB Compass)
1. Pobrać przykładowe dane np. z folderu example_import z repozytorium
2. W MongoDB Compass stworzyć następujące połączenie: mongodb://localhost:27017/GalleryDB
3. Usunąć rekord z adminem w kolekcji users, ponieważ przykład zawiera admina.
4. Wejść w GalleryDB i dla każdej znajdującej się tam kolekcji -> nacisnąć przycisk ADD DATA -> import JSON
5. Przerzucić zdjęcia z example_import/images do public/images.
📦 Zależności projektu
Pakiet	Wersja	Opis
bcrypt	^6.0.0	Haszowanie haseł, bezpieczne logowanie.
bootstrap	^5.3.7	Frontendowy framework CSS/JS.
cookie-parser	~1.4.4	Middleware do parsowania ciasteczek.
debug	~2.6.9	Narzędzie do logowania debug.
express	^4.21.2	Framework aplikacji webowej dla Node.js.
express-async-handler	^1.2.0	Obsługa błędów w funkcjach asynchronicznych.
express-validator	^7.2.1	Walidacja i sanitizacja danych wejściowych.
http-errors	~1.6.3	Tworzenie błędów HTTP, np. 404 lub 500.
jsonwebtoken	^9.0.2	Obsługa tokenów JWT do autoryzacji i uwierzytelniania.
mongoose	^8.16.0	ODM (Object Data Modeling) dla MongoDB.
morgan	~1.9.1	Middleware do logowania zapytań HTTP.
multer	^2.0.1	Obsługa przesyłania plików (np. zdjęć).
pug	^2.0.4	Silnik szablonów HTML używany w Express.
validator	^13.15.15	Biblioteka do walidacji i sanitizacji ciągów tekstowych.
